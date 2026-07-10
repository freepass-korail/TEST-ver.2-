import { create } from 'zustand';
import { playBase64Audio } from '../utils/audio';
import { clearSession, loadSession, saveSession } from '../utils/session';

const emptyTicket = {
  trainName: '',
  travelDate: '',
  departureStation: '',
  arrivalStation: '',
  departureTime: '',
  arrivalTime: '',
  platform: '',
  carNumber: '',
  seatNumber: '',
  seatClass: '',
  ticketNumber: '',
};

function stepToDestination(step) {
  if (!step) return null;
  return {
    lat: step.lat,
    lng: step.lng,
    label: step.name ?? '',
  };
}

const _saved = loadSession();

const useFlowStore = create((set, get) => ({
  step: _saved?.step ?? 'SMS',
  mapInstance: null,
  voiceGuide: _saved?.voiceGuide ?? true,

  reservationId: _saved?.reservationId ?? null,
  ticketInfo: _saved?.ticketInfo ?? { ...emptyTicket },
  fromNode: _saved?.fromNode ?? null,
  toNode: _saved?.toNode ?? null,

  routeId: _saved?.routeId ?? null,
  routeSteps: _saved?.routeSteps ?? [],
  totalDistanceM: _saved?.totalDistanceM ?? null,
  currentStepIndex: _saved?.currentStepIndex ?? 0,
  currentInstruction: _saved?.currentInstruction ?? '',
  routeLoading: false,
  routeError: null,
  audioMap: _saved?.audioMap ?? {},
  screenTextMap: _saved?.screenTextMap ?? {},

  destination: (() => {
    if (!_saved?.routeSteps?.length) return null;
    return stepToDestination(_saved.routeSteps[_saved.currentStepIndex ?? 0]);
  })(),
  position: null,
  heading: 0,
  bearing: null,
  distanceM: null,
  destinationAngle: 0,
  isTracking: false,
  geoError: null,
  overshoot: false,

  setStep: (nextStep) => {
    set({ step: nextStep });
    saveSession({ ...get(), step: nextStep });
  },

  setReservation: (id, info, fromNode = null, toNode = null) =>
    set({
      reservationId: id,
      ticketInfo: { ...emptyTicket, ...info },
      fromNode,
      toNode,
    }),

  setRouteLoading: (routeLoading) => set({ routeLoading }),
  setRouteError: (routeError) => set({ routeError }),

  setAudioMap: (audioMap) => set({ audioMap }),

  setScreenTextMap: (screenTextMap) => set({ screenTextMap }),

  setRoute: (route) => {
    const steps = route?.steps ?? [];
    const first = steps[0] ?? null;
    const { screenTextMap } = get();

    const firstInstruction =
      (first?.nodeId && screenTextMap[first.nodeId]) ?? first?.instruction ?? '';

    set({
      routeId: route?.routeId ?? null,
      routeSteps: steps,
      totalDistanceM: route?.totalDistanceM ?? null,
      currentStepIndex: 0,
      currentInstruction: firstInstruction,
      destination: stepToDestination(first),
      routeError: null,
      distanceM: null,
      bearing: null,
      destinationAngle: 0,
    });
    saveSession(get());
  },

  getCurrentStep: () => {
    const { routeSteps, currentStepIndex } = get();
    return routeSteps[currentStepIndex] ?? null;
  },

  advanceStep: () => {
    const { routeSteps, currentStepIndex, audioMap, screenTextMap, voiceGuide } = get();
    const nextIndex = currentStepIndex + 1;
    if (nextIndex >= routeSteps.length) return false;

    const next = routeSteps[nextIndex];
    const currentNode = routeSteps[currentStepIndex];
    const nextInstruction =
      (next?.nodeId && screenTextMap[next.nodeId]) ?? next?.instruction ?? '';

    set({
      currentStepIndex: nextIndex,
      currentInstruction: nextInstruction,
      destination: stepToDestination(next),
      distanceM: null,
      bearing: null,
      destinationAngle: 0,
    });

    if (voiceGuide) {
      const audio = audioMap[currentNode?.nodeId];
      if (audio) playBase64Audio(audio);
    }

    saveSession(get());
    return true;
  },

  playCurrentStepAudio: () => {
    const { routeSteps, currentStepIndex, audioMap, voiceGuide } = get();
    if (!voiceGuide) return;
    const audio = audioMap[routeSteps[currentStepIndex]?.nodeId];
    if (audio) playBase64Audio(audio);
  },

  toggleVoiceGuide: () => set((state) => ({ voiceGuide: !state.voiceGuide })),

  setMapInstance: (map) => set({ mapInstance: map }),

  setNavigation: (payload) => set((state) => ({ ...state, ...payload })),

  setGeoError: (geoError) => set({ geoError }),

  moveToLocation: (lat, lng) => {
    const map = get().mapInstance;
    if (map) {
      map.panTo?.({ lat, lng });
    }
  },

  resetFlow: () => {
    clearSession();
    set({
      step: 'SMS',
      reservationId: null,
      ticketInfo: { ...emptyTicket },
      fromNode: null,
      toNode: null,
      routeId: null,
      routeSteps: [],
      totalDistanceM: null,
      currentStepIndex: 0,
      currentInstruction: '',
      routeLoading: false,
      routeError: null,
      audioMap: {},
      screenTextMap: {},
      destination: null,
      position: null,
      heading: 0,
      bearing: null,
      distanceM: null,
      destinationAngle: 0,
      isTracking: false,
      geoError: null,
      overshoot: false,
    });
  },
}));

export default useFlowStore;

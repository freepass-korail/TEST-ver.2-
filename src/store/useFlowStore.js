// src/store/useFlowStore.js
import { create } from 'zustand';
import { defaultTicket } from '../data/defaultTicket';

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

const useFlowStore = create((set, get) => ({
  step: 'SMS',
  mapInstance: null,
  voiceGuide: true,

  reservationId: null,
  ticketInfo: { ...emptyTicket },

  setStep: (nextStep) => set({ step: nextStep }),

  setReservation: (id, info) =>
    set({
      reservationId: id,
      ticketInfo: { ...get().ticketInfo, ...defaultTicket, ...info },
    }),

  toggleVoiceGuide: () => set((state) => ({ voiceGuide: !state.voiceGuide })),

  setMapInstance: (map) => set({ mapInstance: map }),

  moveToLocation: (lat, lng) => {
    const map = get().mapInstance;
    if (map) {
      console.log(`[Zustand] 지도를 위도: ${lat}, 경도: ${lng}로 이동합니다.`);
    } else {
      console.warn('[Zustand] 지도 객체가 아직 초기화되지 않았습니다.');
    }
  },

  resetFlow: () =>
    set({
      step: 'SMS',
      reservationId: null,
      ticketInfo: { ...emptyTicket },
    }),
}));

export default useFlowStore;

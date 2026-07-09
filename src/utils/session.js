const SESSION_KEY = 'korail_guide_session';

const PERSIST_KEYS = [
  'step',
  'reservationId',
  'ticketInfo',
  'fromNode',
  'toNode',
  'routeId',
  'routeSteps',
  'totalDistanceM',
  'currentStepIndex',
  'currentInstruction',
  'audioMap',
  'voiceGuide',
];

const RESUMABLE_STEPS = new Set(['S3', 'S4', 'S5', 'S5_1', 'E1', 'E2']);

export function saveSession(state) {
  if (!RESUMABLE_STEPS.has(state.step)) return;

  try {
    const snapshot = {};
    PERSIST_KEYS.forEach((k) => { snapshot[k] = state[k]; });
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
  } catch {
    // sessionStorage 용량 초과(audioMap이 클 수 있음) — audioMap 제외하고 재시도
    try {
      const snapshot = {};
      PERSIST_KEYS.filter((k) => k !== 'audioMap').forEach((k) => { snapshot[k] = state[k]; });
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(snapshot));
    } catch { /* 저장 실패 무시 */ }
  }
}

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!RESUMABLE_STEPS.has(data.step)) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch { /* 무시 */ }
}

import { getMockRoute, getMockSession } from './mockGuide';

const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false';

async function parseJsonResponse(response) {
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `API failed: ${response.status}`);
  }
  return response.json();
}

/**
 * SMS/URL 토큰으로 승차권 세션 조회
 * @param {string} token
 */
export async function fetchSession(token) {
  if (USE_MOCK_API) {
    return getMockSession(token);
  }

  const response = await fetch(`/api/v1/guide/sessions/${encodeURIComponent(token)}`);
  return parseJsonResponse(response);
}

/**
 * reservationId 기준 최적 경로(steps) 조회
 * @param {{ reservationId: string, startNodeId?: string, lat?: number, lng?: number }} params
 */
export async function fetchRoute(params) {
  if (USE_MOCK_API) {
    return getMockRoute(params.reservationId);
  }

  const response = await fetch('/api/v1/guide/routes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  return parseJsonResponse(response);
}

/**
 * 보호자 알림 — 길찾기 완료 API
 * @param {string} reservationId
 */
export async function completeGuide(reservationId) {
  if (USE_MOCK_API) {
    return { success: true, reservationId };
  }

  const response = await fetch('/api/v1/guide/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservationId }),
  });

  return parseJsonResponse(response);
}

import { defaultTicket } from '../data/defaultTicket';
import { DEFAULT_DESTINATION } from '../data/destination';

const final = DEFAULT_DESTINATION;

/** 백엔드 API 미연동 시 사용하는 mock 세션 */
export function getMockSession(token) {
  return {
    reservationId: token || 'mock-reservation-001',
    ticket: { ...defaultTicket },
  };
}

/** 백엔드 API 미연동 시 사용하는 mock 경로 (노드 순서 + 좌표 + instruction) */
export function getMockRoute(reservationId) {
  return {
    routeId: `mock-route-${reservationId ?? '001'}`,
    startNodeId: 'n01',
    endNodeId: 'n15',
    totalDistanceM: 420,
    steps: [
      {
        order: 1,
        nodeId: 'n01',
        name: '3번 출구',
        lat: final.lat - 0.001,
        lng: final.lng - 0.001,
        layer: 1,
        instruction: '3번 출구에서 역 안으로 들어가세요.',
      },
      {
        order: 2,
        nodeId: 'n05',
        name: '에스컬레이터',
        lat: final.lat - 0.0005,
        lng: final.lng - 0.0005,
        layer: 1,
        instruction: '에스컬레이터를 타고 2층으로 올라가세요.',
      },
      {
        order: 3,
        nodeId: 'n15',
        name: final.label,
        lat: final.lat,
        lng: final.lng,
        layer: 2,
        instruction: '5번 승강장으로 이동하세요.',
      },
    ],
  };
}

/**
 * S5 walk/stream 구동 여부.
 * VITE_USE_WALK_STREAM=false 이면 GPS 모드.
 */
export function isWalkStreamEnabled() {
  return import.meta.env.VITE_USE_WALK_STREAM !== 'false';
}

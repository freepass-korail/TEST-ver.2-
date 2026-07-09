import { useCallback, useEffect, useRef, useState } from 'react';
import { getDistanceMeters, GEOLOCATION_OPTIONS, getGeolocationErrorMessage, PERMISSION_REQUEST_OPTIONS } from '../utils/geo';

/** 직전 위치 대비 이 거리(m) 이상 순간 이동하면 튐으로 간주해 무시 */
const GPS_SPIKE_THRESHOLD_M = 150;

/** S2 등에서 1회 권한 요청용 */
export function requestGeolocationPermission(options = PERMISSION_REQUEST_OPTIONS) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('이 브라우저는 위치 서비스를 지원하지 않습니다.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => reject(new Error(getGeolocationErrorMessage(err.code))),
      options
    );
  });
}

function useGeolocation() {
  const watchIdRef = useRef(null);
  const lastPosRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);

  const stopWatch = useCallback(() => {
    if (watchIdRef.current != null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    lastPosRef.current = null;
    setIsWatching(false);
  }, []);

  const startWatch = useCallback(
    (onUpdate, options = GEOLOCATION_OPTIONS) => {
      if (!('geolocation' in navigator)) {
        setError('이 브라우저는 위치 서비스를 지원하지 않습니다.');
        return;
      }

      stopWatch();
      setError(null);
      setIsWatching(true);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const next = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };

          // GPS 튐 필터: 직전 위치 대비 급격한 이동은 무시
          if (lastPosRef.current) {
            const dist = getDistanceMeters(
              lastPosRef.current.lat,
              lastPosRef.current.lng,
              next.lat,
              next.lng
            );
            if (dist > GPS_SPIKE_THRESHOLD_M) {
              console.warn(`[GPS] 좌표 튐 감지 (${Math.round(dist)}m) — 무시`);
              return;
            }
          }

          lastPosRef.current = next;
          setPosition(next);
          setError(null);
          onUpdate?.(next, pos);
        },
        (err) => {
          setError(getGeolocationErrorMessage(err.code));
          setIsWatching(false);
        },
        options
      );
    },
    [stopWatch]
  );

  useEffect(() => () => stopWatch(), [stopWatch]);

  return {
    position,
    error,
    isWatching,
    startWatch,
    stopWatch,
    requestPermission: requestGeolocationPermission,
  };
}

export default useGeolocation;

import { useCallback, useEffect, useRef } from 'react';
import { openGuideWalkStream } from '../api/tickets';
import useFlowStore from '../store/useFlowStore';
import { getArrowRotation, getBearing } from '../utils/geo';
import useDeviceOrientation from './useDeviceOrientation';

/**
 * guide/walk/stream SSE로 S5 내비게이션 UI를 구동한다.
 * 화살표: destinationAngle = bearing(현재 노드 → 다음 노드) − deviceHeading
 * @param {{ enabled?: boolean, intervalMs?: number, jitterM?: number }} [options]
 */
function useWalkStream({
  enabled = true,
  intervalMs = 5000,
  jitterM = 1,
} = {}) {
  const esRef = useRef(null);
  const arrivedRef = useRef(false);

  const applyWalkStep = useFlowStore((s) => s.applyWalkStep);
  const setStep = useFlowStore((s) => s.setStep);
  const setNavigation = useFlowStore((s) => s.setNavigation);
  const { startListening, stopListening } = useDeviceOrientation();

  const syncArrowFromHeading = useCallback(
    (heading) => {
      const { routeSteps, currentStepIndex, destination } = useFlowStore.getState();
      const from = routeSteps[currentStepIndex];
      const toLat = destination?.lat ?? from?.lat;
      const toLng = destination?.lng ?? from?.lng;
      if (from?.lat == null || toLat == null) {
        setNavigation({ heading });
        return;
      }
      const bearing = getBearing(from.lat, from.lng, toLat, toLng);
      setNavigation({
        heading,
        bearing,
        destinationAngle: getArrowRotation(bearing, heading),
      });
    },
    [setNavigation],
  );

  const stopStream = useCallback(() => {
    esRef.current?.close();
    esRef.current = null;
    stopListening();
    setNavigation({ isTracking: false });
  }, [setNavigation, stopListening]);

  useEffect(() => {
    if (!enabled) return undefined;

    const { ticketInfo, fromNode, routeSteps } = useFlowStore.getState();
    const userId = Number(ticketInfo?.userId);
    if (!userId || userId <= 0) {
      console.warn('[walk/stream] userId 없음 — 스트림 시작 안 함');
      return undefined;
    }
    if (routeSteps.length === 0) return undefined;

    arrivedRef.current = false;
    setNavigation({ isTracking: true, distanceM: null, overshoot: false });

    startListening(syncArrowFromHeading);

    const finish = () => {
      if (arrivedRef.current) return;
      arrivedRef.current = true;
      esRef.current?.close();
      esRef.current = null;
      stopListening();
      setNavigation({ isTracking: false });
      setStep('S5_1');
    };

    console.log('[walk/stream] start', { userId, fromNode, intervalMs, jitterM });

    esRef.current = openGuideWalkStream(userId, {
      fromNode: fromNode || undefined,
      intervalMs,
      jitterM,
      onStep: (step) => {
        if (arrivedRef.current) return;
        console.log('[walk/stream] step', {
          seq: step.seq,
          nodeId: step.nodeId,
          remainingAlongRouteM: step.remainingAlongRouteM,
          arrived: step.arrived,
          screenText: step.guide?.screenText,
          audioLen: step.guide?.audioBase64?.length ?? 0,
        });
        applyWalkStep(step);
        if (step.arrived) finish();
      },
      onDone: (data) => {
        console.log('[walk/stream] done', data);
        finish();
      },
      onInfo: (data) => {
        console.log('[walk/stream] info', data);
        stopStream();
      },
      onError: (err) => {
        console.error('[walk/stream] error', err);
      },
    });

    return () => {
      esRef.current?.close();
      esRef.current = null;
      stopListening();
    };
  }, [
    enabled,
    intervalMs,
    jitterM,
    applyWalkStep,
    setStep,
    setNavigation,
    startListening,
    stopListening,
    stopStream,
    syncArrowFromHeading,
  ]);

  return { stopStream };
}

export default useWalkStream;

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import useFlowStore from '../store/useFlowStore';
import S1_Join from './S1_Join';
import PermissionModal from './common/PermissionModal';
import GeolocationDeniedModal from './common/GeolocationDeniedModal';
import { requestGeolocationPermission } from '../hooks/useGeolocation';
import {
  needsIOSOrientationPermission,
  requestOrientationPermission,
} from '../hooks/useDeviceOrientation';
import { queryGeolocationPermission } from '../utils/geo';

const OverlayRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const BUILD_ID = typeof __BUILD_ID__ !== 'undefined' ? __BUILD_ID__ : 'local';

const SAFARI_LOCATION_RESET = `Safari에 '거부'가 저장되어 있으면
팝업 없이 계속 실패합니다.

① 주소창 왼쪽 aA → 웹사이트 설정
② 위치 → '허용' 또는 '묻기'
③ 페이지 새로고침
④ 2단계: 위치 허용 버튼 다시 누르기`;

const INAPP_HINT =
  '카카오톡 등 앱 안 브라우저에서는 위치 권한이 동작하지 않을 수 있습니다. Safari에서 직접 열어 주세요.';

function S2_Permission() {
  const { setStep, mapInstance } = useFlowStore();
  const isIOS = needsIOSOrientationPermission();
  const [phase, setPhase] = useState('intro');
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    queryGeolocationPermission().then((state) => {
      if (state === 'denied') {
        setErrorMessage(
          `Safari에 위치 권한이 '거부'로 저장되어 있습니다.\n\n${SAFARI_LOCATION_RESET}\n\n${INAPP_HINT}\n\n(빌드 ${BUILD_ID})`
        );
      }
    });
  }, []);

  const handlePermissionSuccess = () => {
    if (mapInstance) {
      mapInstance.panTo({ lat: 37.1282075, lng: 128.2052678 });
    }
    setIsRequesting(false);
    setPhase('intro');
    setErrorMessage(null);
    setStep('S3');
  };

  const handleLocationRequest = () => {
    setIsRequesting(true);
    setPhase(isIOS ? 'waiting-location' : 'intro');
    setErrorMessage(null);

    requestGeolocationPermission()
      .then(() => handlePermissionSuccess())
      .catch((error) => {
        console.error('위치 권한 실패', error);
        setIsRequesting(false);
        setPhase(isIOS ? 'location' : 'intro');
        setErrorMessage(
          `방향 센서는 허용되었습니다.\n${error.message}\n\n아래 설정에서 위치를 '허용'으로 바꾼 뒤\n「2단계: 위치 허용」을 다시 눌러 주세요.\n\n${SAFARI_LOCATION_RESET}\n\n${INAPP_HINT}\n\n(빌드 ${BUILD_ID})`
        );
      });
  };

  const handleOrientationRequest = () => {
    setIsRequesting(true);
    setPhase('waiting-orientation');
    setErrorMessage(null);

    requestOrientationPermission()
      .then(() => {
        setIsRequesting(false);
        setPhase('location');
      })
      .catch((error) => {
        console.error('방향 센서 권한 실패', error);
        setIsRequesting(false);
        setPhase('intro');
        setErrorMessage(`${error.message}\n\n${INAPP_HINT}\n\n(빌드 ${BUILD_ID})`);
      });
  };

  const handleAndroidPermissions = () => {
    setIsRequesting(true);
    setErrorMessage(null);

    const geoPromise = requestGeolocationPermission();
    const orientPromise = requestOrientationPermission();

    Promise.allSettled([geoPromise, orientPromise]).then(([geoResult, orientResult]) => {
      const geoError = geoResult.status === 'rejected' ? geoResult.reason : null;
      const orientError = orientResult.status === 'rejected' ? orientResult.reason : null;

      if (!geoError && !orientError) {
        handlePermissionSuccess();
        return;
      }

      setIsRequesting(false);
      const parts = [geoError?.message, orientError?.message].filter(Boolean);
      setErrorMessage(`${parts.join('\n')}\n\n${SAFARI_LOCATION_RESET}\n\n${INAPP_HINT}\n\n(빌드 ${BUILD_ID})`);
    });
  };

  const handleAllow = () => {
    if (isRequesting) return;

    if (isIOS) {
      if (phase === 'intro') {
        handleOrientationRequest();
        return;
      }
      if (phase === 'location') {
        handleLocationRequest();
      }
      return;
    }

    handleAndroidPermissions();
  };

  const modalPhase = isIOS
    ? isRequesting
      ? phase === 'waiting-orientation'
        ? 'waiting-orientation'
        : 'waiting-location'
      : phase
    : 'intro';

  return (
    <OverlayRoot>
      <S1_Join dimmed />
      <PermissionModal
        phase={modalPhase}
        isIOS={isIOS}
        isRequesting={!isIOS && isRequesting}
        onAllow={handleAllow}
        onDeny={() => setStep('E1')}
      />
      {errorMessage && (
        <GeolocationDeniedModal
          message={errorMessage}
          onRetry={() => {
            setErrorMessage(null);
            if (isIOS && phase === 'location') {
              handleLocationRequest();
            } else {
              handleAllow();
            }
          }}
          onFallback={() => setStep('E1')}
        />
      )}
    </OverlayRoot>
  );
}

export default S2_Permission;

import styled from 'styled-components';
import useFlowStore from '../store/useFlowStore';
import S1_Join from './S1_Join';
import PermissionModal from './common/PermissionModal';

const OverlayRoot = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

function S2_Permission() {
  const { setStep, mapInstance } = useFlowStore();

  const handlePermissionSuccess = () => {
    if (mapInstance) {
      mapInstance.panTo({ lat: 37.1282075, lng: 128.2052678 });
    }
    setStep('S3');
  };

  const requestiOSOrientation = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          handlePermissionSuccess();
        } else {
          setStep('E1');
        }
      } catch (error) {
        console.error('iOS 센서 요청 실패', error);
        setStep('E1');
      }
    } else {
      handlePermissionSuccess();
    }
  };

  const handleRequestPermissions = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          await requestiOSOrientation();
        },
        (error) => {
          console.error('GPS 권한 거부됨', error);
          setStep('E1');
        }
      );
    } else {
      setStep('E1');
    }
  };

  return (
    <OverlayRoot>
      <S1_Join dimmed />
      <PermissionModal
        onAllow={handleRequestPermissions}
        onDeny={() => setStep('E1')}
      />
    </OverlayRoot>
  );
}

export default S2_Permission;

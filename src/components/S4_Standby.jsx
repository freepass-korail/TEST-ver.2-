import React from 'react';
import useFlowStore from '../store/useFlowStore';
import ScreenShell from './common/ScreenShell';
import FigmaPrimaryButton from './common/FigmaPrimaryButton';
import { screenConfig } from '../styles/theme';

function S4_Standby() {
  const { setStep } = useFlowStore();
  const config = screenConfig.S4;

  return (
    <ScreenShell
      showHeader={config.showHeader}
      title={'타는 곳을\n확인해 주세요.'}
      bottomButton={
        <FigmaPrimaryButton onClick={() => setStep('S5')}>길찾기 시작</FigmaPrimaryButton>
      }
    />
  );
}

export default S4_Standby;

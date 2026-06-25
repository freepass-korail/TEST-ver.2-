import React from 'react';
import useFlowStore from '../store/useFlowStore';
import ScreenShell from './common/ScreenShell';
import { FigmaDualButtons } from './common/FigmaPrimaryButton';
import { screenConfig } from '../styles/theme';

function S3_CheckFloor() {
  const { setStep } = useFlowStore();
  const config = screenConfig.S3;

  return (
    <ScreenShell
      showHeader={config.showHeader}
      title={'지금 현재 2층에\n계신가요?'}
      dualButtons={
        <FigmaDualButtons
          left={{ label: '아니오', onClick: () => setStep('E2') }}
          right={{ label: '네', onClick: () => setStep('S4') }}
        />
      }
    />
  );
}

export default S3_CheckFloor;

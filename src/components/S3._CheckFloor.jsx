import React from 'react';
import useFlowStore from '../store/useFlowStore';
import ScreenShell from './common/ScreenShell';
import { FigmaDualButtons } from './common/FigmaPrimaryButton';
import { screenConfig } from '../styles/theme';

const s3TitleSpec = {
  width: 340,
  height: 112,
  top: 371,
  left: 31,
  fontSize: 36,
  fontWeight: 700,
  lineHeight: '140%',
  color: '#000000',
};

function S3_CheckFloor() {
  const { setStep } = useFlowStore();
  const config = screenConfig.S3;

  return (
    <ScreenShell
      showHeader={config.showHeader}
      title={'현재 3층 맞이방에\n계신가요?'}
      titleSpec={s3TitleSpec}
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

import React, { useEffect } from 'react';
import useFlowStore from '../store/useFlowStore';
import ScreenShell from './common/ScreenShell';
import FigmaPrimaryButton from './common/FigmaPrimaryButton';
import { screenConfig } from '../styles/theme';
import { vibrateOnArrival } from '../utils/haptics';

function S1_Join({ dimmed = false }) {
  const { setStep } = useFlowStore();

  useEffect(() => {
    vibrateOnArrival();
  }, []);
  const config = screenConfig.S1;

  return (
    <ScreenShell
      showHeader={config.showHeader}
      title={'타는 곳까지\n안내해 드릴게요.'}
      bottomButton={
        <FigmaPrimaryButton dimmed={dimmed} onClick={() => setStep('S2')}>
          시작하기
        </FigmaPrimaryButton>
      }
    />
  );
}

export default S1_Join;

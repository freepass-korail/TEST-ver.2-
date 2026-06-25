import React from 'react';
import useFlowStore from '../store/useFlowStore';
import ScreenShell from './common/ScreenShell';
import FigmaPrimaryButton from './common/FigmaPrimaryButton';
import ktxLogo from '../assets/ktx-logo.png';
import { defaultTicket } from '../data/defaultTicket';
import { screenConfig, typography } from '../styles/theme';
import { abs, figma, figmaText } from '../styles/figmaLayout';

function parsePlatformNumber(platform) {
  return platform.replace(/[^0-9]/g, '') || '5';
}

function parseCarDigits(carNumber) {
  const digits = carNumber.replace(/[^0-9]/g, '').split('');
  return digits.length ? digits : ['1', '2'];
}

function S4_Standby() {
  const { ticketInfo, setStep } = useFlowStore();
  const config = screenConfig.S4;
  const s4 = figma.s4;
  const info = { ...defaultTicket, ...ticketInfo };
  const text = (spec) => figmaText(spec, typography.fontFamily);
  const platformNum = parsePlatformNumber(info.platform);
  const carDigits = parseCarDigits(info.carNumber);

  return (
    <ScreenShell
      showHeader={config.showHeader}
      bottomButton={
        <FigmaPrimaryButton onClick={() => setStep('S5')}>길찾기 시작</FigmaPrimaryButton>
      }
    >
      <p style={text(s4.platformLabel)}>타는 곳</p>

      <div
        style={{
          ...abs(s4.platformCircle),
          borderRadius: s4.platformCircle.radius,
          background: s4.platformCircle.background,
        }}
      />

      <p style={text(s4.platformNumber)}>{platformNum}</p>
      <p style={text(s4.platformSuffix)}>번</p>

      <p style={text(s4.carLabel)}>호차번호</p>

      <img
        src={ktxLogo}
        alt="KTX"
        draggable={false}
        style={{
          ...abs(s4.ktxLogo),
          objectFit: 'contain',
        }}
      />

      {s4.carDigits.map((item, i) => (
        <React.Fragment key={i}>
          <div
            style={{
              ...abs(item.circle),
              borderRadius: '50%',
              background: item.circle.background,
            }}
          />
          <p style={text(item.digit)}>{carDigits[i] ?? ''}</p>
        </React.Fragment>
      ))}
    </ScreenShell>
  );
}

export default S4_Standby;

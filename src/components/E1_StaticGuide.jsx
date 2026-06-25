import React from 'react';
import useFlowStore from '../store/useFlowStore';
import ScreenShell from './common/ScreenShell';
import FigmaPrimaryButton from './common/FigmaPrimaryButton';
import { defaultTicket } from '../data/defaultTicket';
import { colors, screenConfig, typography } from '../styles/theme';
import { figma } from '../styles/figmaLayout';

function E1_StaticGuide() {
  const { ticketInfo, setStep } = useFlowStore();
  const config = screenConfig.E1;
  const { scheduleCard, trainName, ticketCard } = figma;

  const info = { ...defaultTicket, ...ticketInfo };

  return (
    <ScreenShell
      showHeader={config.showHeader}
      bottomButton={
        <FigmaPrimaryButton onClick={() => setStep('S4')}>안내 시작</FigmaPrimaryButton>
      }
    >
      {/* 일정 카드 */}
      <div
        style={{
          position: 'absolute',
          top: scheduleCard.top,
          left: scheduleCard.left,
          width: scheduleCard.width,
          height: scheduleCard.height,
          borderRadius: scheduleCard.radius,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            background: colors.primary,
            fontSize: 16,
            fontWeight: 700,
            color: colors.white,
          }}
        >
          {info.travelDate}
        </div>
        <div
          style={{
            display: 'flex',
            height: 110,
            alignItems: 'center',
            padding: '0 8px',
            backgroundColor: colors.cardLight,
          }}
        >
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: colors.black }}>{info.departureStation}</p>
              <p style={{ marginTop: 4, fontSize: 24, fontWeight: 700, color: colors.black }}>{info.departureTime}</p>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: colors.primary }}>→</span>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: colors.black }}>{info.arrivalStation}</p>
              <p style={{ marginTop: 4, fontSize: 24, fontWeight: 700, color: colors.black }}>{info.arrivalTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 열차명 */}
      <p
        style={{
          position: 'absolute',
          top: trainName.top,
          left: trainName.left,
          width: trainName.width,
          height: trainName.height,
          margin: 0,
          fontFamily: typography.fontFamily,
          fontSize: trainName.fontSize,
          fontWeight: trainName.fontWeight,
          lineHeight: trainName.lineHeight,
          color: trainName.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {info.trainName}
      </p>

      {/* 승차 정보 카드 */}
      <div
        style={{
          position: 'absolute',
          top: ticketCard.top,
          left: ticketCard.left,
          width: ticketCard.width,
          height: ticketCard.height,
          borderRadius: ticketCard.radius,
          backgroundColor: colors.ticketCardBg,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px 8px 20px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {[
            { label: '타는곳', value: info.platform },
            { label: '호차번호', value: info.carNumber },
            { label: '좌석번호', value: info.seatNumber },
          ].map((item, i) => (
            <div key={item.label} style={{ textAlign: 'center', borderLeft: i > 0 ? '1px solid #B8CFF5' : 'none' }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: colors.gray }}>{item.label}</p>
              <p style={{ marginTop: 8, fontSize: 30, fontWeight: 700, lineHeight: 1, color: colors.black }}>{item.value}</p>
            </div>
          ))}
        </div>
        <div>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 500, color: '#888888' }}>{info.seatClass}</p>
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', padding: '0 12px', fontSize: 11, color: '#AAAAAA' }}>
            <span>승차권번호</span>
            <span>{info.ticketNumber}</span>
          </div>
        </div>
      </div>
    </ScreenShell>
  );
}

export default E1_StaticGuide;

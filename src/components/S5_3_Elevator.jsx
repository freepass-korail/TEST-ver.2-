/**
 * S5_3 — 엘리베이터 탑승 중
 * GPS/나침반 없이 링 중앙 고정 점 + "엘리베이터에서 내리면 이어서 안내할게요." 안내
 */
import React, { useMemo } from 'react';
import closeIconSvg from '../assets/close.svg';
import useFlowStore from '../store/useFlowStore';
import useNavigationTracking from '../hooks/useNavigationTracking';
import useDepartureUrgent from '../hooks/useDepartureUrgent';
import { DEPARTURE_URGENT_COLOR } from '../utils/time';
import { formatGuideDistance } from '../utils/geo';
import { typography } from '../styles/theme';
import { abs, figma, figmaText } from '../styles/figmaLayout';

const FF = typography.fontFamily;

function S5_3_Elevator() {
  const ticketInfo   = useFlowStore((s) => s.ticketInfo);
  const routeSteps   = useFlowStore((s) => s.routeSteps);
  const distanceM    = useFlowStore((s) => s.distanceM);
  const setStep      = useFlowStore((s) => s.setStep);
  const setGeoError  = useFlowStore((s) => s.setGeoError);

  const { stopTracking } = useNavigationTracking({ enabled: routeSteps.length > 0 });

  const s5 = figma.s5;
  const info = ticketInfo;
  const departureUrgent = useDepartureUrgent(info.departureTime);
  const text = (spec) => figmaText(spec, FF);
  const leftText = (spec) => ({ ...text(spec), textAlign: 'left', justifyContent: 'flex-start' });

  const distanceDisplay = useMemo(() => formatGuideDistance(distanceM), [distanceM]);

  const handleClose = () => {
    stopTracking();
    setGeoError(null);
    setStep('S4');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: s5.background, overflow: 'hidden' }}>

      {/* ── 상단 출발 시간 카드 ── */}
      <div style={{ ...abs(s5.timeCard), borderRadius: s5.timeCard.radius, background: s5.timeCard.background }} />
      <p style={leftText(s5.timeLabel)}>기차 출발 시간</p>
      <p style={{ ...leftText(s5.timeValue), color: departureUrgent ? DEPARTURE_URGENT_COLOR : s5.timeValue.color }}>
        {info.departureTime}
      </p>

      {/* ── 상단 승차 정보 카드 ── */}
      <div style={{ ...abs(s5.ticketCard), borderRadius: s5.ticketCard.radius, background: s5.ticketCard.background }} />
      <p style={{ ...text(s5.route), whiteSpace: 'nowrap', fontSize: 16 }}>{`${info.departureStation}→${info.arrivalStation}`}</p>
      <p style={text(s5.trainName)}>{info.trainName}</p>
      <p style={text(s5.platformLabel)}>타는곳</p>
      <p style={text(s5.carLabel)}>호차번호</p>
      <p style={text(s5.seatLabel)}>좌석번호</p>
      <p style={{ ...text(s5.platformValue), whiteSpace: 'nowrap' }}>{info.platform}</p>
      <p style={{ ...text(s5.carValue), whiteSpace: 'nowrap' }}>{info.carNumber}</p>
      <p style={{ ...text(s5.seatValue), whiteSpace: 'nowrap' }}>{info.seatNumber}</p>
      {s5.dividers.map((line, i) => (
        <div key={i} style={{ position: 'absolute', top: line.top, left: line.left, width: 0, height: line.height, borderLeft: line.border }} />
      ))}

      {/* ── 외부 링 ── */}
      <div style={{ ...abs(s5.outerRing), borderRadius: s5.outerRing.radius, background: '#FFFFFF1A' }} />

      {/* ── 내부 링 ── */}
      <div style={{
        position: 'absolute', top: 247, left: 59,
        width: 283, height: 283, borderRadius: 180,
        background: '#FFFFFF1A',
      }} />

      {/* ── 중앙 고정 점 ── */}
      <div style={{
        position: 'absolute', top: 367, left: 181,
        width: 39, height: 39, borderRadius: '50%',
        background: '#FFFFFF',
      }} />

      {/* ── 거리 ── */}
      <div style={{
        position: 'absolute', top: s5.distanceValue.top, left: s5.distanceValue.left,
        display: 'flex', alignItems: 'baseline', gap: 4,
      }}>
        <span style={{
          fontFamily: FF, fontSize: distanceDisplay.fontSize,
          fontWeight: s5.distanceValue.fontWeight, color: s5.distanceValue.color,
          fontVariantNumeric: 'tabular-nums', lineHeight: 1,
        }}>
          {distanceDisplay.value}
        </span>
        <span style={{
          fontFamily: FF, fontSize: s5.distanceUnit.fontSize,
          fontWeight: s5.distanceUnit.fontWeight, color: s5.distanceUnit.color,
          lineHeight: 1,
        }}>
          {distanceDisplay.unit}
        </span>
      </div>

      {/* ── 안내 문구 ── */}
      <p style={{
        position: 'absolute', top: 667, left: 40, width: 301, height: 90,
        fontFamily: FF, fontSize: 32, fontWeight: 600,
        lineHeight: '140%', letterSpacing: 0,
        color: '#FFFFFF', margin: 0, whiteSpace: 'pre-line',
      }}>
        {'엘리베이터에서 내리면\n이어서 안내할게요.'}
      </p>

      {/* ── 닫기 ── */}
      <button
        type="button"
        aria-label="길찾기 종료"
        onClick={handleClose}
        style={{
          ...abs(s5.closeButton),
          borderRadius: s5.closeButton.radius,
          background: s5.closeButton.background,
          border: 'none', padding: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <img src={closeIconSvg} alt="닫기" style={{ width: s5.closeIcon.width, height: s5.closeIcon.height }} />
      </button>
    </div>
  );
}

export default S5_3_Elevator;

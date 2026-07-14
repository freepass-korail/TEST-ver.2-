import React, { useEffect, useState } from 'react';
import { typography } from '../../styles/theme';

const FF = typography.fontFamily;

export default function NetworkOfflineOverlay() {
  const [offline, setOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline  = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online',  goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online',  goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 9999,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'flex-start',
      paddingTop: 16,
      background: 'transparent',
      pointerEvents: 'none',
    }}>
      {/* 상단 배너 */}
      <div style={{
        background: '#1A1A2E',
        borderRadius: 8,
        padding: '6px 16px',
        marginBottom: 8,
        pointerEvents: 'auto',
      }}>
        <span style={{ fontFamily: FF, fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
          네트워크 끊김
        </span>
      </div>

      {/* 중앙 카드 */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -60%)',
        background: '#FFFFFF',
        borderRadius: 16,
        padding: '28px 32px',
        textAlign: 'center',
        boxShadow: '0px 4px 24px rgba(0,0,0,0.18)',
        pointerEvents: 'auto',
        minWidth: 220,
      }}>
        {/* 스피너 */}
        <Spinner />

        <p style={{
          fontFamily: FF, fontSize: 16, fontWeight: 600,
          color: '#1A1A2E', margin: '14px 0 0', lineHeight: '150%',
          whiteSpace: 'pre-line',
        }}>
          {'연결이 잠시 끊겼어요.\n다시 연결 중이에요.'}
        </p>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      width="36" height="36" viewBox="0 0 36 36" fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="18" cy="18" r="15" stroke="#E0E8FF" strokeWidth="4" />
      <path
        d="M18 3 A15 15 0 0 1 33 18"
        stroke="#286EF0" strokeWidth="4" strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

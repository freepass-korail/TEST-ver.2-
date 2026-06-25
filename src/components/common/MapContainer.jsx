// src/components/common/MapContainer.jsx
import React, { useEffect } from 'react';
import useFlowStore from '../../store/useFlowStore';
import { colors } from '../../styles/theme';

function MapContainer() {
  const setMapInstance = useFlowStore((state) => state.setMapInstance);

  useEffect(() => {
    const mockMapInstance = {
      panTo: (coords) =>
        console.log(`[지도 이동] 위도: ${coords.lat}, 경도: ${coords.lng}로 이동`),
      setZoom: (level) => console.log(`[지도 줌] 레벨 ${level}로 변경`),
    };

    setMapInstance(mockMapInstance);
  }, [setMapInstance]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: colors.mapPlaceholder,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.primary,
        fontWeight: 600,
        fontSize: '16px',
      }}
    >
      🗺️ 지도 영역
    </div>
  );
}

export default MapContainer;

// src/components/S5_Navigaition.jsx
import React from 'react';
import useFlowStore from '../store/useFlowStore';

function S5_Navigation (){
    const { setStep, mapInstance } = useFlowStore();

    const handleSimulateMovement = () => {
        //🗺️ 실시간 이동 느낌을 내기 위해 버튼을 누르면 지도의 다른 좌표로 이동해보는 가상 테스트
        if (mapInstance) {
            console.log("-> 사용자가 움직임에 따라 전역 지도를 동적으로 제어합니다.");
            mapInstance.panTo({ lat: 37.1285, lng: 128.2055 });
        }  
    };

    return (
        <div style={{ }}>
         <h2>S5_실시간 길찾기 중</h2>
         <p>5번 홈으로 이동하세요.</p>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px'}}>
            <button onClick={handleSimulateMovement} style={{ padding: '10px', background: '#6C757d', color: 'white', border: 'none', borderRadius: '4px' }}>
                🔄 가상 위치 이동 시뮬레이션 (콘솔 확인)
            </button>
            <button onClick={() => setStep('S6')} style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                도착 완료
            </button>
         </div>
        </div>
    );
}

export default S5_Navigation;
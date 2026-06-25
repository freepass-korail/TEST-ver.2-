// src/components/S5_1_Arrived.jsx
import React from 'react';
import useFlowStore from '../store/useFlowStore';

function S5_1_Arrived(){
    const setStep = useFlowStore((state) => state.setStep);

    return(
        <div style={{ padding: '20px', background: 'white', margin: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h2>S5_1_도착 완료 안내 화면</h2>
            <p>목적지(열차 승차 위치)에 무사히 도착했습니다. 즐거운 여정 되세요!</p>
            <button onClick={() => setStep('S1')} style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                처음으로 돌아가기
            </button>
        </div>
    );
}

export default S5_1_Arrived;

import React, { useEffect, useRef, useState } from 'react';
import useFlowStore from '../../store/useFlowStore';
import {
  fetchGuideRoutePoints,
  fetchGuideSimulate,
  fetchGuideWalk,
  openGuideWalkStream,
} from '../../api/tickets';
import { playBase64Audio } from '../../utils/audio';

function logAudio(label, audioBase64) {
  const len = audioBase64?.length ?? 0;
  console.log(`[DEV ${label}] audioBase64 length:`, len);
  if (len > 0) playBase64Audio(audioBase64);
}

function GuideDevPanel() {
  if (!import.meta.env.DEV) return null;

  return <GuideDevPanelInner />;
}

function GuideDevPanelInner() {
  const { ticketInfo, fromNode: storeFromNode } = useFlowStore();
  const [userId, setUserId] = useState(
    () => String(ticketInfo?.userId || 2),
  );
  const [fromNode, setFromNode] = useState(() => storeFromNode || 'n01');
  const [jitterM, setJitterM] = useState('1');
  const [busy, setBusy] = useState(null);
  const [log, setLog] = useState('');
  const [simSteps, setSimSteps] = useState(10);
  const [simHeading, setSimHeading] = useState(0);
  const [lastStepSeq, setLastStepSeq] = useState(-1);
  const [streaming, setStreaming] = useState(false);
  const esRef = useRef(null);

  useEffect(() => {
    return () => {
      esRef.current?.close();
      esRef.current = null;
    };
  }, []);

  const append = (line) => {
    setLog((prev) => `${line}\n${prev}`.slice(0, 4000));
  };

  const uid = Number(userId);
  const startNode = fromNode.trim() || undefined;
  const jitter = Number(jitterM) || 0;

  const run = async (label, fn) => {
    if (!uid || uid <= 0) {
      append('userId 필요');
      return;
    }
    setBusy(label);
    try {
      await fn();
    } catch (err) {
      console.error(`[DEV ${label}]`, err);
      append(`${label} 실패: ${err.message ?? err}`);
    } finally {
      setBusy(null);
    }
  };

  const handleWalk = () =>
    run('Walk', async () => {
      const res = await fetchGuideWalk(uid, { fromNode: startNode, jitterM: jitter });
      const summary = res.steps.map((s) => ({
        seq: s.seq,
        nodeId: s.nodeId,
        name: s.name,
        screenText: s.guide?.screenText,
        audioLen: s.guide?.audioBase64?.length ?? 0,
        remainingAlongRouteM: s.remainingAlongRouteM,
      }));
      console.log('[DEV Walk]', {
        originNode: res.originNode,
        destinationNode: res.destinationNode,
        routeLengthM: res.routeLengthM,
        stepCount: res.steps.length,
        steps: summary,
      });
      append(
        `Walk OK · ${res.steps.length} steps · ${res.originNode}→${res.destinationNode}`,
      );
      const withAudio = res.steps.find((s) => s.guide?.audioBase64);
      if (withAudio) logAudio('Walk', withAudio.guide.audioBase64);
    });

  const handleStreamStart = () => {
    if (!uid || uid <= 0) {
      append('userId 필요');
      return;
    }
    esRef.current?.close();
    setStreaming(true);
    append('Stream 연결…');
    esRef.current = openGuideWalkStream(uid, {
      fromNode: startNode,
      intervalMs: 2000,
      jitterM: jitter,
      onStep: (step) => {
        const audioLen = step.guide?.audioBase64?.length ?? 0;
        console.log('[DEV Stream step]', {
          seq: step.seq,
          nodeId: step.nodeId,
          screenText: step.guide?.screenText,
          audioLen,
          remainingAlongRouteM: step.remainingAlongRouteM,
        });
        append(
          `step #${step.seq} ${step.nodeId} · audio ${audioLen} · rem ${step.remainingAlongRouteM?.toFixed?.(1) ?? step.remainingAlongRouteM}m`,
        );
        if (step.guide?.audioBase64) logAudio('Stream', step.guide.audioBase64);
      },
      onDone: (data) => {
        console.log('[DEV Stream done]', data);
        append(`Stream done: ${data}`);
        setStreaming(false);
        esRef.current = null;
      },
      onInfo: (data) => {
        console.log('[DEV Stream info]', data);
        append(`Stream info: ${data}`);
        setStreaming(false);
        esRef.current = null;
      },
      onError: (err) => {
        console.error('[DEV Stream error]', err);
        append('Stream error (연결 확인)');
        setStreaming(false);
      },
    });
  };

  const handleStreamStop = () => {
    esRef.current?.close();
    esRef.current = null;
    setStreaming(false);
    append('Stream 중지');
  };

  const handleSimulate = () =>
    run('Simulate', async () => {
      const res = await fetchGuideSimulate(uid, {
        fromNode: startNode,
        steps: simSteps,
        heading: simHeading,
        stepLength: 0.7,
        lastStepSeq,
      });
      const audioLen = res.currentStep?.audioBase64?.length ?? 0;
      console.log('[DEV Simulate]', {
        stepChanged: res.stepChanged,
        currentStepSeq: res.currentStepSeq,
        nearestNodeId: res.nearestNodeId,
        remainingAlongRouteM: res.remainingAlongRouteM,
        arrived: res.arrived,
        screenText: res.currentStep?.screenText,
        audioLen,
      });
      append(
        `Sim · seq ${res.currentStepSeq} · changed=${res.stepChanged} · rem ${res.remainingAlongRouteM?.toFixed?.(1)}m · audio ${audioLen}`,
      );
      setLastStepSeq(res.currentStepSeq);
      if (res.stepChanged && res.currentStep?.audioBase64) {
        logAudio('Simulate', res.currentStep.audioBase64);
      }
    });

  const handleRoutePoints = () =>
    run('RoutePts', async () => {
      const res = await fetchGuideRoutePoints(uid, { fromNode: startNode });
      console.log('[DEV RoutePoints]', {
        originNode: res.originNode,
        destinationNode: res.destinationNode,
        count: res.points.length,
        points: res.points,
      });
      append(
        `RoutePts · ${res.points.length} · ${res.originNode}→${res.destinationNode}`,
      );
    });

  const btnStyle = {
    flex: '1 1 auto',
    minWidth: 64,
    padding: '6px 8px',
    fontSize: 11,
    fontWeight: 600,
    border: '1px solid #334155',
    borderRadius: 6,
    background: '#1e293b',
    color: '#e2e8f0',
    cursor: 'pointer',
  };
  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box',
    padding: '4px 6px',
    fontSize: 11,
    border: '1px solid #475569',
    borderRadius: 4,
    background: '#0f172a',
    color: '#f1f5f9',
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 56,
        right: 8,
        width: 220,
        zIndex: 50,
        background: '#0f172acc',
        border: '1px solid #334155',
        borderRadius: 10,
        padding: 10,
        color: '#e2e8f0',
        fontFamily: 'ui-monospace, Consolas, monospace',
        fontSize: 11,
        backdropFilter: 'blur(6px)',
        boxShadow: '0 8px 24px #00000066',
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#38bdf8' }}>
        DEV Guide API
      </div>

      <label style={{ display: 'block', marginBottom: 4 }}>
        userId
        <input
          style={inputStyle}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
      </label>
      <label style={{ display: 'block', marginBottom: 4 }}>
        fromNode
        <input
          style={inputStyle}
          value={fromNode}
          onChange={(e) => setFromNode(e.target.value)}
        />
      </label>
      <label style={{ display: 'block', marginBottom: 8 }}>
        jitterM
        <input
          style={inputStyle}
          value={jitterM}
          onChange={(e) => setJitterM(e.target.value)}
        />
      </label>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 6 }}>
        <button
          type="button"
          style={btnStyle}
          disabled={!!busy || streaming}
          onClick={handleWalk}
        >
          {busy === 'Walk' ? '…' : 'Walk'}
        </button>
        {!streaming ? (
          <button type="button" style={btnStyle} disabled={!!busy} onClick={handleStreamStart}>
            Stream
          </button>
        ) : (
          <button
            type="button"
            style={{ ...btnStyle, background: '#7f1d1d', borderColor: '#991b1b' }}
            onClick={handleStreamStop}
          >
            Stop
          </button>
        )}
        <button
          type="button"
          style={btnStyle}
          disabled={!!busy || streaming}
          onClick={handleRoutePoints}
        >
          {busy === 'RoutePts' ? '…' : 'Pts'}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          marginBottom: 6,
        }}
      >
        <label>
          steps
          <input
            style={inputStyle}
            type="number"
            value={simSteps}
            onChange={(e) => setSimSteps(Number(e.target.value) || 0)}
          />
        </label>
        <label>
          heading
          <input
            style={inputStyle}
            type="number"
            value={simHeading}
            onChange={(e) => setSimHeading(Number(e.target.value) || 0)}
          />
        </label>
      </div>
      <div style={{ marginBottom: 6, opacity: 0.7 }}>lastStepSeq: {lastStepSeq}</div>
      <button
        type="button"
        style={{ ...btnStyle, width: '100%', marginBottom: 8 }}
        disabled={!!busy || streaming}
        onClick={handleSimulate}
      >
        {busy === 'Simulate' ? '…' : 'Simulate'}
      </button>

      <pre
        style={{
          margin: 0,
          maxHeight: 120,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          background: '#020617',
          borderRadius: 6,
          padding: 6,
          color: '#94a3b8',
          fontSize: 10,
          lineHeight: 1.35,
        }}
      >
        {log || '결과 로그'}
      </pre>
    </div>
  );
}

export default GuideDevPanel;

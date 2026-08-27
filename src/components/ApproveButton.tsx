'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface ApproveButtonProps {
  label?: string;
  doneLabel?: string;
  onApprove?: () => void;
  dimDurationMs?: number;
}

export default function ApproveButton({
  label = 'Approve',
  doneLabel = 'Done',
  onApprove,
  dimDurationMs = 1800,
}: ApproveButtonProps) {
  const [state, setState] = useState<'idle' | 'approving' | 'done'>('idle');
  const [dim, setDim] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const handleClick = useCallback(() => {
    if (state !== 'idle') return;
    setState('approving');
    setDim(true);
    onApprove?.();

    timers.current.push(setTimeout(() => setState('done'), 280));
    timers.current.push(setTimeout(() => setDim(false), dimDurationMs));
  }, [state, onApprove, dimDurationMs]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === 'done'}
        className={`approve-btn approve-btn--${state}`}
      >
        {state === 'done' ? (
          <span className="approve-check">✓ {doneLabel}</span>
        ) : (
          label
        )}
      </button>

      <div className={`page-dim ${dim ? 'page-dim--on' : ''}`} aria-hidden="true" />

      <style jsx>{`
        .approve-btn {
          position: relative;
          z-index: 30;
          padding: 0.85rem 1.75rem;
          border-radius: 8px;
          border: 1px solid rgba(232, 180, 90, 0.35);
          background: rgba(20, 18, 14, 0.9);
          color: #f0e6d2;
          font-size: 0.95rem;
          cursor: pointer;
          transition: box-shadow 0.4s ease, transform 0.2s ease;
          animation: pulseGlow 3.2s ease-in-out infinite;
        }
        .approve-btn:hover {
          transform: translateY(-1px);
        }
        .approve-btn--approving {
          animation: none;
          box-shadow: 0 0 0 6px rgba(232, 180, 90, 0.22),
            0 0 32px rgba(232, 180, 90, 0.55);
        }
        .approve-btn--done {
          border-color: rgba(150, 200, 160, 0.4);
          cursor: default;
          animation: none;
          box-shadow: none;
        }
        .approve-check {
          display: inline-flex;
          gap: 0.4em;
        }

        @keyframes pulseGlow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(232, 180, 90, 0),
              0 0 12px rgba(232, 180, 90, 0.18);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(232, 180, 90, 0.12),
              0 0 22px rgba(232, 180, 90, 0.4);
          }
        }

        .page-dim {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0);
          pointer-events: none;
          z-index: 20;
          transition: background 0.5s ease;
        }
        .page-dim--on {
          background: rgba(0, 0, 0, 0.55);
        }

        @media (prefers-reduced-motion: reduce) {
          .approve-btn {
            animation: none;
          }
          .approve-btn--approving {
            box-shadow: none;
          }
        }
      `}</style>
    </>
  );
}

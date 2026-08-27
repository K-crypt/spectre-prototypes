'use client';

import { useEffect, useState } from 'react';

const FOG_COLOR = '210, 205, 195';

export default function HeroIntro({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const played = sessionStorage.getItem('spectre-hero-intro-played');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (played || reduceMotion) {
      setRevealed(true);
      setInstant(true);
      return;
    }

    sessionStorage.setItem('spectre-hero-intro-played', '1');
    const timer = setTimeout(() => setRevealed(true), 80);

    const skipNow = () => {
      setInstant(true);
      setRevealed(true);
      clearTimeout(timer);
    };

    window.addEventListener('scroll', skipNow, { once: true, passive: true });
    window.addEventListener('keydown', skipNow, { once: true });
    window.addEventListener('pointerdown', skipNow, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', skipNow);
      window.removeEventListener('keydown', skipNow);
      window.removeEventListener('pointerdown', skipNow);
    };
  }, []);

  return (
    <div className="hero-intro-wrap">
      {children}

      <div
        className={[
          'hero-veil',
          revealed ? 'hero-veil--gone' : '',
          instant ? 'hero-veil--instant' : '',
        ].join(' ')}
        aria-hidden="true"
      />

      <div className="hero-fog" aria-hidden="true">
        <span className="fog-layer fog-layer--1" />
        <span className="fog-layer fog-layer--2" />
        <span className="fog-layer fog-layer--3" />
      </div>

      <style jsx>{`
        .hero-intro-wrap {
          position: relative;
          overflow: hidden;
        }

        .hero-veil {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: 1;
          transition: opacity 1.6s ease-out;
          pointer-events: none;
          z-index: 20;
        }
        .hero-veil--gone {
          opacity: 0;
        }
        .hero-veil--instant {
          transition: none;
        }

        .hero-fog {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 48%;
          overflow: hidden;
          pointer-events: none;
          z-index: 10;
          mix-blend-mode: screen;
          opacity: 0.92;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 24%, #000 58%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 24%, #000 58%);
        }

        .fog-layer {
          position: absolute;
          bottom: -14%;
          width: 145%;
          height: 112%;
          background: radial-gradient(
            ellipse at center,
            rgba(${FOG_COLOR}, 0.34) 0%,
            rgba(${FOG_COLOR}, 0.16) 42%,
            rgba(${FOG_COLOR}, 0) 72%
          );
          filter: blur(24px);
          will-change: transform;
        }

        .fog-layer--1 {
          left: -36%;
          animation: driftA 28s ease-in-out infinite;
        }
        .fog-layer--2 {
          left: -6%;
          bottom: -2%;
          opacity: 0.66;
          animation: driftB 41s ease-in-out infinite;
        }
        .fog-layer--3 {
          left: -46%;
          bottom: -8%;
          opacity: 0.48;
          animation: driftA 57s ease-in-out infinite reverse;
        }

        @keyframes driftA {
          0% { transform: translate3d(-2%, 0, 0) scale(1); }
          50% { transform: translate3d(10%, -3%, 0) scale(1.05); }
          100% { transform: translate3d(-2%, 0, 0) scale(1); }
        }
        @keyframes driftB {
          0% { transform: translate3d(5%, 1%, 0) scale(1.02); }
          50% { transform: translate3d(-9%, -2%, 0) scale(1.07); }
          100% { transform: translate3d(5%, 1%, 0) scale(1.02); }
        }

        @media (prefers-reduced-motion: reduce) {
          .fog-layer {
            animation: none !important;
          }
          .hero-veil {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}

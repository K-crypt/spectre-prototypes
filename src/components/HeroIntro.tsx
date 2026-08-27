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
          height: 38%;
          overflow: hidden;
          pointer-events: none;
          z-index: 10;
          mix-blend-mode: screen;
        }

        .fog-layer {
          position: absolute;
          bottom: -10%;
          width: 160%;
          height: 100%;
          background: radial-gradient(
            ellipse at center,
            rgba(${FOG_COLOR}, 0.16) 0%,
            rgba(${FOG_COLOR}, 0.06) 45%,
            rgba(${FOG_COLOR}, 0) 70%
          );
          filter: blur(18px);
        }

        .fog-layer--1 {
          left: -30%;
          animation: driftA 46s ease-in-out infinite;
        }
        .fog-layer--2 {
          left: -10%;
          bottom: 2%;
          opacity: 0.7;
          animation: driftB 63s ease-in-out infinite;
        }
        .fog-layer--3 {
          left: -50%;
          bottom: -4%;
          opacity: 0.5;
          animation: driftA 80s ease-in-out infinite reverse;
        }

        @keyframes driftA {
          0% { transform: translateX(0); }
          50% { transform: translateX(4%); }
          100% { transform: translateX(0); }
        }
        @keyframes driftB {
          0% { transform: translateX(0); }
          50% { transform: translateX(-3%); }
          100% { transform: translateX(0); }
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

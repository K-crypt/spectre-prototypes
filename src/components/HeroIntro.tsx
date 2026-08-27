'use client';

import { useEffect, useState } from 'react';

const FOG_COLOR = '210, 205, 195';

export default function HeroIntro({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const previousScrollRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';

    const returnToHero = () => {
      history.replaceState(history.state, '', `${location.pathname}${location.search}`);
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    };

    returnToHero();
    const frame = requestAnimationFrame(returnToHero);

    return () => {
      cancelAnimationFrame(frame);
      history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

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

      <div className="hero-lightning" aria-hidden="true">
        <span className="cloud-flash cloud-flash--left" />
        <span className="cloud-flash cloud-flash--right" />
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
          height: 39%;
          overflow: hidden;
          pointer-events: none;
          z-index: 10;
          mix-blend-mode: screen;
          opacity: 0.82;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.18) 19%, rgba(0,0,0,.78) 51%, #000 76%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.18) 19%, rgba(0,0,0,.78) 51%, #000 76%);
        }

        .fog-layer {
          position: absolute;
          left: -100%;
          bottom: var(--fog-bottom);
          width: 200%;
          height: var(--fog-height);
          background:
            radial-gradient(
              ellipse 32% 23% at 4% 76%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 46%,
              rgba(${FOG_COLOR}, 0) 76%
            ),
            radial-gradient(
              ellipse 45% 31% at 28% 67%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 43%,
              rgba(${FOG_COLOR}, 0) 78%
            ),
            radial-gradient(
              ellipse 28% 20% at 50% 82%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 50%,
              rgba(${FOG_COLOR}, 0) 77%
            ),
            radial-gradient(
              ellipse 51% 27% at 76% 73%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 42%,
              rgba(${FOG_COLOR}, 0) 80%
            ),
            radial-gradient(
              ellipse 35% 29% at 97% 66%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 45%,
              rgba(${FOG_COLOR}, 0) 79%
            );
          background-size: 50% 100%;
          background-repeat: repeat-x;
          filter: blur(var(--fog-blur));
          will-change: transform;
          animation: fogFlow var(--fog-speed) linear infinite;
        }

        .fog-layer--1 {
          --fog-bottom: -29%;
          --fog-height: 116%;
          --fog-core: 0.28;
          --fog-edge: 0.12;
          --fog-blur: 24px;
          --fog-speed: 34s;
        }
        .fog-layer--2 {
          --fog-bottom: -16%;
          --fog-height: 94%;
          --fog-core: 0.22;
          --fog-edge: 0.09;
          --fog-blur: 28px;
          --fog-speed: 47s;
          opacity: 0.7;
          animation-delay: -17s;
        }
        .fog-layer--3 {
          --fog-bottom: -37%;
          --fog-height: 128%;
          --fog-core: 0.19;
          --fog-edge: 0.07;
          --fog-blur: 34px;
          --fog-speed: 63s;
          opacity: 0.55;
          animation-delay: -38s;
        }

        @keyframes fogFlow {
          from { transform: translate3d(0, 0, 0); }
          22% { transform: translate3d(11%, -1.1%, 0); }
          48% { transform: translate3d(24%, .35%, 0); }
          73% { transform: translate3d(36.5%, -.7%, 0); }
          to { transform: translate3d(50%, 0, 0); }
        }

        .hero-lightning {
          position: absolute;
          inset: 0;
          z-index: 9;
          overflow: hidden;
          pointer-events: none;
          mix-blend-mode: screen;
          -webkit-mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,.9) 48%, transparent 76%);
          mask-image: linear-gradient(to bottom, #000 0%, rgba(0,0,0,.9) 48%, transparent 76%);
        }
        .cloud-flash {
          position: absolute;
          inset: -8%;
          opacity: 0;
          will-change: opacity, transform;
          filter: blur(10px);
        }
        .cloud-flash--left {
          background:
            radial-gradient(ellipse 27% 18% at 23% 29%, rgba(218,225,234,.46), transparent 72%),
            radial-gradient(ellipse 39% 22% at 35% 36%, rgba(187,198,214,.2), transparent 76%);
          animation: cloudLightningLeft 7.2s linear .8s infinite;
        }
        .cloud-flash--right {
          background:
            radial-gradient(ellipse 22% 16% at 72% 25%, rgba(215,221,231,.34), transparent 70%),
            radial-gradient(ellipse 34% 21% at 64% 35%, rgba(181,193,210,.16), transparent 78%);
          animation: cloudLightningRight 10.6s linear 2.7s infinite;
        }
        @keyframes cloudLightningLeft {
          0%, 18%, 22.8%, 100% { opacity: 0; transform: translate3d(0,0,0); }
          18.6% { opacity: .16; }
          19.2% { opacity: .02; }
          19.85% { opacity: .34; transform: translate3d(.3%,-.15%,0); }
          20.55% { opacity: .05; }
          21.5% { opacity: .19; }
        }
        @keyframes cloudLightningRight {
          0%, 57%, 61.2%, 100% { opacity: 0; }
          57.45% { opacity: .12; }
          58.05% { opacity: .03; }
          58.7% { opacity: .27; }
          59.35% { opacity: .04; }
          60.25% { opacity: .13; }
        }

        @media (prefers-reduced-motion: reduce) {
          .fog-layer,
          .cloud-flash {
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

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
          height: 48%;
          overflow: hidden;
          pointer-events: none;
          z-index: 10;
          mix-blend-mode: screen;
          opacity: 0.9;
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 24%, #000 58%);
          mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.35) 24%, #000 58%);
        }

        .fog-layer {
          position: absolute;
          left: -100%;
          bottom: var(--fog-bottom);
          width: 200%;
          height: var(--fog-height);
          background:
            radial-gradient(
              ellipse 21% 34% at 5% 67%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 46%,
              rgba(${FOG_COLOR}, 0) 76%
            ),
            radial-gradient(
              ellipse 32% 48% at 27% 56%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 43%,
              rgba(${FOG_COLOR}, 0) 78%
            ),
            radial-gradient(
              ellipse 18% 29% at 49% 74%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 50%,
              rgba(${FOG_COLOR}, 0) 77%
            ),
            radial-gradient(
              ellipse 38% 38% at 77% 64%,
              rgba(${FOG_COLOR}, var(--fog-core)) 0%,
              rgba(${FOG_COLOR}, var(--fog-edge)) 42%,
              rgba(${FOG_COLOR}, 0) 80%
            ),
            radial-gradient(
              ellipse 23% 44% at 96% 51%,
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
          --fog-bottom: -15%;
          --fog-height: 116%;
          --fog-core: 0.31;
          --fog-edge: 0.14;
          --fog-blur: 20px;
          --fog-speed: 30s;
        }
        .fog-layer--2 {
          --fog-bottom: -2%;
          --fog-height: 94%;
          --fog-core: 0.22;
          --fog-edge: 0.09;
          --fog-blur: 28px;
          --fog-speed: 43s;
          opacity: 0.76;
          animation-delay: -17s;
        }
        .fog-layer--3 {
          --fog-bottom: -23%;
          --fog-height: 128%;
          --fog-core: 0.19;
          --fog-edge: 0.07;
          --fog-blur: 34px;
          --fog-speed: 59s;
          opacity: 0.62;
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
          animation: cloudLightningLeft 13.7s linear 2.2s infinite;
        }
        .cloud-flash--right {
          background:
            radial-gradient(ellipse 22% 16% at 72% 25%, rgba(215,221,231,.34), transparent 70%),
            radial-gradient(ellipse 34% 21% at 64% 35%, rgba(181,193,210,.16), transparent 78%);
          animation: cloudLightningRight 19.3s linear 7.6s infinite;
        }
        @keyframes cloudLightningLeft {
          0%, 68%, 70.2%, 72%, 100% { opacity: 0; transform: translate3d(0,0,0); }
          68.5% { opacity: .16; }
          69% { opacity: .02; }
          69.45% { opacity: .34; transform: translate3d(.3%,-.15%,0); }
          70% { opacity: .05; }
          70.7% { opacity: .19; }
        }
        @keyframes cloudLightningRight {
          0%, 76%, 77.6%, 79%, 100% { opacity: 0; }
          76.35% { opacity: .12; }
          76.8% { opacity: .03; }
          77.12% { opacity: .27; }
          77.5% { opacity: .04; }
          78% { opacity: .13; }
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

export default function HeartbeatLoader({ label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24">
      {/* Glass card */}
      <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl border border-white/50 bg-white/20 shadow-lift backdrop-blur-xl hb-card">
        {/* Soft inner glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-400/20 via-transparent to-accent-400/20 pointer-events-none" />

        {/* Heart SVG */}
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative w-11 h-11 hb-heart">
          <defs>
            <linearGradient id="hbGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6b6dfb" />
              <stop offset="100%" stopColor="#f6467a" />
            </linearGradient>
          </defs>
          <path
            d="M12 21C12 21 3 14.5 3 8.5C3 5.42 5.42 3 8.5 3C10.24 3 11.91 3.81 13 5.08C14.09 3.81 15.76 3 17.5 3C20.58 3 23 5.42 23 8.5C23 14.5 12 21 12 21Z"
            fill="url(#hbGrad)"
          />
          {/* Shine highlight */}
          <ellipse cx="9" cy="8" rx="2.5" ry="1.5" fill="white" fillOpacity="0.3" transform="rotate(-30 9 8)" />
        </svg>

        {/* Pulse ring 1 */}
        <span className="absolute inset-0 rounded-3xl hb-ring hb-ring-1" />
        {/* Pulse ring 2 */}
        <span className="absolute inset-0 rounded-3xl hb-ring hb-ring-2" />
      </div>

      {/* EKG line */}
      <svg viewBox="0 0 120 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-7 hb-ekg" aria-hidden="true">
        <defs>
          <linearGradient id="ekgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b6dfb" stopOpacity="0" />
            <stop offset="30%" stopColor="#6b6dfb" />
            <stop offset="70%" stopColor="#f6467a" />
            <stop offset="100%" stopColor="#f6467a" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          points="0,14 18,14 24,14 30,2 36,26 40,8 44,14 60,14 66,14 72,2 78,26 82,8 86,14 102,14 120,14"
          stroke="url(#ekgGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>

      {label && <p className="text-sm font-semibold text-ink-500 tracking-wide">{label}</p>}

      <style>{`
        .hb-card {
          animation: hbCardPulse 1.2s ease-in-out infinite;
        }
        @keyframes hbCardPulse {
          0%, 100% { box-shadow: 0 18px 55px rgba(17,24,39,0.14), 0 0 0 0 rgba(107,109,251,0); }
          50%       { box-shadow: 0 18px 55px rgba(17,24,39,0.14), 0 0 0 10px rgba(107,109,251,0); }
        }

        .hb-heart {
          animation: hbBeat 1.2s ease-in-out infinite;
          transform-origin: center;
        }
        @keyframes hbBeat {
          0%, 100% { transform: scale(1);    }
          14%       { transform: scale(1.22); }
          28%       { transform: scale(1);    }
          42%       { transform: scale(1.14); }
          56%       { transform: scale(1);    }
        }

        .hb-ring {
          border: 1.5px solid rgba(107,109,251,0.35);
          animation: hbRingPulse 1.2s ease-out infinite;
          pointer-events: none;
        }
        .hb-ring-2 { animation-delay: 0.4s; border-color: rgba(246,70,122,0.28); }
        @keyframes hbRingPulse {
          0%   { transform: scale(1);   opacity: 1; }
          100% { transform: scale(1.7); opacity: 0; }
        }

        .hb-ekg {
          animation: hbEkgSlide 1.2s linear infinite;
        }
        @keyframes hbEkgSlide {
          0%   { clip-path: inset(0 100% 0 0); }
          60%  { clip-path: inset(0 0% 0 0);   }
          100% { clip-path: inset(0 0% 0 0);   }
        }
      `}</style>
    </div>
  )
}

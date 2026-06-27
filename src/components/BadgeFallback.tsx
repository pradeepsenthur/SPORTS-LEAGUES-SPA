import { memo } from "react";

interface BadgeFallbackProps {
  sportName?: string | null;
}

function BadgeFallback({ sportName }: BadgeFallbackProps) {
  return (
    <svg
      viewBox="0 0 300 180"
      xmlns="http://www.w3.org/2000/svg"
      className="badge-fallback"
      role="img"
      aria-label={`Badge placeholder for ${sportName || "league"}`}
    >
      {/* Background gradient */}
      <defs>
        <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#e2e8f0", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#cbd5e1", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* Main badge background */}
      <rect width="300" height="180" rx="12" fill="url(#badgeGradient)" />

      {/* Trophy icon - centered */}
      <g transform="translate(150, 90)">
        {/* Trophy cup */}
        <path
          d="M -30 -15 L -28 -30 L 28 -30 L 30 -15 Q 30 -5 20 5 L -20 5 Q -30 -5 -30 -15 Z"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* Trophy handles */}
        <circle
          cx="-38"
          cy="-10"
          r="6"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        <circle
          cx="38"
          cy="-10"
          r="6"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Trophy stem */}
        <rect
          x="-5"
          y="5"
          width="10"
          height="18"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        {/* Trophy base */}
        <ellipse
          cx="0"
          cy="25"
          rx="26"
          ry="8"
          fill="#94a3b8"
          stroke="#64748b"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export default memo(BadgeFallback);

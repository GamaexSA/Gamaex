import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0F1419",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          width="150"
          height="150"
        >
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8C76E" />
              <stop offset="50%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#9C7E2E" />
            </linearGradient>
          </defs>
          <g transform="translate(50,50)">
            <circle cx="0" cy="0" r="34" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
            <path
              d="M -16 -18 A 22 22 0 1 0 16 18 L 16 0 L 0 0"
              fill="none"
              stroke="url(#goldGrad)"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </div>
    ),
    { ...size },
  );
}

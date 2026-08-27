interface PhoenixIconProps {
  size?: number;
  className?: string;
}

export default function PhoenixIcon({ size = 24, className = '' }: PhoenixIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] ${className}`}
    >
      <defs>
        <linearGradient id="phoenixWhiteGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f0f0f0" />
          <stop offset="50%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <radialGradient id="phoenixWhiteGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {/* Fiery White Wings */}
      <path
        d="M12 4C10 7 6 7 2 5C4 9 7 11 10 12C6 13 3 16 1 20C5 18 9 16 12 15C15 16 19 18 23 20C21 16 18 13 14 12C17 11 20 9 22 5C18 7 14 7 12 4Z"
        fill="url(#phoenixWhiteGrad)"
      />

      {/* Head, Beak & Flame Crest */}
      <path
        d="M12 2C12.5 3 13 3.5 13.5 3.5C14.5 3.5 15 2.5 15 2C14.5 4 13.5 4.5 13 5C13.8 5.2 14.5 4.8 15 4.2C14.5 5.8 13 6.5 12 6.5C11 6.5 9.5 5.8 9 4.2C9.5 4.8 10.2 5.2 11 5C10.5 4.5 9.5 4 9 2C9 2.5 9.5 3.5 10.5 3.5C11 3.5 11.5 3 12 2Z"
        fill="url(#phoenixWhiteGrad)"
      />
      <circle cx="12" cy="7" r="1.5" fill="url(#phoenixWhiteGlow)" />

      {/* Tail Flames */}
      <path
        d="M12 15C11 17 9.5 19 8 22C11 20 11.5 18 12 17C12.5 18 13 20 16 22C14.5 19 13 17 12 15Z"
        fill="url(#phoenixWhiteGrad)"
      />
    </svg>
  );
}

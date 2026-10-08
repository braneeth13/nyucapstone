/** Decorative Portuguese tile band. */
export default function Azulejo({ className = '' }: { className?: string }) {
  return (
    <svg className={`azulejo ${className}`} aria-hidden="true" width="100%" height="28">
      <defs>
        <pattern id="tile" width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill="var(--tile-bg)" />
          <path d="M14 2 26 14 14 26 2 14Z" fill="none" stroke="var(--azul)" strokeWidth="1.6" />
          <circle cx="14" cy="14" r="3.2" fill="var(--azul)" />
          <circle cx="0" cy="0" r="4" fill="var(--azul)" />
          <circle cx="28" cy="0" r="4" fill="var(--azul)" />
          <circle cx="0" cy="28" r="4" fill="var(--azul)" />
          <circle cx="28" cy="28" r="4" fill="var(--azul)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#tile)" />
    </svg>
  );
}

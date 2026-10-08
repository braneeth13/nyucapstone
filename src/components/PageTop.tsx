import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

/** Minimal top bar: optional back chevron, centered title, optional right slot. */
export default function PageTop({ title, back, right }: { title?: string; back?: boolean; right?: ReactNode }) {
  const navigate = useNavigate();
  return (
    <header className="pagetop">
      <div className="pagetop-side">
        {back && (
          <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Back">
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
              <path d="m15 5-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {title && <h1 className="pagetop-title">{title}</h1>}
      <div className="pagetop-side right">{right}</div>
    </header>
  );
}

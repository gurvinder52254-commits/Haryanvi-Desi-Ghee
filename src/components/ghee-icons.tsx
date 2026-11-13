// Line icons for the product filter. They use currentColor, so the parent's
// text colour decides how they look (normal vs selected).

export function CowIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {/* small horns */}
      <path d="M24 20c-3-3-3-8 1-11" />
      <path d="M40 20c3-3 3-8-1-11" />
      {/* ears */}
      <path d="M22 25c-6-3-12-2-15 2 4 4 10 5 15 3" />
      <path d="M42 25c6-3 12-2 15 2-4 4-10 5-15 3" />
      {/* long face */}
      <path d="M22 22c-2 8-1 16 2 21M42 22c2 8 1 16-2 21M22 22c6-4 14-4 20 0" />
      {/* muzzle */}
      <path d="M23 43c0-3 4-5 9-5s9 2 9 5-4 9-9 9-9-6-9-9Z" />
      <circle cx="28.5" cy="45" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="35.5" cy="45" r="1.2" fill="currentColor" stroke="none" />
      {/* eyes */}
      <circle cx="26.5" cy="30" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="37.5" cy="30" r="1.8" fill="currentColor" stroke="none" />
      {/* forehead spot */}
      <path d="M30 24c1 2 3 2 4 0" />
    </svg>
  );
}

export function BuffaloIcon({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {/* big horns curving out and back */}
      <path d="M21 22C14 23 7 20 5 13c5 3 10 3 14 1" />
      <path d="M43 22c7 1 14-2 16-9-5 3-10 3-14 1" />
      {/* ears sticking out sideways */}
      <path d="M20 28c-4 0-8 1-10 4 3 2 7 2 10 0" />
      <path d="M44 28c4 0 8 1 10 4-3 2-7 2-10 0" />
      {/* broad face */}
      <path d="M20 22c-1 8 0 15 3 21M44 22c1 8 0 15-3 21M20 22c7-5 17-5 24 0" />
      {/* wide muzzle */}
      <path d="M21 44c0-3 5-5 11-5s11 2 11 5-5 8-11 8-11-5-11-8Z" />
      <circle cx="27.5" cy="45.5" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="36.5" cy="45.5" r="1.3" fill="currentColor" stroke="none" />
      {/* eyes */}
      <circle cx="26" cy="31" r="1.8" fill="currentColor" stroke="none" />
      <circle cx="38" cy="31" r="1.8" fill="currentColor" stroke="none" />
      {/* forehead tuft */}
      <path d="M28 22c1 2 2 3 4 3s3-1 4-3" />
    </svg>
  );
}

export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="45"
        height="45"
        rx="12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M22 14h-7a5 5 0 0 0 0 10h2a5 5 0 0 1 0 10h-7M26 34l7-20 7 20M29 27h8"
        stroke="currentColor"
        strokeWidth="2.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export function Spark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="26"
      viewBox="0 0 24 28"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="m12 0 3 10 9 4-9 3-3 11-3-11-9-3 9-4z" />
    </svg>
  )
}
export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 19 19 5M5 5h14v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
export function WorkIcon({ kind = 'code' }: { kind?: string }) {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      {kind === 'data' ? (
        <>
          <ellipse cx="20" cy="10" rx="13" ry="5" />
          <path d="M7 10v20c0 7 26 7 26 0V10M7 20c0 7 26 7 26 0" />
        </>
      ) : kind === 'design' ? (
        <>
          <rect x="7" y="7" width="26" height="26" rx="4" />
          <path d="m12 28 4-10 10-7 3 3-7 10-10 4Zm4-10 6 6" />
        </>
      ) : kind === 'web' ? (
        <>
          <rect x="4" y="7" width="32" height="26" rx="3" />
          <path d="M4 14h32M9 10h1m4 0h1M15 20l-5 4 5 4m10-8 5 4-5 4" />
        </>
      ) : (
        <>
          <path d="m12 12-9 8 9 8m16-16 9 8-9 8M24 6l-8 28" />
        </>
      )}
    </svg>
  )
}

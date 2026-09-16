/**
 * CreAI custom icon set. One family, drawn on a 24px grid: 1.75 stroke,
 * round caps and joins, currentColor throughout, one accent shape per icon.
 * No icon library — these are the brand.
 */

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Logo mark: the CreAI tile (public/logo.png). Sized by the caller's className. */
export function LogoMark({ className }: IconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="CreAI"
      width={180}
      height={180}
      draggable={false}
      className={`rounded-[22%] select-none ${className ?? ''}`}
    />
  );
}

/** Leads: a funnel that ends in a decision, not a drip. */
export function IconLeads({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 4h16l-6 7.5V19l-4 1.5V11.5L4 4Z" />
      <circle cx="6" cy="2.5" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="12" cy="1.9" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="18" cy="2.5" r="0.9" fill="currentColor" stroke="none" />
      <path d="M15.5 16.5l1.6 1.6L20.5 15" />
    </Svg>
  );
}

/** Inbox: a tray with mail settling into sorted order. */
export function IconInbox({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3.5 13.5 6 6.5h12l2.5 7" />
      <path d="M3.5 13.5h5l1.2 2.5h4.6l1.2-2.5h5V19a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 19v-5.5Z" />
      <path d="M9.5 3.5h5" />
      <path d="M8 1v.01" strokeWidth="2.2" />
      <path d="M16 1v.01" strokeWidth="2.2" />
    </Svg>
  );
}

/** Repurpose: one source page branching into three channels. */
export function IconRepurpose({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="2.5" y="5" width="8" height="11" rx="1.5" />
      <path d="M5 8.5h3M5 11h3M5 13.5h2" />
      <path d="M10.5 10.5h4" />
      <path d="M14.5 10.5c3 0 3-5 6-5M14.5 10.5c3 0 3 5 6 5M14.5 10.5h6" />
      <circle cx="21" cy="5.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="21" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="21" cy="15.5" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Skills: a skill chip slotting into place. */
export function IconSkills({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M12 1.5V4M12 20v2.5M1.5 12H4M20 12h2.5" />
      <path d="M13.2 8 9.8 12.6h2.8L11.4 16l3.8-4.9h-2.9l.9-3.1Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

/** Ownership: a key, cut like a code bracket. */
export function IconKey({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="7.5" cy="14.5" r="4" />
      <circle cx="7.5" cy="14.5" r="1.2" fill="currentColor" stroke="none" />
      <path d="M10.5 11.5 19 3M15.5 6.5l3 3M12.8 9.2l2.2 2.2" />
    </Svg>
  );
}

/** It runs: a terminal prompt with a heartbeat. */
export function IconRuns({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="2.5" y="4" width="19" height="15" rx="2" />
      <path d="M6 9l3 2.5L6 14" />
      <path d="M11.5 14.5h4" />
      <path d="M2.5 7.5h19" strokeWidth="1.2" />
    </Svg>
  );
}

/** Craft: a nib — the mark of things written with intent. */
export function IconCraft({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 2.5c3.5 2.5 5.5 5.5 5.5 9A5.5 5.5 0 0 1 12 17a5.5 5.5 0 0 1-5.5-5.5c0-3.5 2-6.5 5.5-9Z" />
      <path d="M12 8.5V21.5" />
      <circle cx="12" cy="11.5" r="1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.5 12.5 9.5 17.5 19.5 6.5" />
    </Svg>
  );
}

export function IconArrow({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Svg>
  );
}

export function IconDownload({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3v11M7 9.5l5 5 5-5" />
      <path d="M4 17.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5" />
    </Svg>
  );
}

/** Gift: the free skill. */
export function IconGift({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v7.5A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V12M12 8v13" />
      <path d="M12 8c-4.5 0-5.5-5-2.5-5C11.5 3 12 6 12 8ZM12 8c4.5 0 5.5-5 2.5-5C12.5 3 12 6 12 8Z" />
    </Svg>
  );
}

export function IconMail({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4.5 7.5 7.5 6 7.5-6" />
    </Svg>
  );
}

/** Wrench + spark: done-for-you builds. */
export function IconBuild({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.5 6.5a4 4 0 0 1 5-5l-2.6 2.6 2 2L20.5 3.5a4 4 0 0 1-5 5L8 16a2.1 2.1 0 1 1-3-3l7.5-7.5" />
      <path d="M5 5l2 2" />
      <circle cx="18.5" cy="18.5" r="0.01" strokeWidth="2.4" />
      <path d="M18.5 15.5v2M18.5 19.5v2M15.5 18.5h2M19.5 18.5h2" strokeWidth="1.4" />
    </Svg>
  );
}

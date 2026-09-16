/**
 * Hero background: an engineer's schematic of an agent workflow — inputs
 * flowing through a decision node into ranked outcomes — drawn on a faint
 * drafting grid. Pure inline SVG, ink-on-paper, no gradients, no stock art.
 */
export function WorkflowSchematic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 720 560"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0v40" stroke="var(--ink)" strokeOpacity="0.07" strokeWidth="1" fill="none" />
        </pattern>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="var(--brand)" fillOpacity="0.55" />
        </marker>
      </defs>

      <rect width="720" height="560" fill="url(#grid)" />

      <g stroke="var(--ink)" strokeOpacity="0.5" strokeWidth="1.5">
        {/* three inputs */}
        <g>
          <rect x="60" y="90" width="150" height="52" rx="8" fill="var(--paper)" />
          <line x1="82" y1="110" x2="188" y2="110" strokeOpacity="0.35" />
          <line x1="82" y1="122" x2="166" y2="122" strokeOpacity="0.35" />
        </g>
        <g>
          <rect x="60" y="254" width="150" height="52" rx="8" fill="var(--paper)" />
          <line x1="82" y1="274" x2="188" y2="274" strokeOpacity="0.35" />
          <line x1="82" y1="286" x2="150" y2="286" strokeOpacity="0.35" />
        </g>
        <g>
          <rect x="60" y="418" width="150" height="52" rx="8" fill="var(--paper)" />
          <line x1="82" y1="438" x2="188" y2="438" strokeOpacity="0.35" />
          <line x1="82" y1="450" x2="174" y2="450" strokeOpacity="0.35" />
        </g>
      </g>

      {/* flows into the agent node */}
      <g stroke="var(--brand)" strokeOpacity="0.55" strokeWidth="1.75" fill="none">
        <path d="M210 116 C 300 116, 300 250, 372 262" markerEnd="url(#arrow)" />
        <path d="M210 280 C 280 280, 300 280, 372 280" markerEnd="url(#arrow)" />
        <path d="M210 444 C 300 444, 300 310, 372 298" markerEnd="url(#arrow)" />
      </g>

      {/* the agent: hexagonal decision node */}
      <g>
        <path
          d="M430 226 470 253 470 307 430 334 390 307 390 253Z"
          fill="var(--paper)"
          stroke="var(--brand)"
          strokeOpacity="0.8"
          strokeWidth="2"
        />
        <circle cx="430" cy="280" r="7" fill="var(--brand)" fillOpacity="0.85" />
        <circle cx="430" cy="280" r="17" stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="1.5" fill="none" />
      </g>

      {/* ranked outputs */}
      <g stroke="var(--brand)" strokeOpacity="0.55" strokeWidth="1.75" fill="none">
        <path d="M470 262 C 530 250, 540 170, 588 160" markerEnd="url(#arrow)" />
        <path d="M470 280 C 530 280, 540 280, 588 280" markerEnd="url(#arrow)" />
        <path d="M470 298 C 530 310, 540 390, 588 400" markerEnd="url(#arrow)" />
      </g>
      <g strokeWidth="1.5" fill="var(--paper)">
        <g stroke="var(--brand)" strokeOpacity="0.75">
          <rect x="592" y="134" width="84" height="48" rx="8" />
          <path d="M608 152l7 7 14-13" strokeWidth="2" fill="none" />
        </g>
        <g stroke="var(--ink)" strokeOpacity="0.45">
          <rect x="592" y="256" width="84" height="48" rx="8" />
          <line x1="608" y1="274" x2="660" y2="274" strokeOpacity="0.5" />
          <line x1="608" y1="286" x2="644" y2="286" strokeOpacity="0.5" />
        </g>
        <g stroke="var(--ink)" strokeOpacity="0.3">
          <rect x="592" y="376" width="84" height="48" rx="8" />
          <line x1="608" y1="394" x2="652" y2="394" strokeOpacity="0.4" />
          <line x1="608" y1="406" x2="636" y2="406" strokeOpacity="0.4" />
        </g>
      </g>

      {/* human checkpoint: the loop stays supervised */}
      <g stroke="var(--accent)" strokeOpacity="0.7" strokeWidth="1.75" fill="none">
        <path d="M430 334v56c0 10 8 18 18 18h130" strokeDasharray="3 7" />
        <circle cx="596" cy="408" r="0" />
      </g>
      <g stroke="var(--accent)" strokeOpacity="0.8" strokeWidth="1.75" fill="var(--paper)">
        <circle cx="430" cy="432" r="14" />
        <circle cx="430" cy="428" r="4" fill="none" />
        <path d="M423 439c1.5-4 12.5-4 14 0" fill="none" />
      </g>

      {/* drafting annotations */}
      <g fill="var(--ink)" fillOpacity="0.45" fontFamily="var(--font-inter), sans-serif" fontSize="11" letterSpacing="0.08em">
        <text x="60" y="76">INPUT</text>
        <text x="384" y="212">AGENT</text>
        <text x="592" y="120">RANKED</text>
        <text x="452" y="452">YOU DECIDE</text>
      </g>
    </svg>
  );
}

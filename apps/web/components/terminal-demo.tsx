'use client';

import { useEffect, useRef, useState } from 'react';

/** Product-forward hero element: the free Meeting Actions skill, shown doing
 * its actual job. Types itself out when scrolled into view; renders the full
 * transcript immediately under prefers-reduced-motion or without JS events. */

type Line = { text: string; cls?: string };

const LINES: Line[] = [
  { text: '$ claude', cls: 'text-paper/50' },
  { text: '> here’s the transcript from our pricing call — what do we owe each other?', cls: 'text-paper/80' },
  { text: '' },
  { text: '◆ creai-meeting-actions', cls: 'text-emerald-300 font-semibold' },
  { text: '  Reading transcript… 4 speakers, 41 minutes.', cls: 'text-paper/60' },
  { text: '' },
  { text: '  DECISIONS', cls: 'text-amber-300 font-semibold' },
  { text: '  1. Ship the pricing page update this Friday  (Maya, Tom agreed)' },
  { text: '  2. Pause the reseller pilot until Q1' },
  { text: '' },
  { text: '  ACTION ITEMS', cls: 'text-amber-300 font-semibold' },
  { text: '  → Maya — final pricing copy — Thu' },
  { text: '  → Tom — update Stripe products — Fri' },
  { text: '  → Ravi — notify reseller list — Mon (proposed)' },
  { text: '' },
  { text: '  ⚠ no owner: “fix onboarding email typo” — assign or it dies', cls: 'text-red-300' },
  { text: '' },
  { text: '  Follow-up email drafted → you review, you send.', cls: 'text-emerald-300' },
];

export function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // count of fully shown lines
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !el || typeof IntersectionObserver === 'undefined') {
      setProgress(LINES.length);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || progress >= LINES.length) return;
    const line = LINES[progress];
    const delay = line.text === '' ? 90 : Math.min(120 + line.text.length * 9, 520);
    const t = setTimeout(() => setProgress((p) => p + 1), delay);
    return () => clearTimeout(t);
  }, [started, progress]);

  const done = progress >= LINES.length;

  return (
    <div ref={ref} className="rounded-lg overflow-hidden border border-ink/20 shadow-[0_20px_60px_-24px_rgba(26,29,33,0.45)]">
      <div className="flex items-center gap-2 px-4 py-3 bg-ink border-b border-paper/10">
        <span className="w-3 h-3 rounded-full bg-paper/20" />
        <span className="w-3 h-3 rounded-full bg-paper/20" />
        <span className="w-3 h-3 rounded-full bg-paper/20" />
        <span className="ml-3 text-xs text-paper/50 font-medium tracking-wide">claude — creai-meeting-actions</span>
      </div>
      <div className="bg-ink px-5 py-5 font-mono text-[13px] leading-relaxed min-h-[26rem]" aria-label="Demo of the Meeting Actions skill output">
        {LINES.slice(0, progress).map((line, i) => (
          <div key={i} className={line.cls ?? 'text-paper/90'}>
            {line.text || ' '}
          </div>
        ))}
        {!done && <div className={started ? 'caret' : 'text-paper/40'}>{started ? '' : ' '}</div>}
      </div>
    </div>
  );
}

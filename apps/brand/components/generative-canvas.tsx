'use client';

import { useEffect, useRef } from 'react';

/**
 * The brand's centerpiece: a live generative ink painting.
 *
 * A flow field (layered sinusoids — cheap, deterministic per-seed, organic)
 * steers a few hundred particles that leave translucent ink strokes in the
 * brand palette. The visitor's cursor bends the field, so the artwork is
 * co-drawn with them. Every visit gets a fresh seed: no two people see the
 * same painting.
 *
 * Discipline: no libraries, DPR-capped, pauses when the tab is hidden, and
 * under prefers-reduced-motion it renders a single finished painting with no
 * animation loop.
 */
export function GenerativeCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // per-visit seed → field constants
    const seed = Math.random() * 1000;
    const s1 = 0.0016 + (seed % 1) * 0.0012;
    const s2 = 0.0021 + ((seed * 7) % 1) * 0.001;
    const drift = (seed * 13) % (Math.PI * 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999 };

    const COLORS = [
      { c: '242,239,232', w: 0.5 },  // cream
      { c: '61,161,131', w: 0.38 }, // leaf
      { c: '217,145,54', w: 0.12 }, // ember
    ];
    const pickColor = () => {
      const r = Math.random();
      let acc = 0;
      for (const { c, w } of COLORS) {
        acc += w;
        if (r <= acc) return c;
      }
      return COLORS[0].c;
    };

    type P = { x: number; y: number; px: number; py: number; v: number; color: string; life: number };
    let particles: P[] = [];

    const spawn = (): P => ({
      x: Math.random() * width,
      y: Math.random() * height,
      px: 0,
      py: 0,
      v: 0.6 + Math.random() * 1.3,
      color: pickColor(),
      life: 120 + Math.random() * 380,
    });

    const field = (x: number, y: number, t: number) => {
      const a =
        Math.sin(x * s1 + t * 0.00016 + drift) +
        Math.cos(y * s2 - t * 0.00011) +
        Math.sin((x + y) * 0.0008 + t * 0.00007);
      return a * 1.35;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = 'rgba(16,19,22,1)';
      ctx.fillRect(0, 0, width, height);
      particles = Array.from({ length: reduced ? 700 : 430 }, spawn);
    };

    const step = (t: number) => {
      for (const p of particles) {
        p.px = p.x;
        p.py = p.y;
        let angle = field(p.x, p.y, t);

        // the visitor bends the field
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) {
          const d = Math.sqrt(d2) || 1;
          angle += Math.atan2(dy, dx) * 0.35 * (1 - d / 150);
        }

        p.x += Math.cos(angle) * p.v;
        p.y += Math.sin(angle) * p.v;
        p.life -= 1;

        if (p.life <= 0 || p.x < -20 || p.x > width + 20 || p.y < -20 || p.y > height + 20) {
          Object.assign(p, spawn(), { px: undefined });
          p.px = p.x;
          p.py = p.y;
          continue;
        }

        ctx.strokeStyle = `rgba(${p.color},0.27)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }
    };

    resize();

    if (reduced) {
      // one finished painting, no motion
      for (let i = 0; i < 700; i++) step(i * 16);
    } else {
      const loop = (t: number) => {
        if (!running) return;
        // slow fade → strokes accumulate into washes, then breathe out
        ctx.fillStyle = 'rgba(16,19,22,0.016)';
        ctx.fillRect(0, 0, width, height);
        step(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running && !reduced) raf = requestAnimationFrame((t) => step(t));
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerleave', onLeave);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', resize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

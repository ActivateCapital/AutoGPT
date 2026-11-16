'use client';

import { useEffect } from 'react';
import { classifyHref } from '@/lib/events';

function send(payload: Record<string, string>) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) navigator.sendBeacon('/api/event', new Blob([body], { type: 'application/json' }));
    else fetch('/api/event', { method: 'POST', body, keepalive: true }).catch(() => {});
  } catch {
    /* counting must never break the page */
  }
}

/** Visit source: utm_source if present, else the referring site's host; kept for the visit only. */
function source(): string {
  try {
    const saved = sessionStorage.getItem('store_src');
    if (saved) return saved;
    const utm = new URLSearchParams(location.search).get('utm_source');
    let src = utm || '';
    if (!src && document.referrer) {
      const host = new URL(document.referrer).hostname;
      if (host !== location.hostname) src = host;
    }
    src = src || 'direct';
    sessionStorage.setItem('store_src', src);
    return src;
  } catch {
    return 'direct';
  }
}

/** Counts page views, Buy clicks, free downloads and email taps, first-party only. */
export function StoreEvents() {
  useEffect(() => {
    const src = source();
    send({ ev: 'view', item: location.pathname, src });
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a) return;
      const hit = classifyHref(a.getAttribute('href') || '');
      if (hit) send({ ev: hit.ev, item: hit.item, src });
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
  return null;
}

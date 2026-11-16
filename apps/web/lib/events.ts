import { kits, bundle } from './products';

// First-party store funnel: one log line per step, no cookies, no third parties.
// Railway keeps the deploy log, so `[store] event=` lines are the funnel data.

export const FREE_ZIP = '/downloads/creai-meeting-actions-free.zip';

export type StoreEvent = 'view' | 'buy' | 'free' | 'contact';

const PRODUCTS = [...kits, bundle];

/** Maps a clicked href to a funnel event. Unknown links return null. */
export function classifyHref(href: string): { ev: StoreEvent; item: string } | null {
  if (!href) return null;
  const clean = href.split('#')[0].split('?')[0];
  if (clean.endsWith(FREE_ZIP)) return { ev: 'free', item: 'meeting-actions-free' };
  if (clean.startsWith('mailto:')) return { ev: 'contact', item: 'email' };
  const p = PRODUCTS.find((x) => x.paymentLink.startsWith('https://') && clean === x.paymentLink);
  return p ? { ev: 'buy', item: p.id } : null;
}

const BOT = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|httpclient|facebookexternalhit/i;
export const isBot = (ua: string | null) => !ua || BOT.test(ua);

const SAFE = /^[a-z0-9._\-/]{0,80}$/;
/** Keeps only short lowercase tokens so nothing a visitor types reaches the log verbatim. */
export function token(v: unknown): string {
  if (typeof v !== 'string') return '-';
  const t = v.trim().toLowerCase().slice(0, 80);
  return t && SAFE.test(t) ? t : '-';
}

export function validItem(ev: StoreEvent, item: string): boolean {
  if (ev === 'view') return item === '-' || item.startsWith('/');
  if (ev === 'free') return item === 'meeting-actions-free';
  if (ev === 'contact') return item === 'email';
  return PRODUCTS.some((p) => p.id === item);
}

/** Per-IP cap; evicts the oldest entry instead of clearing everything. */
export class RateLimit {
  private hits = new Map<string, { n: number; t: number }>();
  constructor(private max = 60, private windowMs = 3_600_000, private size = 5000) {}
  allow(key: string, now = Date.now()): boolean {
    const e = this.hits.get(key);
    if (!e || now - e.t > this.windowMs) {
      if (this.hits.size >= this.size) {
        const oldest = this.hits.keys().next().value;
        if (oldest !== undefined) this.hits.delete(oldest);
      }
      this.hits.delete(key);
      this.hits.set(key, { n: 1, t: now });
      return true;
    }
    e.n += 1;
    return e.n <= this.max;
  }
}

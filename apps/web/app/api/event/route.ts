import { isBot, token, validItem, RateLimit, type StoreEvent } from '@/lib/events';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const EVENTS: StoreEvent[] = ['view', 'buy', 'free', 'contact'];
const limiter = new RateLimit();

// Accepts navigator.sendBeacon posts from the store pages and writes one line
// per funnel step to the deploy log. Always answers 204 so it never affects the page.
export async function POST(req: Request) {
  const done = new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
  if (isBot(req.headers.get('user-agent'))) return done;
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  if (!limiter.allow(ip)) return done;

  let body: Record<string, unknown> = {};
  try {
    const text = await req.text();
    if (text.length > 1024) return done;
    body = JSON.parse(text);
  } catch {
    return done;
  }
  const ev = EVENTS.find((e) => e === body.ev);
  if (!ev) return done;
  const item = token(body.item);
  if (!validItem(ev, item)) return done;
  const src = token(body.src);
  console.log(`[store] event=${ev} item=${item} src=${src}`);
  return done;
}

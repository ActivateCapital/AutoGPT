import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { checkPurchase, findDeliverable } from '@/lib/delivery';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DIR = path.join(process.cwd(), 'private-downloads');

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const item = findDeliverable(params.slug);
  if (!item) return new Response('Not found', { status: 404 });

  const url = new URL(req.url);
  const check = await checkPurchase(item, url.searchParams.get('session_id'));
  if (!check.ok) {
    return new Response('We could not confirm this purchase. Email contact@creai.dev and we will sort it out.', {
      status: check.reason === 'stripe-error' ? 503 : 403,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  const requested = url.searchParams.get('file');
  const entry = item.files.find((f) => f.file === requested) ?? item.files[0];
  try {
    const body = await readFile(path.join(DIR, entry.file));
    return new Response(body, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${entry.file}"`,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch {
    return new Response('File unavailable. Email contact@creai.dev.', { status: 500 });
  }
}

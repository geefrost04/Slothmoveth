import { NextResponse } from 'next/server';
import { JOBS_DATA } from '@/data/jobs';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const job = JOBS_DATA.find((item) => String(item.id) === id);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job, {
    headers: {
      'Cache-Control': 'public, max-age=60, s-maxage=300',
    },
  });
}

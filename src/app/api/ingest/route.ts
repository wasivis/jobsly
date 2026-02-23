import { NextResponse } from 'next/server';
import { ingestRealJobs } from '@/lib/ingestor';

export async function GET() {
  await ingestRealJobs();
  return NextResponse.json({ message: "Real-world sync complete." });
}
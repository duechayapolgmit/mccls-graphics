import { getRawConfig } from '@/lib/server/configLoader';
import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json(getRawConfig());
}

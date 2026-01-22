/**
 * API Route: /api/status
 * GET - Get system status
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGTJSON } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL } from '@/lib/cache';
import type { StatusResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const status = await getCachedOrExecute<StatusResponse>(
      'status',
      async () => {
        const result = await execGTJSON(['status', '--json', '--fast']);
        return {
          ...result,
          timestamp: new Date().toISOString(),
        };
      },
      CACHE_TTL.status
    );

    return NextResponse.json(status);
  } catch (error: any) {
    console.error('[API] Status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get status' },
      { status: 500 }
    );
  }
}

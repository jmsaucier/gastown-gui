/**
 * API Route: /api/health
 * GET - Get health check (fast version without running doctor)
 */

import { NextRequest, NextResponse } from 'next/server';
import type { HealthCheckResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    // Fast health check - just verify server is running
    const health: HealthCheckResponse = {
      status: 'healthy',
      checks: [
        {
          name: 'Server',
          status: 'pass',
          message: 'Server is running',
        },
      ],
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(health);
  } catch (error: any) {
    console.error('[API] Health error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get health' },
      { status: 500 }
    );
  }
}

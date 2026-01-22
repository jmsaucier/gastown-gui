/**
 * API Route: /api/doctor
 * GET - Run full health check with gt doctor
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT, execGTJSON } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL } from '@/lib/cache';
import type { HealthCheckResponse } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const health = await getCachedOrExecute<HealthCheckResponse>(
      'doctor',
      async () => {
        // Try JSON output first
        try {
          const data = await execGTJSON<HealthCheckResponse>(['doctor']);
          return data;
        } catch {
          // Fall back to text parsing if JSON not supported
          const output = await execGT(['doctor']);
          
          // Parse doctor output
          const checks = [];
          const lines = output.split('\n');
          
          for (const line of lines) {
            if (line.includes('✓') || line.includes('✔')) {
              checks.push({
                name: line.replace(/[✓✔]/g, '').trim(),
                status: 'pass' as const,
                message: 'OK',
              });
            } else if (line.includes('✗') || line.includes('✖')) {
              checks.push({
                name: line.replace(/[✗✖]/g, '').trim(),
                status: 'fail' as const,
                message: 'Failed',
              });
            } else if (line.includes('⚠') || line.includes('!')) {
              checks.push({
                name: line.replace(/[⚠!]/g, '').trim(),
                status: 'warn' as const,
                message: 'Warning',
              });
            }
          }
          
          const hasFailures = checks.some(c => c.status === 'fail');
          const hasWarnings = checks.some(c => c.status === 'warn');
          
          return {
            status: hasFailures ? 'error' : hasWarnings ? 'warning' : 'healthy',
            checks,
            timestamp: new Date().toISOString(),
          };
        }
      },
      CACHE_TTL.doctor
    );

    return NextResponse.json(health);
  } catch (error: any) {
    console.error('[API] Doctor error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to run doctor' },
      { status: 500 }
    );
  }
}

/**
 * API Route: /api/sling
 * POST - Sling work to an agent
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { invalidateCachePrefix } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bead, target, quality = 'shiny', molecule, args: additionalArgs = [] } = body;
    
    if (!bead || !target) {
      return NextResponse.json(
        { error: 'Bead and target are required' },
        { status: 400 }
      );
    }
    
    const args = ['sling', bead, target];
    
    if (quality && quality !== 'shiny') {
      args.push('--quality', quality);
    }
    
    if (molecule) {
      args.push('--molecule', molecule);
    }
    
    if (additionalArgs.length > 0) {
      args.push(...additionalArgs);
    }
    
    const output = await execGT(args);
    
    // Invalidate relevant caches
    invalidateCachePrefix('status');
    invalidateCachePrefix('agents');
    
    return NextResponse.json({
      success: true,
      message: `Slung ${bead} to ${target}`,
      data: { output },
    });
  } catch (error: any) {
    console.error('[API] Sling error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sling work' },
      { status: 500 }
    );
  }
}

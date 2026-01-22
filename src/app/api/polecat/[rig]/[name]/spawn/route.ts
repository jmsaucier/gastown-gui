/**
 * API Route: /api/polecat/[rig]/[name]/spawn
 * POST - Spawn a polecat
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { invalidateCachePrefix } from '@/lib/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rig: string; name: string }> }
) {
  try {
    const { rig, name } = await params;
    
    const args = ['polecat', 'spawn', rig, name];
    
    await execGT(args);
    
    invalidateCachePrefix('status');
    invalidateCachePrefix('agents');
    
    return NextResponse.json({
      success: true,
      message: `Polecat ${name} spawned on rig ${rig}`,
    });
  } catch (error: any) {
    console.error('[API] Polecat spawn error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to spawn polecat' },
      { status: 500 }
    );
  }
}

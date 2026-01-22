/**
 * API Route: /api/polecat/[rig]/[name]/stop
 * POST - Stop a polecat
 */

import { NextRequest, NextResponse } from 'next/server';
import { execTmux } from '@/lib/cli-wrapper';
import { invalidateCachePrefix } from '@/lib/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rig: string; name: string }> }
) {
  try {
    const { rig, name } = await params;
    
    const sessionName = `${rig}-${name}`;
    
    await execTmux(['kill-session', '-t', sessionName]);
    
    invalidateCachePrefix('status');
    invalidateCachePrefix('agents');
    
    return NextResponse.json({
      success: true,
      message: `Polecat ${name} stopped on rig ${rig}`,
    });
  } catch (error: any) {
    console.error('[API] Polecat stop error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to stop polecat' },
      { status: 500 }
    );
  }
}

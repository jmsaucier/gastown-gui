/**
 * API Route: /api/polecat/[rig]/[name]/restart
 * POST - Restart a polecat
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT, execTmux } from '@/lib/cli-wrapper';
import { invalidateCachePrefix } from '@/lib/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ rig: string; name: string }> }
) {
  try {
    const { rig, name } = await params;
    
    const sessionName = `${rig}-${name}`;
    
    // Stop first
    try {
      await execTmux(['kill-session', '-t', sessionName]);
    } catch {
      // Session might not exist
    }
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Spawn again
    await execGT(['polecat', 'spawn', rig, name]);
    
    invalidateCachePrefix('status');
    invalidateCachePrefix('agents');
    
    return NextResponse.json({
      success: true,
      message: `Polecat ${name} restarted on rig ${rig}`,
    });
  } catch (error: any) {
    console.error('[API] Polecat restart error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to restart polecat' },
      { status: 500 }
    );
  }
}

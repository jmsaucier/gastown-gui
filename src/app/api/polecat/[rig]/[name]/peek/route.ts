/**
 * API Route: /api/polecat/[rig]/[name]/peek
 * GET - Peek at polecat output
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import type { AgentPeekResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rig: string; name: string }> }
) {
  try {
    const { rig, name } = await params;
    
    const output = await execGT(['peek', `${rig}/${name}`]);
    
    const response: AgentPeekResponse = {
      agent: `${rig}/${name}`,
      output,
      status: 'success',
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[API] Polecat peek error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to peek at polecat' },
      { status: 500 }
    );
  }
}

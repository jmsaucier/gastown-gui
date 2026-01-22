/**
 * API Route: /api/polecat/[rig]/[name]/transcript
 * GET - Get polecat transcript
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import type { AgentTranscriptResponse } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ rig: string; name: string }> }
) {
  try {
    const { rig, name } = await params;
    
    const transcript = await execGT(['transcript', `${rig}/${name}`]);
    
    const response: AgentTranscriptResponse = {
      agent: `${rig}/${name}`,
      transcript,
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[API] Polecat transcript error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get transcript' },
      { status: 500 }
    );
  }
}

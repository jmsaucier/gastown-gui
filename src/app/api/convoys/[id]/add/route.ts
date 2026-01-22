/**
 * API Route: /api/convoys/[id]/add
 * POST - Add issues to an existing convoy
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { invalidateCachePrefix } from '@/lib/cache';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const convoyId = params.id;
    const body = await request.json();
    const { issues = [] } = body;
    
    if (!convoyId) {
      return NextResponse.json(
        { error: 'Convoy ID is required' },
        { status: 400 }
      );
    }
    
    if (!issues || issues.length === 0) {
      return NextResponse.json(
        { error: 'At least one issue ID is required' },
        { status: 400 }
      );
    }
    
    // Build command: gt convoy add <convoy-id> <issue-id> [issue-id...]
    const args = ['convoy', 'add', convoyId, ...issues];
    
    await execGT(args);
    
    // Invalidate convoy cache
    invalidateCachePrefix('convoys');
    
    return NextResponse.json({
      success: true,
      message: `Added ${issues.length} issue(s) to convoy "${convoyId}"`,
    });
  } catch (error: any) {
    console.error('[API] Add issues to convoy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add issues to convoy' },
      { status: 500 }
    );
  }
}

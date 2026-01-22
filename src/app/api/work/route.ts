/**
 * API Route: /api/work
 * GET - List work items
 * POST - Create work item (bead)
 */

import { NextRequest, NextResponse } from 'next/server';
import { execBD, execGT } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL, invalidateCachePrefix } from '@/lib/cache';
import type { WorkItem } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const rig = searchParams.get('rig');
    
    const cacheKey = `work:${status || 'all'}:${rig || 'all'}`;
    
    const work = await getCachedOrExecute<WorkItem[]>(
      cacheKey,
      async () => {
        const args = ['list'];
        if (status) args.push('--status', status);
        
        const output = await execBD(args, rig ? { cwd: rig } : undefined);
        
        // Parse work list output
        const items: WorkItem[] = [];
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          // Simple parsing - adjust based on actual bd output format
          const match = line.match(/^(\w+-\d+)\s+(.+)$/);
          if (match) {
            items.push({
              id: match[1],
              title: match[2],
              status: 'open',
              created: new Date().toISOString(),
              type: 'bead',
            });
          }
        }
        
        return items;
      },
      CACHE_TTL.convoys
    );

    return NextResponse.json(work);
  } catch (error: any) {
    console.error('[API] Work list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list work' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, labels, sling_now } = body;
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const args = ['new', title];
    
    if (description) {
      args.push('--description', description);
    }
    
    if (priority) {
      args.push('--priority', priority);
    }
    
    if (labels && labels.length > 0) {
      args.push('--labels', labels.join(','));
    }
    
    const output = await execBD(args);
    
    // Invalidate work cache
    invalidateCachePrefix('work');
    
    return NextResponse.json({
      success: true,
      message: `Work item created: ${title}`,
      data: { output },
    });
  } catch (error: any) {
    console.error('[API] Create work error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create work item' },
      { status: 500 }
    );
  }
}

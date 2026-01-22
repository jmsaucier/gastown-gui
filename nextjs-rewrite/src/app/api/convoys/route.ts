/**
 * API Route: /api/convoys
 * GET - List convoys
 * POST - Create convoy
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL, invalidateCachePrefix } from '@/lib/cache';
import type { Convoy } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const cacheKey = status ? `convoys:${status}` : 'convoys';
    
    const convoys = await getCachedOrExecute<Convoy[]>(
      cacheKey,
      async () => {
        const args = ['convoy', 'list'];
        if (status) args.push('--status', status);
        
        const output = await execGT(args);
        
        // Parse convoy list output
        const convoys: Convoy[] = [];
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          // Simple parsing - adjust based on actual output format
          const match = line.match(/^(\w+)\s+(.+)$/);
          if (match) {
            convoys.push({
              id: match[1],
              name: match[2],
              issues: [],
              status: 'active',
              created: new Date().toISOString(),
            });
          }
        }
        
        return convoys;
      },
      CACHE_TTL.convoys
    );

    return NextResponse.json(convoys);
  } catch (error: any) {
    console.error('[API] Convoys list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list convoys' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, issues = [], notify } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    const args = ['convoy', 'create', name];
    
    if (issues.length > 0) {
      args.push('--issues', issues.join(','));
    }
    
    if (notify) {
      args.push('--notify', notify);
    }
    
    await execGT(args);
    
    // Invalidate convoy cache
    invalidateCachePrefix('convoys');
    
    return NextResponse.json({
      success: true,
      message: `Convoy "${name}" created`,
    });
  } catch (error: any) {
    console.error('[API] Create convoy error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create convoy' },
      { status: 500 }
    );
  }
}

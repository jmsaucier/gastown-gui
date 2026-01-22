/**
 * API Route: /api/convoys
 * GET - List convoys
 * POST - Create convoy
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT, execGTJSON } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL, invalidateCachePrefix } from '@/lib/cache';
import { gt } from '@/lib/gastown-commands';
import type { Convoy } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const cacheKey = status ? `convoys:${status}` : 'convoys';
    
    const convoys = await getCachedOrExecute<Convoy[]>(
      cacheKey,
      async () => {
        // Use type-safe command builder (see src/lib/gastown-commands.ts)
        const args = gt('convoy')
          .subcommand('list')
          .flag('--status', status || undefined)
          .flag('--json')
          .build();
        
        // Use JSON output
        const convoys = await execGTJSON<Convoy[]>(args);
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
    
    // Use type-safe command builder (see src/lib/gastown-commands.ts)
    const args = gt('convoy')
      .subcommand('create')
      .arg(name)
      .flag('--issues', issues.length > 0 ? issues.join(',') : undefined)
      .flag('--notify', notify || undefined)
      .build();
    
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

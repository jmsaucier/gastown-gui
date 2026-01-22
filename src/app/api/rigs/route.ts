/**
 * API Route: /api/rigs
 * GET - List rigs
 * POST - Add rig
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL, invalidateCachePrefix } from '@/lib/cache';
import type { Rig } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const rigs = await getCachedOrExecute<Rig[]>(
      'rigs',
      async () => {
        const output = await execGT(['rig', 'list']);
        
        // Parse rig list output
        const rigs: Rig[] = [];
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const match = line.match(/^(\S+)\s+(.+)$/);
          if (match) {
            rigs.push({
              name: match[1],
              path: match[2],
              agents: [],
            });
          }
        }
        
        return rigs;
      },
      CACHE_TTL.rigs
    );

    return NextResponse.json(rigs);
  } catch (error: any) {
    console.error('[API] Rigs list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list rigs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, url, path: rigPath } = body;
    
    if (!name || !url) {
      return NextResponse.json(
        { error: 'Name and URL are required' },
        { status: 400 }
      );
    }
    
    const args = ['rig', 'add', name, url];
    
    if (rigPath) {
      args.push('--path', rigPath);
    }
    
    await execGT(args);
    
    // Invalidate rig cache
    invalidateCachePrefix('rigs');
    invalidateCachePrefix('status');
    
    return NextResponse.json({
      success: true,
      message: `Rig "${name}" added`,
    });
  } catch (error: any) {
    console.error('[API] Add rig error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add rig' },
      { status: 500 }
    );
  }
}

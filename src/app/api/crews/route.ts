/**
 * API Route: /api/crews
 * GET - List crews
 * POST - Create crew
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL, invalidateCachePrefix } from '@/lib/cache';
import type { Crew } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const crews = await getCachedOrExecute<Crew[]>(
      'crews',
      async () => {
        const output = await execGT(['crew', 'list']);
        
        const crews: Crew[] = [];
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          const match = line.match(/^(\S+)/);
          if (match) {
            crews.push({
              name: match[1],
              members: [],
            });
          }
        }
        
        return crews;
      },
      CACHE_TTL.rigs
    );

    return NextResponse.json(crews);
  } catch (error: any) {
    console.error('[API] Crews list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list crews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, members, rig } = body;
    
    if (!name || !members || members.length === 0) {
      return NextResponse.json(
        { error: 'Name and members are required' },
        { status: 400 }
      );
    }
    
    const args = ['crew', 'create', name, ...members];
    
    if (rig) {
      args.push('--rig', rig);
    }
    
    await execGT(args);
    
    invalidateCachePrefix('crews');
    
    return NextResponse.json({
      success: true,
      message: `Crew "${name}" created`,
    });
  } catch (error: any) {
    console.error('[API] Create crew error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create crew' },
      { status: 500 }
    );
  }
}

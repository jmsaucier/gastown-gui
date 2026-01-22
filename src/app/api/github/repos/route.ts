/**
 * API Route: /api/github/repos
 * GET - List GitHub Repositories
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGHJSON } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    const repos = await getCachedOrExecute<any[]>(
      'github:repos',
      async () => {
        const args = ['repo', 'list', '--json', 'name,owner,url'];
        
        const data = await execGHJSON<any[]>(args);
        
        return data;
      },
      CACHE_TTL.github_prs
    );

    return NextResponse.json(repos);
  } catch (error: any) {
    console.error('[API] GitHub Repos error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list repositories' },
      { status: 500 }
    );
  }
}

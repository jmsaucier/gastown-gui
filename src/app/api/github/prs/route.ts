/**
 * API Route: /api/github/prs
 * GET - List GitHub Pull Requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGHJSON } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL } from '@/lib/cache';
import type { GitHubPR } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'open';
    
    const cacheKey = `github:prs:${state}`;
    
    const prs = await getCachedOrExecute<GitHubPR[]>(
      cacheKey,
      async () => {
        const args = ['pr', 'list', '--state', state, '--json', 'number,title,state,author,createdAt,updatedAt,url'];
        
        const data = await execGHJSON<any[]>(args);
        
        return data.map((pr: any) => ({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          author: pr.author?.login || 'unknown',
          created_at: pr.createdAt,
          updated_at: pr.updatedAt,
          url: pr.url,
        }));
      },
      CACHE_TTL.github_prs
    );

    return NextResponse.json(prs);
  } catch (error: any) {
    console.error('[API] GitHub PRs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list PRs' },
      { status: 500 }
    );
  }
}

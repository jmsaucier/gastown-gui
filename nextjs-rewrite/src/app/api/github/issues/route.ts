/**
 * API Route: /api/github/issues
 * GET - List GitHub Issues
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGH } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL } from '@/lib/cache';
import type { GitHubIssue } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'open';
    
    const cacheKey = `github:issues:${state}`;
    
    const issues = await getCachedOrExecute<GitHubIssue[]>(
      cacheKey,
      async () => {
        const args = ['issue', 'list', '--state', state, '--json', 'number,title,state,author,createdAt,updatedAt,url'];
        
        const output = await execGH(args);
        const data = JSON.parse(output);
        
        return data.map((issue: any) => ({
          number: issue.number,
          title: issue.title,
          state: issue.state,
          author: issue.author?.login || 'unknown',
          created_at: issue.createdAt,
          updated_at: issue.updatedAt,
          url: issue.url,
        }));
      },
      CACHE_TTL.github_issues
    );

    return NextResponse.json(issues);
  } catch (error: any) {
    console.error('[API] GitHub Issues error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list issues' },
      { status: 500 }
    );
  }
}

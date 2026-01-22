/**
 * API Route: /api/mail
 * GET - List mail messages
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL } from '@/lib/cache';
import type { MailMessage } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    
    const cacheKey = filter ? `mail:${filter}` : 'mail';
    
    const mail = await getCachedOrExecute<MailMessage[]>(
      cacheKey,
      async () => {
        const args = ['mail', 'inbox'];
        if (filter && filter !== 'mine') {
          args.push('--all');
        }
        
        const output = await execGT(args);
        
        const messages: MailMessage[] = [];
        const lines = output.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          // Simple parsing - adjust based on actual mail output format
          const match = line.match(/^(\S+)\s+from\s+(\S+):\s+(.+)$/);
          if (match) {
            messages.push({
              id: match[1],
              from: match[2],
              to: 'human',
              subject: match[3],
              body: '',
              timestamp: new Date().toISOString(),
            });
          }
        }
        
        return messages;
      },
      CACHE_TTL.mail
    );

    return NextResponse.json(mail);
  } catch (error: any) {
    console.error('[API] Mail list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list mail' },
      { status: 500 }
    );
  }
}

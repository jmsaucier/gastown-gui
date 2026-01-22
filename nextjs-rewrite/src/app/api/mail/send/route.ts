/**
 * API Route: /api/mail/send
 * POST - Send mail message
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT } from '@/lib/cli-wrapper';
import { invalidateCachePrefix } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;
    
    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'To, subject, and message are required' },
        { status: 400 }
      );
    }
    
    const args = ['mail', 'send', to, subject, message];
    
    await execGT(args);
    
    invalidateCachePrefix('mail');
    
    return NextResponse.json({
      success: true,
      message: `Mail sent to ${to}`,
    });
  } catch (error: any) {
    console.error('[API] Send mail error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send mail' },
      { status: 500 }
    );
  }
}

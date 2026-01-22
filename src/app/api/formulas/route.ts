/**
 * API Route: /api/formulas
 * GET - List formulas
 * POST - Create formula
 */

import { NextRequest, NextResponse } from 'next/server';
import { execGT, execGTJSON } from '@/lib/cli-wrapper';
import { getCachedOrExecute, CACHE_TTL, invalidateCachePrefix } from '@/lib/cache';
import type { Formula } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const formulas = await getCachedOrExecute<Formula[]>(
      'formulas',
      async () => {
        // Use JSON output
        const formulas = await execGTJSON<Formula[]>(['formula', 'list']);
        return formulas;
      },
      CACHE_TTL.formulas
    );

    return NextResponse.json(formulas);
  } catch (error: any) {
    console.error('[API] Formulas list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list formulas' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, template } = body;
    
    if (!name || !template) {
      return NextResponse.json(
        { error: 'Name and template are required' },
        { status: 400 }
      );
    }
    
    const args = ['formula', 'create', name, template];
    
    if (description) {
      args.push('--description', description);
    }
    
    await execGT(args);
    
    invalidateCachePrefix('formulas');
    
    return NextResponse.json({
      success: true,
      message: `Formula "${name}" created`,
    });
  } catch (error: any) {
    console.error('[API] Create formula error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create formula' },
      { status: 500 }
    );
  }
}

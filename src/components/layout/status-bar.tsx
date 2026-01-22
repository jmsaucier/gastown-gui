'use client';

/**
 * Status Bar Component
 * Bottom status bar with hook status and messages
 */

import { useAppState } from '@/contexts/app-state-context';
import { Anchor } from 'lucide-react';

export function StatusBar() {
  const { state } = useAppState();
  const hook = state.status?.hook;

  return (
    <footer className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-8 items-center justify-between px-4 text-sm">
        <div className="flex items-center gap-2">
          <Anchor className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-muted-foreground">
            {hook ? `Hooked: ${hook.work} → ${hook.agent}` : 'No work hooked'}
          </span>
        </div>
        
        <div className="text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs">?</kbd> for help
        </div>
      </div>
    </footer>
  );
}

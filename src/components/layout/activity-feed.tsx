'use client';

/**
 * Activity Feed Component
 * Real-time event stream
 */

import { useAppState } from '@/contexts/app-state-context';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatting';

export function ActivityFeed() {
  const { state, dispatch } = useAppState();
  const events = state.events || [];

  const handleClear = () => {
    dispatch({ type: 'CLEAR_EVENTS' });
  };

  return (
    <aside className="w-80 border-l bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold">Activity</h2>
        <Button variant="ghost" size="icon" onClick={handleClear}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-3">
          {events.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              No recent activity
            </div>
          ) : (
            events.map((event, i) => (
              <div
                key={i}
                className="p-3 rounded-md bg-muted/50 text-sm space-y-1"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium capitalize">{event.type}</span>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatRelativeTime(event.timestamp)}
                  </span>
                </div>
                {event.message && (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {event.message}
                  </p>
                )}
                {event.action && (
                  <span className="inline-block px-2 py-0.5 rounded text-xs bg-background">
                    {event.action}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

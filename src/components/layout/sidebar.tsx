'use client';

/**
 * Sidebar Component
 * Agent tree view
 */

import { useAppState } from '@/contexts/app-state-context';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAgentConfig } from '@/lib/agent-types';

export function Sidebar() {
  const { state } = useAppState();
  const agents = state.agents || [];
  const rigs = state.status?.rigs || [];

  return (
    <aside className="w-64 border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Agents</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <div className="p-4 space-y-2">
          {/* Global Agents */}
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
              Global
            </div>
            {agents
              .filter(a => !a.rig)
              .map((agent, i) => {
                const config = getAgentConfig(agent.name, agent.role);
                return (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-sm">{agent.name}</span>
                    {agent.running && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </div>
                );
              })}
          </div>

          {/* Rig Agents */}
          {rigs.map((rig, i) => (
            <div key={i} className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground uppercase mt-4 mb-2">
                {rig.name}
              </div>
              {rig.agents?.map((agent, j) => {
                const config = getAgentConfig(agent.name, agent.role);
                return (
                  <div
                    key={j}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent cursor-pointer"
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span className="text-sm">{agent.name}</span>
                    {agent.running && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}

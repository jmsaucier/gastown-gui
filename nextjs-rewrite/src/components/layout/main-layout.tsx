'use client';

/**
 * Main Layout Component
 * Combines Header, Sidebar, Content, Activity Feed, and Status Bar
 */

import { Header } from './header';
import { Sidebar } from './sidebar';
import { ActivityFeed } from './activity-feed';
import { StatusBar } from './status-bar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
        <ActivityFeed />
      </div>
      <StatusBar />
    </div>
  );
}

'use client';

/**
 * Header Component
 * Main navigation and controls
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useWebSocket } from '@/contexts/websocket-context';
import { Button } from '@/components/ui/button';
import { Moon, Sun, RefreshCw, HelpCircle } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', path: '/' },
  { id: 'convoys', label: 'Convoys', path: '/convoys' },
  { id: 'work', label: 'Work', path: '/work' },
  { id: 'agents', label: 'Agents', path: '/agents' },
  { id: 'rigs', label: 'Rigs', path: '/rigs' },
  { id: 'crews', label: 'Crews', path: '/crews' },
  { id: 'prs', label: 'PRs', path: '/prs' },
  { id: 'formulas', label: 'Formulas', path: '/formulas' },
  { id: 'issues', label: 'Issues', path: '/issues' },
  { id: 'mail', label: 'Mail', path: '/mail' },
  { id: 'health', label: 'Health', path: '/health' },
];

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { status } = useWebSocket();
  const [mounted, setMounted] = useState(false);

  // Only render theme toggle after component has mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <img src="/assets/favicon-32.png" alt="Gas Town" className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight">GAS TOWN</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 flex-1 overflow-x-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link key={item.id} href={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="whitespace-nowrap"
                >
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${
              status === 'connected' ? 'bg-green-500' : 
              status === 'connecting' ? 'bg-yellow-500' : 
              'bg-red-500'
            }`} />
            <span className="text-muted-foreground capitalize">{status}</span>
          </div>

          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {mounted ? (
              theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" /> // Placeholder during SSR
            )}
          </Button>

          <Button variant="ghost" size="icon">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api-client';
import { Plus, RefreshCw, Mail } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatting';
import type { MailMessage } from '@/types';

export default function MailPage() {
  const [mail, setMail] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'mine' | 'all'>('mine');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getMail({ filter });
      setMail(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mail</h1>
            <p className="text-muted-foreground">Messages from agents</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === 'mine' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('mine')}
          >
            My Inbox
          </Button>
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All Mail
          </Button>
        </div>

        {mail.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No messages
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {mail.map((msg) => (
              <Card key={msg.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{msg.subject}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(msg.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        From: {msg.from}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

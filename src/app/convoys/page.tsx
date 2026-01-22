'use client';

/**
 * Convoys Page
 * List and manage convoys
 */

import { useEffect, useState, useCallback } from 'react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api-client';
import { Plus, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '@/lib/formatting';
import { toast } from 'sonner';
import type { Convoy } from '@/types';

/**
 * Parse issue IDs from textarea input
 * Supports comma-separated, newline-separated, or space-separated formats
 */
function parseIssueIds(input: string): string[] {
  if (!input.trim()) return [];
  
  // Split by comma, newline, or space, then clean up
  return input
    .split(/[,\n\s]+/)
    .map(id => id.trim())
    .filter(id => id.length > 0);
}

export default function ConvoysPage() {
  const [convoys, setConvoys] = useState<Convoy[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  
  // Dialog states
  const [newConvoyOpen, setNewConvoyOpen] = useState(false);
  const [addTasksOpen, setAddTasksOpen] = useState(false);
  const [selectedConvoy, setSelectedConvoy] = useState<Convoy | null>(null);
  
  // Form states for New Convoy
  const [newConvoyName, setNewConvoyName] = useState('');
  const [newConvoyIssues, setNewConvoyIssues] = useState('');
  const [newConvoyNotify, setNewConvoyNotify] = useState('');
  const [newConvoySubmitting, setNewConvoySubmitting] = useState(false);
  
  // Form states for Add Tasks
  const [addTasksIssues, setAddTasksIssues] = useState('');
  const [addTasksSubmitting, setAddTasksSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getConvoys(
        filter === 'all' ? {} : { status: 'active' }
      );
      setConvoys(data);
    } catch (error) {
      console.error('Failed to load convoys:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateConvoy = async () => {
    const issues = parseIssueIds(newConvoyIssues);
    
    if (!newConvoyName.trim()) {
      toast.error('Convoy name is required');
      return;
    }
    
    try {
      setNewConvoySubmitting(true);
      await api.createConvoy(
        newConvoyName.trim(),
        issues,
        newConvoyNotify.trim() || undefined
      );
      
      toast.success(`Convoy "${newConvoyName}" created successfully`);
      setNewConvoyOpen(false);
      setNewConvoyName('');
      setNewConvoyIssues('');
      setNewConvoyNotify('');
      await loadData();
    } catch (error: any) {
      console.error('Failed to create convoy:', error);
      toast.error(error.message || 'Failed to create convoy');
    } finally {
      setNewConvoySubmitting(false);
    }
  };

  const handleAddTasks = async () => {
    if (!selectedConvoy) return;
    
    const issues = parseIssueIds(addTasksIssues);
    
    if (issues.length === 0) {
      toast.error('At least one issue ID is required');
      return;
    }
    
    try {
      setAddTasksSubmitting(true);
      await api.addIssuesToConvoy(selectedConvoy.id, issues);
      
      toast.success(`Added ${issues.length} issue(s) to convoy "${selectedConvoy.name}"`);
      setAddTasksOpen(false);
      setAddTasksIssues('');
      setSelectedConvoy(null);
      await loadData();
    } catch (error: any) {
      console.error('Failed to add issues to convoy:', error);
      toast.error(error.message || 'Failed to add issues to convoy');
    } finally {
      setAddTasksSubmitting(false);
    }
  };

  const openAddTasksDialog = (convoy: Convoy) => {
    setSelectedConvoy(convoy);
    setAddTasksIssues('');
    setAddTasksOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Convoys</h1>
            <p className="text-muted-foreground">
              Track groups of related work items
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setNewConvoyOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Convoy
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === 'active' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All History
          </Button>
        </div>

        {/* Convoy List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        ) : convoys.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No convoys found. Create one to get started.
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {convoys.map((convoy) => (
              <Card key={convoy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{convoy.name}</CardTitle>
                      <div className="text-sm text-muted-foreground mt-1">
                        Created {formatRelativeTime(convoy.created)}
                      </div>
                    </div>
                    <Badge variant={convoy.status === 'active' ? 'default' : 'secondary'}>
                      {convoy.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {convoy.issues.length} tracked issues
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAddTasksDialog(convoy)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Tasks
                    </Button>
                  </div>
                  {convoy.progress && (
                    <div className="mt-2">
                      <div className="text-sm mb-1">
                        {convoy.progress.completed} / {convoy.progress.total} completed
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{
                            width: `${(convoy.progress.completed / convoy.progress.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* New Convoy Dialog */}
        <Dialog open={newConvoyOpen} onOpenChange={setNewConvoyOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Convoy</DialogTitle>
              <DialogDescription>
                Create a new convoy to track related work items. You can add issues now or later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="convoy-name">Convoy Name *</Label>
                <Input
                  id="convoy-name"
                  placeholder="e.g., Q4 Feature Release"
                  value={newConvoyName}
                  onChange={(e) => setNewConvoyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convoy-issues">Issue IDs (optional)</Label>
                <Textarea
                  id="convoy-issues"
                  placeholder="gt-issue-1, gt-issue-2, gt-issue-3&#10;or one per line"
                  value={newConvoyIssues}
                  onChange={(e) => setNewConvoyIssues(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Enter issue IDs separated by commas, spaces, or newlines
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="convoy-notify">Notify Email (optional)</Label>
                <Input
                  id="convoy-notify"
                  type="email"
                  placeholder="email@example.com"
                  value={newConvoyNotify}
                  onChange={(e) => setNewConvoyNotify(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewConvoyOpen(false)}
                disabled={newConvoySubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateConvoy}
                disabled={newConvoySubmitting || !newConvoyName.trim()}
              >
                {newConvoySubmitting ? 'Creating...' : 'Create Convoy'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Tasks Dialog */}
        <Dialog open={addTasksOpen} onOpenChange={setAddTasksOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Tasks to Convoy</DialogTitle>
              <DialogDescription>
                Add issue IDs to "{selectedConvoy?.name}". The convoy will be reopened if it was closed.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-issues">Issue IDs *</Label>
                <Textarea
                  id="add-issues"
                  placeholder="gt-issue-1, gt-issue-2, gt-issue-3&#10;or one per line"
                  value={addTasksIssues}
                  onChange={(e) => setAddTasksIssues(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground">
                  Enter issue IDs separated by commas, spaces, or newlines
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setAddTasksOpen(false)}
                disabled={addTasksSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddTasks}
                disabled={addTasksSubmitting || !addTasksIssues.trim()}
              >
                {addTasksSubmitting ? 'Adding...' : 'Add Tasks'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}

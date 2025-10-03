'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

type User = {
  id: number;
  name: string | null;
  email: string;
};

type IssueFiltersProps = {
  users: User[];
};

export function IssueFilters({ users }: IssueFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentSearch = searchParams.get('search') || '';
  const currentStatus = searchParams.get('status') || 'all';
  const currentPriority = searchParams.get('priority') || 'all';
  const currentAssignee = searchParams.get('assignee') || 'all';

  const hasActiveFilters = currentSearch || currentStatus !== 'all' || currentPriority !== 'all' || currentAssignee !== 'all';

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value === 'all' || value === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/issues?${params.toString()}`);
  }

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('status');
    params.delete('priority');
    params.delete('assignee');
    router.push(`/issues?${params.toString()}`);
  }

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    router.push(`/issues?${params.toString()}`);
  }

  function getFilterLabel(type: string, value: string): string {
    switch (type) {
      case 'status':
        return value.replace('_', ' ');
      case 'priority':
        return value.charAt(0) + value.slice(1).toLowerCase();
      case 'assignee':
        if (value === 'unassigned') return 'Unassigned';
        const user = users.find(u => u.id.toString() === value);
        return user ? (user.name || user.email) : value;
      default:
        return value;
    }
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={hasActiveFilters ? 'default' : 'outline'}
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && <span className="ml-2 bg-background/20 px-1.5 py-0.5 rounded text-xs">{
            [currentSearch, currentStatus !== 'all', currentPriority !== 'all', currentAssignee !== 'all'].filter(Boolean).length
          }</span>}
        </Button>

        {currentSearch && (
          <Badge variant="secondary" className="gap-1 pl-2 pr-1">
            Search: {currentSearch}
            <button
              type="button"
              className="ml-1 hover:bg-background/20 rounded-sm p-0.5"
              onClick={() => removeFilter('search')}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {currentStatus !== 'all' && (
          <Badge variant="secondary" className="gap-1 pl-2 pr-1">
            Status: {getFilterLabel('status', currentStatus)}
            <button
              type="button"
              className="ml-1 hover:bg-background/20 rounded-sm p-0.5"
              onClick={() => removeFilter('status')}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {currentPriority !== 'all' && (
          <Badge variant="secondary" className="gap-1 pl-2 pr-1">
            Priority: {getFilterLabel('priority', currentPriority)}
            <button
              type="button"
              className="ml-1 hover:bg-background/20 rounded-sm p-0.5"
              onClick={() => removeFilter('priority')}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {currentAssignee !== 'all' && (
          <Badge variant="secondary" className="gap-1 pl-2 pr-1">
            Assignee: {getFilterLabel('assignee', currentAssignee)}
            <button
              type="button"
              className="ml-1 hover:bg-background/20 rounded-sm p-0.5"
              onClick={() => removeFilter('assignee')}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="mt-4 rounded-lg border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by title..."
                defaultValue={currentSearch}
                onChange={(e) => {
                  const value = e.target.value;
                  // Debounce search
                  setTimeout(() => updateFilter('search', value), 300);
                }}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={currentStatus} onValueChange={(value) => updateFilter('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={currentPriority} onValueChange={(value) => updateFilter('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee</Label>
              <Select value={currentAssignee} onValueChange={(value) => updateFilter('assignee', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'CLOSED', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

export function IssueFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get('status');
  const priority = searchParams.get('priority');

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/issues?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/issues');
  };

  const hasFilters = status || priority;

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Status:</span>
          {STATUS_OPTIONS.map(option => (
            <Button
              key={option.value}
              variant={status === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('status', status === option.value ? null : option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Priority:</span>
          {PRIORITY_OPTIONS.map(option => (
            <Button
              key={option.value}
              variant={priority === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateFilter('priority', priority === option.value ? null : option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {status && (
            <Badge variant="secondary" className="gap-1">
              Status: {STATUS_OPTIONS.find(o => o.value === status)?.label}
              <button onClick={() => updateFilter('status', null)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {priority && (
            <Badge variant="secondary" className="gap-1">
              Priority: {PRIORITY_OPTIONS.find(o => o.value === priority)?.label}
              <button onClick={() => updateFilter('priority', null)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}

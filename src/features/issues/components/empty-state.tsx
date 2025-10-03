import { Button } from '@/components/ui/button';
import { FileQuestion, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  hasFilters?: boolean;
}

export function EmptyState({ hasFilters = false }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No issues found</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          No tasks found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Plus className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No issues yet</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        Get started by creating your first issue to track bugs, features, and tasks.
      </p>
      <Button asChild className="mt-6">
        <Link href="/issues/new">
          <Plus className="mr-2 h-4 w-4" />
          Create Issue
        </Link>
      </Button>
    </div>
  );
}

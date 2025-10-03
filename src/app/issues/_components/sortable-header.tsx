'use client';

import { TableHead } from '@/components/ui/table';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type SortableHeaderProps = {
  column: string;
  label: string;
  className?: string;
};

export function SortableHeader({ column, label, className }: SortableHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortBy');
  const currentOrder = searchParams.get('order') || 'asc';

  const isSorted = currentSort === column;
  const isAsc = isSorted && currentOrder === 'asc';
  const isDesc = isSorted && currentOrder === 'desc';

  function handleSort() {
    const params = new URLSearchParams(searchParams.toString());

    if (isSorted) {
      // Toggle order if same column
      if (isAsc) {
        params.set('order', 'desc');
      } else {
        // Remove sorting if clicking desc again
        params.delete('sortBy');
        params.delete('order');
      }
    } else {
      // New column, start with asc
      params.set('sortBy', column);
      params.set('order', 'asc');
    }

    router.push(`/issues?${params.toString()}`);
  }

  return (
    <TableHead
      className={`font-semibold text-foreground cursor-pointer select-none hover:bg-primary/10 transition-colors ${className || ''}`}
      onClick={handleSort}
    >
      <div className="flex items-center gap-2">
        {label}
        {!isSorted && <ArrowUpDown className="h-4 w-4 text-muted-foreground" />}
        {isAsc && <ArrowUp className="h-4 w-4" />}
        {isDesc && <ArrowDown className="h-4 w-4" />}
      </div>
    </TableHead>
  );
}

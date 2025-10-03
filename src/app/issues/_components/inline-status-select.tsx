'use client';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateIssueStatus } from '../actions';

type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

type InlineStatusSelectProps = {
  issueId: number;
  currentStatus: Status;
};

const statusColors = {
  OPEN: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  CLOSED: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
};

export function InlineStatusSelect({ issueId, currentStatus }: InlineStatusSelectProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleStatusChange(newStatus: string) {
    setIsUpdating(true);

    try {
      await updateIssueStatus(issueId, newStatus as Status);
      router.refresh();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="w-[140px] h-auto border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue asChild>
          <Badge className={statusColors[currentStatus]} variant="secondary">
            {currentStatus.replace('_', ' ')}
          </Badge>
        </SelectValue>
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        <SelectItem value="OPEN">Open</SelectItem>
        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
        <SelectItem value="CLOSED">Closed</SelectItem>
      </SelectContent>
    </Select>
  );
}

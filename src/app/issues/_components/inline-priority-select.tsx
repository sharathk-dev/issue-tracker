'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronDown, ChevronsLeftRight, ChevronsUp, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateIssuePriority } from '../actions';

type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

type InlinePrioritySelectProps = {
  issueId: number;
  currentPriority: Priority;
};

const priorityConfig = {
  LOW: { icon: ChevronDown, color: 'text-gray-500', label: 'Low' },
  MEDIUM: { icon: ChevronsLeftRight, color: 'text-blue-500', label: 'Medium' },
  HIGH: { icon: ChevronUp, color: 'text-orange-500', label: 'High' },
  URGENT: { icon: ChevronsUp, color: 'text-red-500', label: 'Urgent' },
};

export function InlinePrioritySelect({ issueId, currentPriority }: InlinePrioritySelectProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handlePriorityChange(newPriority: string) {
    setIsUpdating(true);

    try {
      await updateIssuePriority(issueId, newPriority as Priority);
      router.refresh();
    } catch (error) {
      console.error('Failed to update priority:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  const CurrentIcon = priorityConfig[currentPriority].icon;
  const currentColor = priorityConfig[currentPriority].color;

  return (
    <Select
      value={currentPriority}
      onValueChange={handlePriorityChange}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="w-[40px] h-auto border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue asChild>
          <CurrentIcon className={`h-5 w-5 ${currentColor}`} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        {Object.entries(priorityConfig).map(([value, { icon: Icon, color, label }]) => (
          <SelectItem key={value} value={value}>
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${color}`} />
              <span>{label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

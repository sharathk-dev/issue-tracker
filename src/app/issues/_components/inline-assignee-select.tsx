'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { updateIssueAssignee } from '../actions';

type User = {
  id: number;
  name: string | null;
  email: string;
  image: string | null;
};

type InlineAssigneeSelectProps = {
  issueId: number;
  currentAssignee: User | null;
  users: User[];
};

export function InlineAssigneeSelect({ issueId, currentAssignee, users }: InlineAssigneeSelectProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleAssigneeChange(value: string) {
    setIsUpdating(true);

    try {
      const assigneeId = value === 'unassigned' ? null : parseInt(value);
      await updateIssueAssignee(issueId, assigneeId);
      router.refresh();
    } catch (error) {
      console.error('Failed to update assignee:', error);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Select
      value={currentAssignee?.id.toString() || 'unassigned'}
      onValueChange={handleAssigneeChange}
      disabled={isUpdating}
    >
      <SelectTrigger
        className="w-auto h-auto border-0 bg-transparent p-0 hover:bg-transparent focus:ring-0"
        onClick={(e) => e.stopPropagation()}
      >
        <SelectValue asChild>
          {currentAssignee ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentAssignee.image || undefined} />
                <AvatarFallback className="text-xs">
                  {currentAssignee.name?.[0] || currentAssignee.email[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">
                {currentAssignee.name || currentAssignee.email}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground italic">Unassigned</span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent onClick={(e) => e.stopPropagation()}>
        <SelectItem value="unassigned">
          <span className="italic">Unassigned</span>
        </SelectItem>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={user.image || undefined} />
                <AvatarFallback className="text-xs">
                  {user.name?.[0] || user.email[0]}
                </AvatarFallback>
              </Avatar>
              <span>{user.name || user.email}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

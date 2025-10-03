'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteIssue } from '../[id]/actions';
import { cloneIssue } from '../[id]/clone/actions';

type IssueActionsMenuProps = {
  issueId: number;
  issueTitle: string;
};

export function IssueActionsMenu({ issueId, issueTitle }: IssueActionsMenuProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);

    try {
      const result = await deleteIssue(issueId);

      if (result.success) {
        setIsDeleteDialogOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete issue:', error);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleClone() {
    setIsCloning(true);

    try {
      const result = await cloneIssue(issueId);

      if (result.success && result.issueId) {
        router.push(`/issues/${result.issueId}/edit`);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to clone issue:', error);
    } finally {
      setIsCloning(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isCloning}>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/issues/${issueId}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleClone();
            }}
            disabled={isCloning}
          >
            <Copy className="h-4 w-4 mr-2" />
            {isCloning ? 'Cloning...' : 'Clone'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the issue <strong>&quot;{issueTitle}&quot;</strong> and all of its
              comments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Issue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

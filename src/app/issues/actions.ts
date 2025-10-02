'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateIssueStatus(issueId: number, status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED') {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: { status },
    });

    revalidatePath('/issues');
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issueId}`);

    return { success: true };
  } catch (_error) {
    return { error: 'Failed to update status' };
  }
}

export async function updateIssuePriority(issueId: number, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: { priority },
    });

    revalidatePath('/issues');
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issueId}`);

    return { success: true };
  } catch (_error) {
    return { error: 'Failed to update priority' };
  }
}

export async function updateIssueAssignee(issueId: number, assigneeId: number | null) {
  try {
    await prisma.issue.update({
      where: { id: issueId },
      data: { assigneeId },
    });

    revalidatePath('/issues');
    revalidatePath('/dashboard');
    revalidatePath(`/issues/${issueId}`);

    return { success: true };
  } catch (_error) {
    return { error: 'Failed to update assignee' };
  }
}

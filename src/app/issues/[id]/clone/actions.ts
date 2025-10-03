'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function cloneIssue(issueId: number) {
  try {
    const originalIssue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!originalIssue) {
      return { error: 'Issue not found' };
    }

    const clonedIssue = await prisma.issue.create({
      data: {
        title: `${originalIssue.title} (Copy)`,
        description: originalIssue.description,
        status: originalIssue.status,
        priority: originalIssue.priority,
        authorId: originalIssue.authorId,
        assigneeId: originalIssue.assigneeId,
      },
    });

    revalidatePath('/issues');
    revalidatePath('/dashboard');

    return { success: true, issueId: clonedIssue.id };
  } catch (_error) {
    return { error: 'Failed to clone issue' };
  }
}

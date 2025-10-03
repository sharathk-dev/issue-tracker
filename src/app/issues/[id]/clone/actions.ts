'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function cloneIssue(issueId: number) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'You must be signed in to clone issues' };
    }

    const originalIssue = await prisma.issue.findUnique({
      where: { id: issueId },
    });

    if (!originalIssue) {
      return { error: 'Issue not found' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    const clonedIssue = await prisma.issue.create({
      data: {
        title: `${originalIssue.title} (Copy)`,
        description: originalIssue.description,
        status: originalIssue.status,
        priority: originalIssue.priority,
        authorId: user.id,
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

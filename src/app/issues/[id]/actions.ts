'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteIssue(issueId: number) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'You must be signed in to delete issues' };
    }

    await prisma.issue.delete({
      where: { id: issueId },
    });

    revalidatePath('/issues');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (_error) {
    return { error: 'Failed to delete issue' };
  }
}

export async function addComment(issueId: number, content: string) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'You must be signed in to comment' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    await prisma.comment.create({
      data: {
        content,
        issueId,
        authorId: user.id,
      },
    });

    revalidatePath(`/issues/${issueId}`);

    return { success: true };
  } catch (_error) {
    return { error: 'Failed to add comment' };
  }
}

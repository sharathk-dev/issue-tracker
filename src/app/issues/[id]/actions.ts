'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteIssue(issueId: number) {
  try {
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
    // For now, use the first user as the author
    // In a real app, this would come from the authenticated session
    const firstUser = await prisma.user.findFirst();

    if (!firstUser) {
      return { error: 'No user found' };
    }

    await prisma.comment.create({
      data: {
        content,
        issueId,
        authorId: firstUser.id,
      },
    });

    revalidatePath(`/issues/${issueId}`);

    return { success: true };
  } catch (_error) {
    return { error: 'Failed to add comment' };
  }
}

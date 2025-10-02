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
  } catch (error) {
    return { error: 'Failed to delete issue' };
  }
}

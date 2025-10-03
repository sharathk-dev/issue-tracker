'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const createIssueSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'CLOSED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  assigneeId: z.coerce.number().optional(),
});

export async function createIssue(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return { error: 'You must be signed in to create issues' };
    }

    const assigneeIdValue = formData.get('assigneeId');

    const data = {
      title: formData.get('title'),
      description: formData.get('description') || undefined,
      status: formData.get('status'),
      priority: formData.get('priority'),
      assigneeId: assigneeIdValue && assigneeIdValue !== 'unassigned' ? assigneeIdValue : undefined,
    };

    const validated = createIssueSchema.parse(data);

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return { error: 'User not found' };
    }

    await prisma.issue.create({
      data: {
        title: validated.title,
        description: validated.description,
        status: validated.status,
        priority: validated.priority,
        authorId: user.id,
        assigneeId: validated.assigneeId,
      },
    });

    revalidatePath('/issues');

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }

    return { error: 'Failed to create issue' };
  }
}

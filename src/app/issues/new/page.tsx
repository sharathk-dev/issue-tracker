import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { NewIssueForm } from './form';

export default async function NewIssuePage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/issues/new');
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
  return <NewIssueForm users={users} />;
}

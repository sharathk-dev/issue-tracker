import { prisma } from '@/lib/db';
import { NewIssueForm } from './form';

export default async function NewIssuePage() {
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

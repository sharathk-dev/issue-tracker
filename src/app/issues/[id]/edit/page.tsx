import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { IssueForm } from '../../_components/issue-form';
import { updateIssue } from './actions';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditIssuePage({ params }: PageProps) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  const { id } = await params;
  const issueId = parseInt(id);

  if (isNaN(issueId)) {
    notFound();
  }

  const [issue, users] = await Promise.all([
    prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        assigneeId: true,
      },
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  if (!issue) {
    notFound();
  }

  return <IssueForm users={users} issue={issue} onSubmit={updateIssue.bind(null, issueId)} />;
}

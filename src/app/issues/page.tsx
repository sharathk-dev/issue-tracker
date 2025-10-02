import { prisma } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsLeftRight, Plus } from 'lucide-react';
import { IssueActionsMenu } from './_components/issue-actions-menu';
import { InlineStatusSelect } from './_components/inline-status-select';
import { InlinePrioritySelect } from './_components/inline-priority-select';
import { InlineAssigneeSelect } from './_components/inline-assignee-select';
import { SortableHeader } from './_components/sortable-header';
import { IssueFilters } from './_components/issue-filters';

const statusColors = {
  OPEN: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  CLOSED: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
};

const priorityIcons = {
  LOW: { icon: ChevronDown, color: 'text-gray-500', className: 'h-5 w-5' },
  MEDIUM: { icon: ChevronsLeftRight, color: 'text-blue-500', className: 'h-5 w-5' },
  HIGH: { icon: ChevronUp, color: 'text-orange-500', className: 'h-5 w-5' },
  URGENT: { icon: ChevronsUp, color: 'text-red-500', className: 'h-5 w-5' },
};

type IssuesPageProps = {
  searchParams: Promise<{
    sortBy?: string;
    order?: string;
    search?: string;
    status?: string;
    priority?: string;
    assignee?: string;
  }>;
};

export default async function IssuesPage({ searchParams }: IssuesPageProps) {
  const { sortBy, order, search, status, priority, assignee } = await searchParams;

  // Build orderBy clause based on sort params
  let orderBy: any = { createdAt: 'desc' }; // default

  if (sortBy) {
    const orderDirection = order === 'desc' ? 'desc' : 'asc';

    switch (sortBy) {
      case 'title':
        orderBy = { title: orderDirection };
        break;
      case 'status':
        orderBy = { status: orderDirection };
        break;
      case 'priority':
        orderBy = { priority: orderDirection };
        break;
      case 'createdAt':
        orderBy = { createdAt: orderDirection };
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
  }

  // Build where clause based on filters
  const where: any = {};

  if (search) {
    where.title = {
      contains: search,
    };
  }

  if (status && status !== 'all') {
    where.status = status;
  }

  if (priority && priority !== 'all') {
    where.priority = priority;
  }

  if (assignee && assignee !== 'all') {
    if (assignee === 'unassigned') {
      where.assigneeId = null;
    } else {
      where.assigneeId = parseInt(assignee);
    }
  }

  const [issues, users] = await Promise.all([
    prisma.issue.findMany({
      where,
      include: {
        author: true,
        assignee: true,
      },
      orderBy,
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Issues</h1>
          <p className="text-muted-foreground mt-2">View and manage all issues</p>
        </div>
        <Button asChild>
          <Link href="/issues/new">
            <Plus className="h-4 w-4 mr-2" />
            New Issue
          </Link>
        </Button>
      </div>

      <IssueFilters users={users} />

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {issues.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No issues found</div>
        ) : (
          issues.map(issue => {
            const { icon: Icon, color } = priorityIcons[issue.priority];
            return (
              <Link
                key={issue.id}
                href={`/issues/${issue.id}`}
                className="block rounded-lg border bg-card p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {issue.assignee ? (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={issue.assignee.image || undefined} />
                      <AvatarFallback>{issue.assignee.name?.[0] || issue.assignee.email[0]}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                      ?
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium break-words mb-1">{issue.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className={statusColors[issue.status]} variant="secondary">
                        {issue.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-4 w-4 ${color} flex-shrink-0 mt-1`} />
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5 border-b-2 border-primary/20">
              <SortableHeader column="title" label="Title" />
              <SortableHeader column="status" label="Status" />
              <SortableHeader column="priority" label="Priority" />
              <TableHead className="font-semibold text-foreground">Assigned To</TableHead>
              <SortableHeader column="createdAt" label="Created" />
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No issues found
                </TableCell>
              </TableRow>
            ) : (
              issues.map(issue => (
                  <TableRow key={issue.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <Link
                        href={`/issues/${issue.id}`}
                        className="hover:text-primary hover:underline decoration-dotted underline-offset-4"
                      >
                        {issue.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <InlineStatusSelect issueId={issue.id} currentStatus={issue.status} />
                    </TableCell>
                    <TableCell>
                      <InlinePrioritySelect issueId={issue.id} currentPriority={issue.priority} />
                    </TableCell>
                    <TableCell>
                      <InlineAssigneeSelect
                        issueId={issue.id}
                        currentAssignee={issue.assignee}
                        users={users}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <IssueActionsMenu issueId={issue.id} issueTitle={issue.title} />
                    </TableCell>
                  </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

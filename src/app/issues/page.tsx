import { prisma } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, ChevronsUp, Minus } from 'lucide-react';

const statusColors = {
  OPEN: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  CLOSED: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
};

const priorityIcons = {
  LOW: { icon: ChevronDown, color: 'text-gray-500' },
  MEDIUM: { icon: Minus, color: 'text-blue-500' },
  HIGH: { icon: ChevronUp, color: 'text-orange-500' },
  URGENT: { icon: ChevronsUp, color: 'text-red-500' },
};

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({
    include: {
      author: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Issues</h1>
        <p className="text-muted-foreground mt-2">View and manage all issues</p>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-primary/5 hover:bg-primary/5 border-b-2 border-primary/20">
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Priority</TableHead>
              <TableHead className="font-semibold text-foreground">Author</TableHead>
              <TableHead className="font-semibold text-foreground">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
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
                    <Badge className={statusColors[issue.status]} variant="secondary">
                      {issue.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const { icon: Icon, color } = priorityIcons[issue.priority];
                      return <Icon className={`h-5 w-5 ${color}`} />;
                    })()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {issue.author.name || issue.author.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
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

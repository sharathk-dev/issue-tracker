import { prisma } from '@/lib/db';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsLeftRight } from 'lucide-react';

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

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({
    include: {
      author: true,
      assignee: true,
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {issues.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No issues found</div>
        ) : (
          issues.map(issue => {
            const { icon: Icon, color, className } = priorityIcons[issue.priority];
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
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium break-words">{issue.title}</h3>
                      <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge className={statusColors[issue.status]} variant="secondary">
                        {issue.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-muted-foreground">
                        {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
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
              <TableHead className="font-semibold text-foreground">Title</TableHead>
              <TableHead className="font-semibold text-foreground">Status</TableHead>
              <TableHead className="font-semibold text-foreground">Priority</TableHead>
              <TableHead className="font-semibold text-foreground">Assigned To</TableHead>
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
              issues.map(issue => {
                const { icon: Icon, color, className } = priorityIcons[issue.priority];
                return (
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
                      <Icon className={`${className} ${color}`} />
                    </TableCell>
                    <TableCell>
                      {issue.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={issue.assignee.image || undefined} />
                            <AvatarFallback className="text-xs">
                              {issue.assignee.name?.[0] || issue.assignee.email[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-muted-foreground">
                            {issue.assignee.name || issue.assignee.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

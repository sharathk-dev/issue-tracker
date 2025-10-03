import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronsLeftRight, ChevronsUp, ChevronUp, Clock, FolderOpen } from 'lucide-react';
import Link from 'next/link';

const statusColors = {
  OPEN: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  CLOSED: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
};

const priorityIcons = {
  LOW: { icon: ChevronDown, color: 'text-gray-500' },
  MEDIUM: { icon: ChevronsLeftRight, color: 'text-blue-500' },
  HIGH: { icon: ChevronUp, color: 'text-orange-500' },
  URGENT: { icon: ChevronsUp, color: 'text-red-500' },
};

export default async function DashboardPage() {
  const [stats, recentIssues] = await Promise.all([
    prisma.issue.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.issue.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        assignee: true,
      },
    }),
  ]);

  const totalIssues = await prisma.issue.count();
  const openCount = stats.find(s => s.status === 'OPEN')?._count || 0;
  const inProgressCount = stats.find(s => s.status === 'IN_PROGRESS')?._count || 0;
  const closedCount = stats.find(s => s.status === 'CLOSED')?._count || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Overview of all issues and activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalIssues}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{openCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalIssues > 0 ? `${Math.round((openCount / totalIssues) * 100)}% of total` : 'No issues'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalIssues > 0 ? `${Math.round((inProgressCount / totalIssues) * 100)}% of total` : 'No issues'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{closedCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalIssues > 0 ? `${Math.round((closedCount / totalIssues) * 100)}% of total` : 'No issues'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Issues</CardTitle>
            <Link href="/issues" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentIssues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No issues found</p>
          ) : (
            <div className="space-y-4">
              {recentIssues.map(issue => {
                const { icon: PriorityIcon, color } = priorityIcons[issue.priority];
                return (
                  <Link
                    key={issue.id}
                    href={`/issues/${issue.id}`}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {issue.assignee ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={issue.assignee.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {issue.assignee.name?.[0] || issue.assignee.email[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        ?
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{issue.title}</h3>
                        <PriorityIcon className={`h-4 w-4 ${color} flex-shrink-0`} />
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={statusColors[issue.status]} variant="secondary">
                          {issue.status.replace('_', ' ')}
                        </Badge>
                        <span>#{issue.id}</span>
                        <span>·</span>
                        <span>{formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

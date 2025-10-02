import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown, ChevronsUp, ChevronsLeftRight, ArrowLeft, Pencil } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { DeleteIssueButton } from './_components/delete-issue-button';

const statusColors = {
  OPEN: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
  CLOSED: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
};

const priorityConfig = {
  LOW: { icon: ChevronDown, color: 'text-gray-500', label: 'Low' },
  MEDIUM: { icon: ChevronsLeftRight, color: 'text-blue-500', label: 'Medium' },
  HIGH: { icon: ChevronUp, color: 'text-orange-500', label: 'High' },
  URGENT: { icon: ChevronsUp, color: 'text-red-500', label: 'Urgent' },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IssueDetailPage({ params }: PageProps) {
  const { id } = await params;
  const issueId = parseInt(id);

  if (isNaN(issueId)) {
    notFound();
  }

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      author: true,
      assignee: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!issue) {
    notFound();
  }

  const PriorityIcon = priorityConfig[issue.priority].icon;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header with Back Button and Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/issues">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Issues
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/issues/${issue.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <DeleteIssueButton issueId={issue.id} issueTitle={issue.title} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-2xl mb-2">{issue.title}</CardTitle>
                  <CardDescription>
                    #{issue.id} · Created {formatDistanceToNow(new Date(issue.createdAt), { addSuffix: true })} by{' '}
                    {issue.author.name || issue.author.email}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[issue.status]} variant="secondary">
                    {issue.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            {issue.description && (
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">{issue.description}</p>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({issue.comments.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {issue.comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {issue.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.image || undefined} />
                        <AvatarFallback className="text-xs">
                          {comment.author.name?.[0] || comment.author.email[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.author.name || comment.author.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Priority */}
              <div>
                <p className="text-sm font-medium mb-2">Priority</p>
                <div className="flex items-center gap-2">
                  <PriorityIcon className={`h-4 w-4 ${priorityConfig[issue.priority].color}`} />
                  <span className="text-sm text-muted-foreground">{priorityConfig[issue.priority].label}</span>
                </div>
              </div>

              <Separator />

              {/* Assignee */}
              <div>
                <p className="text-sm font-medium mb-2">Assigned To</p>
                {issue.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={issue.assignee.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {issue.assignee.name?.[0] || issue.assignee.email[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {issue.assignee.name || issue.assignee.email}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground italic">Unassigned</span>
                )}
              </div>

              <Separator />

              {/* Created By */}
              <div>
                <p className="text-sm font-medium mb-2">Created By</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={issue.author.image || undefined} />
                    <AvatarFallback className="text-xs">
                      {issue.author.name?.[0] || issue.author.email[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    {issue.author.name || issue.author.email}
                  </span>
                </div>
              </div>

              <Separator />

              {/* Timestamps */}
              <div>
                <p className="text-sm font-medium mb-2">Created</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(issue.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {issue.updatedAt.getTime() !== issue.createdAt.getTime() && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(issue.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

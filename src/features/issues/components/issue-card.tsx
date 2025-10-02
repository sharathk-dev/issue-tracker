import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare } from 'lucide-react';
import type { Issue, User, Comment } from '@prisma/client';

interface IssueCardProps {
  issue: Issue & {
    author: User;
    comments: Comment[];
  };
}

export function IssueCard({ issue }: IssueCardProps) {
  const statusVariant = {
    OPEN: 'default',
    IN_PROGRESS: 'secondary',
    CLOSED: 'outline',
  } as const;

  const priorityColor = {
    LOW: 'text-blue-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    URGENT: 'text-red-600',
  } as const;

  return (
    <Link href={`/issues/${issue.id}`}>
      <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Issue Number & Avatar */}
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground font-mono text-sm">#{issue.id}</span>
            <Avatar className="h-8 w-8">
              <AvatarImage src={issue.author.image || undefined} />
              <AvatarFallback>{issue.author.name?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="font-semibold text-base mb-1 truncate">{issue.title}</h3>

            {/* Description Preview */}
            {issue.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{issue.description}</p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span>{issue.author.name}</span>
              <span>•</span>
              <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
              {issue.comments.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {issue.comments.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={statusVariant[issue.status]}>{issue.status.replace('_', ' ')}</Badge>
            <Badge variant="outline" className={priorityColor[issue.priority]}>
              {issue.priority}
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}

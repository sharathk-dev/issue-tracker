'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { addComment } from '../actions';

type CommentFormProps = {
  issueId: number;
};

export function CommentForm({ issueId }: CommentFormProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await addComment(issueId, content.trim());

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setContent('');
        router.refresh();
      }
    } catch (_err) {
      setError('Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <Textarea
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        disabled={isSubmitting}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? 'Adding...' : 'Add Comment'}
        </Button>
      </div>
    </form>
  );
}

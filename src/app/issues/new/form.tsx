import { IssueForm } from '../_components/issue-form';
import { createIssue } from './actions';

type User = {
  id: number;
  name: string | null;
  email: string;
};

type NewIssueFormProps = {
  users: User[];
};

export function NewIssueForm({ users }: NewIssueFormProps) {
  return <IssueForm users={users} onSubmit={createIssue} />;
}

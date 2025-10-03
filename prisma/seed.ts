import { PrismaClient, IssueStatus, IssuePriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clean existing data (in order due to foreign keys)
  await prisma.comment.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create users
  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      name: 'Alice Johnson',
      image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Bob',
    },
  });

  const charlie = await prisma.user.create({
    data: {
      email: 'charlie@example.com',
      name: 'Charlie Davis',
      image: 'https://api.dicebear.com/9.x/thumbs/svg?seed=Charlie',
    },
  });

  console.log('Created users');

  // Create issues
  const issues = await prisma.issue.createMany({
    data: [
    {
      title: 'Fix login button not responding on mobile',
      description: 'Users report that the login button does not respond to taps on iOS Safari. Works fine on desktop browsers.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.HIGH,
      authorId: alice.id,
      assigneeId: bob.id,
    },
    {
      title: 'Add dark mode support',
      description: 'Implement a dark mode theme for better user experience in low-light environments.',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
      assigneeId: charlie.id,
    },
    {
      title: 'Database query optimization needed',
      description: 'The issues list page is loading slowly with 1000+ issues. Need to add pagination and optimize queries.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.URGENT,
      authorId: charlie.id,
      assigneeId: alice.id,
    },
    {
      title: 'Update documentation for API endpoints',
      description: 'API documentation is outdated. Need to document the new comment endpoints.',
      status: IssueStatus.CLOSED,
      priority: IssuePriority.LOW,
      authorId: alice.id,
    },
    {
      title: 'Implement email notifications',
      description: 'Send email notifications when issues are assigned or commented on.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
    },
    {
      title: 'Fix responsive layout on tablet devices',
      description: 'The navigation menu overlaps with content on iPad Pro.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      authorId: alice.id,
      assigneeId: bob.id,
    },
    {
      title: 'Add file upload functionality',
      description: 'Users should be able to attach files to issues.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      authorId: bob.id,
    },
    {
      title: 'Implement search autocomplete',
      description: 'Add autocomplete suggestions when searching for issues.',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.MEDIUM,
      authorId: charlie.id,
      assigneeId: alice.id,
    },
    {
      title: 'Fix memory leak in dashboard',
      description: 'Dashboard page memory usage grows over time.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.URGENT,
      authorId: alice.id,
      assigneeId: charlie.id,
    },
    {
      title: 'Add export to CSV feature',
      description: 'Allow users to export issues list to CSV format.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      authorId: bob.id,
    },
    {
      title: 'Improve error messages',
      description: 'Error messages should be more user-friendly and actionable.',
      status: IssueStatus.CLOSED,
      priority: IssuePriority.MEDIUM,
      authorId: charlie.id,
      assigneeId: bob.id,
    },
    {
      title: 'Add bulk edit functionality',
      description: 'Allow users to edit multiple issues at once.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      authorId: alice.id,
    },
    {
      title: 'Implement user permissions system',
      description: 'Add role-based access control for different user types.',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.HIGH,
      authorId: bob.id,
      assigneeId: alice.id,
    },
    {
      title: 'Fix timezone display issues',
      description: 'Timestamps are showing in UTC instead of user timezone.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      authorId: charlie.id,
      assigneeId: bob.id,
    },
    {
      title: 'Add keyboard shortcuts',
      description: 'Implement keyboard shortcuts for common actions.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      authorId: alice.id,
    },
    {
      title: 'Optimize image loading',
      description: 'Images take too long to load. Implement lazy loading.',
      status: IssueStatus.CLOSED,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
      assigneeId: charlie.id,
    },
    {
      title: 'Add activity timeline',
      description: 'Show timeline of all changes made to an issue.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      authorId: charlie.id,
    },
    {
      title: 'Fix drag and drop priority ordering',
      description: 'Drag and drop to reorder issues by priority is broken.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.HIGH,
      authorId: alice.id,
      assigneeId: bob.id,
    },
    {
      title: 'Implement real-time updates',
      description: 'Use WebSockets to show real-time issue updates.',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
      assigneeId: alice.id,
    },
    {
      title: 'Add issue templates',
      description: 'Create templates for bug reports and feature requests.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      authorId: charlie.id,
    },
    {
      title: 'Fix CORS errors on API',
      description: 'Getting CORS errors when calling API from external domains.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.URGENT,
      authorId: alice.id,
      assigneeId: charlie.id,
    },
    {
      title: 'Add mention system in comments',
      description: 'Allow users to @mention other users in comments.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
    },
    {
      title: 'Improve mobile performance',
      description: 'App is laggy on older mobile devices.',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.HIGH,
      authorId: charlie.id,
      assigneeId: bob.id,
    },
    {
      title: 'Add issue dependencies',
      description: 'Allow marking issues as blocked by other issues.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.LOW,
      authorId: alice.id,
    },
    {
      title: 'Fix broken links in navigation',
      description: 'Some navigation links return 404 errors.',
      status: IssueStatus.CLOSED,
      priority: IssuePriority.HIGH,
      authorId: bob.id,
      assigneeId: alice.id,
    },
    ],
  });

  console.log('Created issues');

  // Get all issues to add comments
  const allIssues = await prisma.issue.findMany({
    orderBy: { createdAt: 'asc' },
  });

  // Create comments for various issues
  const comments: { content: string; issueId: number; authorId: number }[] = [];
  const commentTexts = [
    'I can reproduce this issue on my iPhone 14. Seems like a z-index problem with the overlay.',
    'Fixed in the latest commit. Testing now.',
    "I've implemented the basic dark mode toggle. Need to test all components.",
    'The dashboard looks great in dark mode! Just need to fix the chart colors.',
    'Added indexes on status and createdAt fields. Load time improved from 3s to 300ms!',
    'This is a great feature request. Will start working on it next sprint.',
    'Can we prioritize this? It is affecting production users.',
    'I have a PR ready for review.',
    'Tests are failing for this change. Need to investigate.',
    'Documentation has been updated.',
    'This works well on Chrome but breaks on Firefox.',
    'We should consider the mobile experience too.',
    'Added to the roadmap for Q2.',
    'Similar to issue #5, might be related.',
    'Performance improvement looks good!',
  ];

  // Add 1-3 random comments to each issue
  allIssues.forEach((issue, idx) => {
    const numComments = Math.floor(Math.random() * 3) + 1;
    const users = [alice.id, bob.id, charlie.id];

    for (let i = 0; i < numComments; i++) {
      comments.push({
        content: commentTexts[(idx * 3 + i) % commentTexts.length],
        issueId: issue.id,
        authorId: users[i % users.length],
      });
    }
  });

  await prisma.comment.createMany({
    data: comments,
  });

  console.log('Created comments');

  // Summary
  const counts = {
    users: await prisma.user.count(),
    issues: await prisma.issue.count(),
    comments: await prisma.comment.count(),
  };

  console.log('✅ Seed completed!');
  console.log(`   Users: ${counts.users}`);
  console.log(`   Issues: ${counts.issues}`);
  console.log(`   Comments: ${counts.comments}`);
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

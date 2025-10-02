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

  // Create issues with different statuses and priorities
  const issue1 = await prisma.issue.create({
    data: {
      title: 'Fix login button not responding on mobile',
      description:
        'Users report that the login button does not respond to taps on iOS Safari. Works fine on desktop browsers.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.HIGH,
      authorId: alice.id,
      assigneeId: bob.id,
    },
  });

  const issue2 = await prisma.issue.create({
    data: {
      title: 'Add dark mode support',
      description: 'Implement a dark mode theme for better user experience in low-light environments.',
      status: IssueStatus.IN_PROGRESS,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
      assigneeId: charlie.id,
    },
  });

  const issue3 = await prisma.issue.create({
    data: {
      title: 'Database query optimization needed',
      description:
        'The issues list page is loading slowly with 1000+ issues. Need to add pagination and optimize queries.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.URGENT,
      authorId: charlie.id,
      assigneeId: alice.id,
    },
  });

  const issue4 = await prisma.issue.create({
    data: {
      title: 'Update documentation for API endpoints',
      description: 'API documentation is outdated. Need to document the new comment endpoints.',
      status: IssueStatus.CLOSED,
      priority: IssuePriority.LOW,
      authorId: alice.id,
    },
  });

  const issue5 = await prisma.issue.create({
    data: {
      title: 'Implement email notifications',
      description: 'Send email notifications when issues are assigned or commented on.',
      status: IssueStatus.OPEN,
      priority: IssuePriority.MEDIUM,
      authorId: bob.id,
    },
  });

  console.log('Created issues');

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: 'I can reproduce this issue on my iPhone 14. Seems like a z-index problem with the overlay.',
        issueId: issue1.id,
        authorId: bob.id,
      },
      {
        content: 'Fixed in the latest commit. Testing now.',
        issueId: issue1.id,
        authorId: bob.id,
      },
      {
        content: "I've implemented the basic dark mode toggle. Need to test all components.",
        issueId: issue2.id,
        authorId: charlie.id,
      },
      {
        content: 'The dashboard looks great in dark mode! Just need to fix the chart colors.',
        issueId: issue2.id,
        authorId: alice.id,
      },
      {
        content: 'Added indexes on status and createdAt fields. Load time improved from 3s to 300ms!',
        issueId: issue3.id,
        authorId: alice.id,
      },
    ],
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

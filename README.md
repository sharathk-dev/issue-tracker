# Issue Tracker

A modern issue tracking application built with Next.js, Prisma, and MySQL.

## Features

- Create, edit, delete, and clone issues
- Inline editing for status, priority, and assignee
- Filter and search issues
- Sortable columns
- Pagination
- Comments system
- Dark mode support
- Responsive design

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Prisma ORM
- MySQL
- Tailwind CSS
- shadcn/ui components
- React Query
- Zod validation

## Prerequisites

- Node.js 18+
- MySQL database
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd issue-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="mysql://user:password@localhost:3306/issue_tracker"
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   npx prisma migrate dev

   # Seed the database with sample data
   npm run db:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Docker Setup (Optional)

Start MySQL with Docker:
```bash
docker-compose up -d
```

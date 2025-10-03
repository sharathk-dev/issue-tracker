import { Button } from '@/components/ui/button';
import { ArrowRight, Bug } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="mx-auto max-w-3xl px-4 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border px-3 py-1 text-sm">
            <Bug className="mr-2 h-4 w-4" />
            <span className="font-medium">Track, Manage, Resolve</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Issue Tracking
            <span className="block text-primary">Made Simple</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl md:mb-12">
            Streamline your workflow with our intuitive issue tracker. Create, assign, and resolve issues
            faster than ever before.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/issues">
                View Issues
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="/issues/new">Create Issue</Link>
            </Button>
          </div>
        </div>
    </section>
  );
}

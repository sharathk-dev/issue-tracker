import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Clock, Users, Zap } from 'lucide-react';
import { Hero } from './hero';
import { Pricing } from './pricing';

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for optimal performance and instant page loads.',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Assign issues, mention teammates, and work together seamlessly.',
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay in sync with live notifications and instant status changes.',
    },
    {
      icon: CheckCircle2,
      title: 'Track Progress',
      description: 'Monitor issue status, priority levels, and resolution timelines.',
    },
  ];

  return (
    <>
      <Hero />

      <section className="py-16 md:py-24 lg:py-32 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Everything you need to manage issues
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help your team stay organized and productive.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(feature => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <Pricing />
    </>
  );
}

'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Engineering Manager',
    company: 'TechCorp',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    content:
      'This issue tracker has transformed how our team collaborates. The interface is intuitive and the real-time updates keep everyone in sync.',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Lead',
    company: 'StartupXYZ',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    content:
      'We switched from our old system and never looked back. The filtering and search capabilities alone have saved us countless hours.',
  },
  {
    name: 'Emily Watson',
    role: 'CTO',
    company: 'InnovateLabs',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    content:
      'Finally, an issue tracker that doesn\'t get in the way. Clean, fast, and packed with features our team actually uses daily.',
  },
  {
    name: 'David Kim',
    role: 'Software Architect',
    company: 'DevSolutions',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    content:
      'The priority management and assignment features have streamlined our workflow significantly. Highly recommend for any dev team.',
  },
  {
    name: 'Lisa Patel',
    role: 'Scrum Master',
    company: 'AgileWorks',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    content:
      'Our sprint planning has become so much more efficient. The dashboard gives us exactly the insights we need at a glance.',
  },
  {
    name: 'James Turner',
    role: 'Development Lead',
    company: 'CodeFactory',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    content:
      'Love how responsive the team is to feedback. This tool keeps getting better, and it was already great when we started using it.',
  },
];

export function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Show 3 testimonials at a time on desktop, 1 on mobile
  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-muted/50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-2xl text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Loved by teams everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say about their experience.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="grid gap-6 md:grid-cols-3">
            {visibleTestimonials.map((testimonial, idx) => (
              <Card
                key={`${testimonial.name}-${currentIndex}-${idx}`}
                className="animate-fade-in flex flex-col h-full"
              >
                <CardContent className="pt-6 flex flex-col h-full">
                  <div className="mb-4 flex-1">
                    <p className="text-muted-foreground italic">&quot;{testimonial.content}&quot;</p>
                  </div>
                  <div className="flex items-center gap-3 mt-auto">
                    <Avatar className="flex-shrink-0">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                }`}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

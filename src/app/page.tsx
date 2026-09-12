import React from 'react';
import { HeroSection } from '@/components/sections/01-HeroSection';
import { MissionSection } from '@/components/sections/02-MissionSection';
import { PillarsSection } from '@/components/sections/03-PillarsSection';
import { JourneySection } from '@/components/sections/04-JourneySection';
import { ImpactSection } from '@/components/sections/05-ImpactSection';
import { GetInvolvedSection } from '@/components/sections/06-GetInvolvedSection';
import { StoriesSection } from '@/components/sections/07-StoriesSection';
import { EventsSection } from '@/components/sections/08-EventsSection';
import { PartnersSection } from '@/components/sections/09-PartnersSection';

export default function HomePage() {
  return (
    <div className="w-full relative">
      {/* 01 // Vision / Hero */}
      <HeroSection />

      {/* 02 // The Mission */}
      <MissionSection />

      {/* 03 // Pillars */}
      <PillarsSection />

      {/* 04 // Action Plan / Journey */}
      <JourneySection />

      {/* 05 // Impact Stats */}
      <ImpactSection />

      {/* 06 // Get Involved */}
      <GetInvolvedSection />

      {/* 07 // Stories from the Arena */}
      <StoriesSection />

      {/* 08 // Upcoming Events */}
      <EventsSection />

      {/* 09 // Partners */}
      <PartnersSection />
    </div>
  );
}

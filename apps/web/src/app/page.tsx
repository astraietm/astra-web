import React from 'react';
import { HeroSection } from '@/components/sections/01-HeroSection';
import { MissionSection } from '@/components/sections/02-MissionSection';
import { PillarsSection } from '@/components/sections/03-PillarsSection';
import { JourneySection } from '@/components/sections/04-JourneySection';
import { GetInvolvedSection } from '@/components/sections/06-GetInvolvedSection';
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

      {/* 06 // Get Involved */}
      <GetInvolvedSection />

      {/* 08 // Upcoming Events */}
      <EventsSection />

      {/* 09 // Partners */}
      <PartnersSection />
    </div>
  );
}

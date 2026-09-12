export interface EventItem {
  id: string;
  date: {
    day: string;
    month: string;
    year: string;
  };
  time: string;
  category: string;
  title: string;
  location: string;
  type: 'IN-PERSON' | 'VIRTUAL' | 'HYBRID';
  status: 'RECRUITING' | 'OPEN' | 'FEW SEATS';
  link: string;
}

export const upcomingEvents: EventItem[] = [
  {
    id: 'ev-1',
    date: { day: '06', month: 'OCT', year: '2026' },
    time: '09:30 AM - 11:00 AM IST',
    category: 'KEYNOTE // CONCLAVE',
    title: 'Sovereign Digital Frontiers: Threat Horizons & Zero-Day Defenses',
    location: 'Main Auditorium, KMCT Campus, Calicut',
    type: 'IN-PERSON',
    status: 'OPEN',
    link: '#register-delegate',
  },
  {
    id: 'ev-2',
    date: { day: '06', month: 'OCT', year: '2026' },
    time: '11:30 AM - 02:00 PM IST',
    category: 'HANDS-ON WORKSHOP',
    title: 'Advanced Binary Exploitation & Memory Corruption with Ghidra & GDB',
    location: 'Advanced Computing Lab 1, Dept of Cyber Security',
    type: 'IN-PERSON',
    status: 'FEW SEATS',
    link: '#register-delegate',
  },
  {
    id: 'ev-3',
    date: { day: '06', month: 'OCT', year: '2026' },
    time: '03:00 PM - OCT 07 03:00 PM',
    category: 'FLAGSHIP WARGAME',
    title: 'ASTRA 24-Hour National CTF: Jeopardy & Live Attack/Defense Arena',
    location: 'Cyber Arena & Global Remote Portal',
    type: 'HYBRID',
    status: 'OPEN',
    link: '#register-ctf',
  },
  {
    id: 'ev-4',
    date: { day: '07', month: 'OCT', year: '2026' },
    time: '10:00 AM - 01:30 PM IST',
    category: 'RESEARCH EXPO',
    title: 'National Cyber Security Project Exhibition & Paper Presentation',
    location: 'Innovation Gallery, KMCT Institute',
    type: 'IN-PERSON',
    status: 'OPEN',
    link: '#submit-paper',
  },
  {
    id: 'ev-5',
    date: { day: '07', month: 'OCT', year: '2026' },
    time: '04:00 PM - 06:30 PM IST',
    category: 'GRAND FINALE',
    title: 'Valedictory, Bounty Prize Distribution & Cyber Network Conclave',
    location: 'Main Auditorium, KMCT Campus, Calicut',
    type: 'IN-PERSON',
    status: 'OPEN',
    link: '#register-delegate',
  },
];

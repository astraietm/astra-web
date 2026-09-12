export interface ActionCardData {
  number: string;
  title: string;
  badge: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  accent: 'yellow' | 'green' | 'magenta';
  highlightDetails: string[];
}

export const getInvolvedData: ActionCardData[] = [
  {
    number: '01',
    title: 'DELEGATE CONCLAVE PASS',
    badge: 'ALL-ACCESS // OCT 6-7',
    description: 'Access all keynote sessions, technology symposiums, cybersecurity panel discussions, networking lunch, and delegate kits.',
    ctaText: 'Get Delegate Pass',
    ctaHref: '#register-delegate',
    accent: 'yellow',
    highlightDetails: [
      'Access to all Day 1 & Day 2 talks',
      'Official Certificate of Participation',
      'Delegate Kit & Networking Lunch',
      'KMCT Cyber Security Swag',
    ],
  },
  {
    number: '02',
    title: '24H NATIONAL CTF ARENA',
    badge: 'FLAGSHIP WARGAMES',
    description: 'Register your 2-to-4 member hacker squad to compete in the high-stakes Capture The Flag wargames for ₹100K+ in prizes.',
    ctaText: 'Register Squad',
    ctaHref: '#register-ctf',
    accent: 'green',
    highlightDetails: [
      '2 to 4 Members per Team',
      'Jeopardy + Attack/Defense challenges',
      'Cash Bounty Pool of ₹1,00,000+',
      'Direct interview fast-tracks for top teams',
    ],
  },
  {
    number: '03',
    title: 'PROJECT EXPO & PAPERS',
    badge: 'RESEARCH SHOWCASE',
    description: 'Submit your original research paper or demonstrate working hardware/software cybersecurity defense prototypes to the expert jury.',
    ctaText: 'Submit Project / Paper',
    ctaHref: '#submit-paper',
    accent: 'magenta',
    highlightDetails: [
      'Publication opportunities in proceedings',
      'Best Innovation Award & Cash Prize',
      'Mentorship from KMCT & Industry Jury',
      'Showcase booth at the Main Arena',
    ],
  },
];

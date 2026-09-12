export interface MetricHighlight {
  value: string;
  numberOnly: number;
  suffix: string;
  label: string;
  description: string;
}

export const impactMetrics: MetricHighlight[] = [
  {
    value: '1000+',
    numberOnly: 1000,
    suffix: '+',
    label: 'Cyber Delegates',
    description: 'Students, ethical hackers, and industry researchers converging at KMCT Calicut',
  },
  {
    value: '50+',
    numberOnly: 50,
    suffix: '+',
    label: 'Colleges & Universities',
    description: 'Premier institutions participating across Kerala and South India',
  },
  {
    value: '₹100K+',
    numberOnly: 100,
    suffix: 'K+',
    label: 'Prize Bounty Pool',
    description: 'Awarded to top CTF teams, exploit researchers, and project expos',
  },
  {
    value: '36H',
    numberOnly: 36,
    suffix: 'H',
    label: 'Live Cyber Challenges',
    description: 'Continuous hands-on wargames, red-teaming sprints, and reverse engineering',
  },
];

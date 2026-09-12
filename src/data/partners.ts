export interface PartnerGroup {
  category: string;
  description: string;
  partners: {
    name: string;
    label: string;
    icon: string;
  }[];
}

export const partnerGroups: PartnerGroup[] = [
  {
    category: 'Host & Institutional Pillars',
    description: 'Academic departments, research hubs, and patron institutions',
    partners: [
      { name: 'Dept of Cyber Security', label: 'Organizing Host', icon: 'Shield' },
      { name: 'KMCT Institute of Tech', label: 'Host Campus, Calicut', icon: 'GraduationCap' },
      { name: 'KMCT Group of Institutions', label: 'Founding Patron', icon: 'Building2' },
      { name: 'KMCT Center for AI & Cyber', label: 'Research Node', icon: 'Cpu' },
    ],
  },
  {
    category: 'Cyber Ecosystem & Security Allies',
    description: 'Government cyber security bodies, law enforcement & tech partners',
    partners: [
      { name: 'Kerala Police Cyberdome', label: 'Ecosystem Ally', icon: 'Shield' },
      { name: 'Cyber Security Guild India', label: 'Community Node', icon: 'Network' },
      { name: 'National CTF Federation', label: 'Wargame Platform', icon: 'Terminal' },
      { name: 'Open Web App Security (OWASP)', label: 'Knowledge Partner', icon: 'Code' },
    ],
  },
  {
    category: 'Industry & Technology Sponsors',
    description: 'Enterprise security providers and infrastructure sponsors',
    partners: [
      { name: 'FortressCloud Sec', label: 'Cloud Security Sponsor', icon: 'Cloud' },
      { name: 'RedGrid Labs', label: 'Hardware Village Sponsor', icon: 'CircuitBoard' },
      { name: 'ByteDefense ZeroDay', label: 'CTF Bounty Sponsor', icon: 'Zap' },
      { name: 'ThreatIntel Global', label: 'Intelligence Partner', icon: 'Bot' },
    ],
  },
];

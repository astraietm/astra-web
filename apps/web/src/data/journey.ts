export interface JourneyStep {
  number: string;
  phase: string;
  title: string;
  description: string;
  tag: string;
  actionText: string;
  actionHref: string;
  accent: 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan';
}

export const journeySteps: JourneyStep[] = [
  {
    number: '01',
    phase: 'OCT 06 // 09:30 AM',
    title: 'Inauguration & Sovereign Cyber Keynote',
    description: 'Opening address by national cyber security leaders, Kerala Police Cyberdome dignitaries, and KMCT leadership on sovereign cyber defense.',
    tag: 'DAY 1 // OPENING',
    actionText: 'View Keynote Speakers',
    actionHref: '#events',
    accent: 'yellow',
  },
  {
    number: '02',
    phase: 'OCT 06 // 11:30 AM',
    title: 'Deep-Dive Exploitation Workshops',
    description: 'Parallel hands-on technical tracks: Kernel Rootkits, Web Exploitation (OWASP Top 10), Firmware RE, and Enterprise Active Directory Attacks.',
    tag: 'DAY 1 // MASTERCLASSES',
    actionText: 'Register for Labs',
    actionHref: '#get-involved',
    accent: 'green',
  },
  {
    number: '03',
    phase: 'OCT 06 // 03:00 PM',
    title: 'Flagship 24H National CTF Kickoff',
    description: 'The cyber arena goes dark as squads compete in Jeopardy & Attack-Defense challenges across Crypto, Pwn, Web, Forensics, and Reverse Engineering.',
    tag: 'DAY 1-2 // 24H ARENA',
    actionText: 'Register CTF Squad',
    actionHref: '#get-involved',
    accent: 'magenta',
  },
  {
    number: '04',
    phase: 'OCT 07 // 10:00 AM',
    title: 'Cyber Project Expo & Paper Symposium',
    description: 'Undergraduate and postgraduate researchers present cutting-edge papers on AI-assisted defense, malware analysis, and biometric authentication.',
    tag: 'DAY 2 // RESEARCH',
    actionText: 'Submit Research',
    actionHref: '#get-involved',
    accent: 'blue',
  },
  {
    number: '05',
    phase: 'OCT 07 // 04:30 PM',
    title: 'Grand Valedictory & ₹100K Prize Ceremony',
    description: 'Celebration of winning CTF teams, top research papers, induction of fellows into the KMCT Cyber Elite Circle, and closing ceremony.',
    tag: 'DAY 2 // VALEDICTORY',
    actionText: 'See Prize Pool',
    actionHref: '#impact',
    accent: 'cyan',
  },
];

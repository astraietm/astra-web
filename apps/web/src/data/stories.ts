export interface StoryItem {
  id: string;
  category: string;
  author: string;
  role: string;
  title: string;
  quote: string;
  tags: string[];
  date: string;
}

export const communityStories: StoryItem[] = [
  {
    id: 'story-1',
    category: 'RED TEAMING & CTF',
    author: 'Fathima R.',
    role: 'Cyber Security Scholar, KMCT',
    title: 'From breaking local sandbox labs to top 10 in National CTFs',
    quote: 'The hands-on offensive security labs in the Cyber Security department at KMCT gave us real infrastructure to practice buffer overflows, SQLi, and privilege escalation without limits.',
    tags: ['Binary Exploitation', 'GDB', 'KMCT Cyber'],
    date: 'OCT 2026',
  },
  {
    id: 'story-2',
    category: 'MALWARE RESEARCH',
    author: 'Arjun K. Menon',
    role: 'Threat Intelligence Lead, Kochi',
    title: 'Dissecting banking trojans through live memory analysis',
    quote: 'ASTRA provides an unmatched platform where students and professionals dissect real malware strains in isolated virtual networks. The learning curve is intense and exhilarating.',
    tags: ['Ghidra', 'Volatility', 'Threat Intel'],
    date: 'SEP 2026',
  },
  {
    id: 'story-3',
    category: 'HARDWARE & IOT SECURITY',
    author: 'Naveen Joseph',
    role: 'Embedded Systems Researcher, Calicut',
    title: 'Extracting cryptographic keys via UART & SPI bus sniffing',
    quote: 'At KMCT, we demonstrated how hardware firmware can be dumped using logic analyzers. ASTRA’s hardware village is something you rarely find in standard tech fests.',
    tags: ['UART', 'Firmware RE', 'Hardware Hacking'],
    date: 'AUG 2026',
  },
  {
    id: 'story-4',
    category: 'SOC & DEFENSIVE OPS',
    author: 'Ananya S.',
    role: 'Blue Team Engineer, Calicut',
    title: 'Automating SIEM detection rules against active ransomware strains',
    quote: 'Participating in previous KMCT cyber wargames taught me how to read telemetry under pressure. It was the exact experience that helped me secure my cybersecurity role.',
    tags: ['Splunk', 'Suricata', 'Blue Team'],
    date: 'JUL 2026',
  },
];

export interface Pillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  accent: 'green' | 'yellow' | 'blue' | 'magenta';
  icon: string;
}

export const pillarsData: Pillar[] = [
  {
    number: '01',
    title: 'OFFENSIVE SECURITY & RED TEAMING',
    subtitle: 'Zero-Day Vulnerability Research',
    description: 'Master ethical penetration testing, binary exploitation, web application security, memory corruption vectors, and automated fuzzing techniques.',
    accent: 'yellow',
    icon: 'Terminal',
  },
  {
    number: '02',
    title: 'DEFENSIVE OPS & THREAT HUNTING',
    subtitle: 'SOC & Blue Team Architecture',
    description: 'Engineer proactive detection pipelines, SIEM monitoring, behavioral anomaly hunting, active defense honey-tokens, and automated incident triage.',
    accent: 'green',
    icon: 'Shield',
  },
  {
    number: '03',
    title: 'DIGITAL FORENSICS & REVERSE ENG',
    subtitle: 'Malware Analysis & Incident Response',
    description: 'Dissect sophisticated ransomware payloads, perform volatile memory analysis, disk artifact extraction, and reverse compiled assembly binaries.',
    accent: 'magenta',
    icon: 'FileCode',
  },
  {
    number: '04',
    title: 'CLOUD, AI & CRYPTOGRAPHIC DEFENSE',
    subtitle: 'Zero-Trust & Post-Quantum Cryptography',
    description: 'Secure cloud-native Kubernetes workloads, counter adversarial machine learning poisoning, and implement post-quantum cryptographic primitives.',
    accent: 'blue',
    icon: 'Lock',
  },
];

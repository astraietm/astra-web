export interface NavLink {
  label: string;
  href: string;
  number?: string;
  isSpecial?: boolean;
}

export const navigationLinks: NavLink[] = [
  { number: '01', label: 'The Vision', href: '/#vision' },
  { number: '02', label: 'The Arena Between', href: '/#mission' },
  { number: '03', label: 'Four Pillars', href: '/#pillars' },
  { number: '04', label: 'Action Plan', href: '/#journey' },
  { number: '05', label: 'Impact & Force', href: '/#impact' },
  { number: '06', label: 'Get Involved', href: '/#get-involved' },
  { number: '07', label: 'Arena Stories', href: '/#stories' },
  { number: '08', label: 'Upcoming Events (Oct 6-7)', href: '/events', isSpecial: true },
  { number: '09', label: 'Wargame Photo Gallery', href: '/gallery', isSpecial: true },
];

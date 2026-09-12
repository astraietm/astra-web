export interface NavLink {
  label: string;
  href: string;
  number?: string;
  isSpecial?: boolean;
}

export const navigationLinks: NavLink[] = [
  { number: '01', label: 'Conclave Overview', href: '/' },
  { number: '02', label: 'Stories from the Arena', href: '/#stories' },
  { number: '03', label: 'Upcoming Events (Oct 6-7)', href: '/events', isSpecial: true },
  { number: '04', label: 'Wargame Photo Gallery', href: '/gallery', isSpecial: true },
  { number: '05', label: 'Partners & Sponsors', href: '/#partners' },
];

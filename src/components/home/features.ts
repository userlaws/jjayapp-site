// Shared by the landing-page sections: the five tabs of the app, in tab-bar order.
// Stroke icon paths are 24×24 viewBox. Roundel colors are the site's own line
// palette — dark enough for white icons to pass contrast; tints are the pale
// versions used behind cards.

export interface Feature {
  key: 'today' | 'classes' | 'events' | 'campus' | 'profile';
  name: string;
  color: string;
  tint: string;
  blurb: string;
  /* Whether this tab gets a promotional poster in the showcase shelf. Profile is
     excluded: its screen is generic app chrome (sign-in, appearance, notifications)
     with none of the John Jay-specific wording the other four carry. */
  poster: boolean;
  alt: string;
}

export const icons: Record<Feature['key'], string> = {
  today:
    '<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1"/>',
  classes:
    '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20"/>',
  events:
    '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 10h17M8 2.5V6M16 2.5V6"/>',
  campus:
    '<path d="M4 21V5.5L12 3l8 2.5V21"/><path d="M2.5 21h19"/><path d="M9.5 21v-4.5h5V21"/><path d="M9 9.5h.5M14.5 9.5h.5M9 13.5h.5M14.5 13.5h.5"/>',
  profile:
    '<circle cx="12" cy="8" r="3.5"/><path d="M5 20.5c1.2-3.6 3.9-5 7-5s5.8 1.4 7 5"/>',
};

export const features: Feature[] = [
  {
    key: 'today',
    name: 'Today',
    color: '#2857a4',
    tint: '#e8f0fc',
    blurb: 'Open facilities, events, and upcoming deadlines.',
    poster: true,
    alt: 'The Today tab of JJAY showing what’s open now, today’s events, and upcoming deadlines, with callouts for a Spring Recess deadline reminder and a Cultural Night event.',
  },
  {
    key: 'classes',
    name: 'Classes',
    color: '#1f8a4c',
    tint: '#e6f5ec',
    blurb: 'Browse majors, subjects, and professors.',
    poster: true,
    alt: 'The Classes tab of JJAY with a search field for majors, a Browse all subjects link, and a list of Bachelor of Arts majors including Criminal Justice, Economics, History, Law & Society, and Mathematics.',
  },
  {
    key: 'events',
    name: 'Events',
    color: '#7b4fb6',
    tint: '#f0e9fa',
    blurb: 'See campus events by date and category.',
    poster: true,
    alt: 'The Events tab of JJAY with a week date picker, category filters for All, Academic, Social, Career, and Wellness, and a Caribbean Students Association Cultural Night event at 6:00 PM.',
  },
  {
    key: 'campus',
    name: 'Campus',
    color: '#c05f0e',
    tint: '#fdefe3',
    blurb: 'Find buildings, facilities, and services.',
    poster: true,
    alt: 'The Campus tab of JJAY with a search field for buildings, facilities, and services, and building cards for Haaren Hall, New Building, Westport, and the BMW Building.',
  },
  {
    key: 'profile',
    name: 'Profile',
    color: '#a87a20',
    tint: '#fbf3e1',
    blurb: 'Save professors and personalize your experience.',
    poster: false,
    alt: 'The Profile tab of JJAY with Sign In and Create Account options, an appearance setting for System, Light, or Dark, and a notifications toggle.',
  },
];

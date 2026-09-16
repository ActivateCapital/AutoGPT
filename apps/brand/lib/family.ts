// The CreAI venture family, as shown on the brand site. Edit freely —
// descriptions for ventures still in development are deliberately neutral;
// replace them as each venture becomes real.

export interface Venture {
  id: string;
  name: string;
  url: string | null; // null = not yet public
  status: 'live' | 'in-development';
  tagline: string;
  detail: string;
}

export const ventures: Venture[] = [
  {
    id: 'skills',
    name: 'CreAI Skills',
    url: 'https://skills.creai.dev',
    status: 'live',
    tagline: 'Working AI agents you own.',
    detail:
      'Automation kits and agent skills for lead qualification, inbox triage, meetings, and content — complete, tested, and yours after one payment. Live today, with a free skill to try.',
  },
  {
    id: 'activate',
    name: 'Activate',
    url: null,
    status: 'in-development',
    tagline: 'The next venture from the studio.',
    detail: 'In development. Details when it ships — we announce things that work, not waitlists.',
  },
  {
    id: 'arbi',
    name: 'Arbi',
    url: null,
    status: 'in-development',
    tagline: 'The next venture after that.',
    detail: 'In development. Details when it ships — we announce things that work, not waitlists.',
  },
];

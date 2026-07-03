// Shared content + placeholder primitives across the three variations.
// One source of truth so we can iterate copy in one place.

const PROFILE = {
  name: 'Lucas Qiu',
  nameAlt: 'Qiu Lucas',
  employer: 'United Imaging Research',
  role: 'Researcher',
  location: 'Houston, TX',
  email: 'lqiu03@ucla.edu',
  blurb: [
    "I'm a researcher working on kinetic modeling for Positron Emission Tomography (PET).",
    "I also work on medical agent harnesses, observability, and alignment.",
  ],
  excited: "I'm excited about AI-native physical intelligence.",
  cta:     "Get in touch with me if you love building.",
  links: [
    { label: 'Email',    href: 'mailto:lqiu03@ucla.edu' },
    { label: 'GitHub',   href: 'https://github.com/lqiu03' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/lucas-qiu/' },
    { label: 'X',        href: 'https://x.com/lqiu03' },
    { label: 'Tableau',  href: 'https://public.tableau.com/app/profile/lucas.qiu/vizzes' },
  ],
};

const WRITING = [
  {
    title: 'Geometric Representations of Death in Neural Networks',
    date:  'June 2026',
    kind:  'Interpretability, Llama-3.1-8B',
    desc:  'To a transformer, what is the internal representation of "death"? A conceptual term rather to humans.',
    href:  'https://broad-booth-831.notion.site/Geometric-Representations-of-Death-in-Neural-Networks-383a3e519d1680d3a207ebdcae0ac90b?source=copy_link',
    figure: {
      src:     'geometric-death-manifold.png',
      caption: 'Reproducing Geiger et al (Goodfire) on manifold geometry',
    },
  },
  {
    title: 'Self-Improving Agent for DMR Pipeline',
    date:  'March 2025',
    kind:  'Reinforcement Learning',
    desc:  "Inspired by Andrej Karpathy's AutoResearch.",
    href:  'https://broad-booth-831.notion.site/Self-Improving-Agent-for-DMR-Pipeline-32da3e519d168090b801fb3d16e5e78a?source=copy_link',
  },
  {
    title: 'Death Motif in Reasoning Models',
    date:  'Dec 2025',
    kind:  'Interpretability, Alignment',
    desc:  'Have you wondered how reasoning models think of "death"? Are they self-aware?',
    href:  'https://broad-booth-831.notion.site/Death-Motif-in-Reasoning-Models-2d2a3e519d1680b1bdefd77e7ce81d15?source=copy_link',
  },
];

const PUBLICATIONS = [
  {
    title: 'Impact of Early Imaging Time-Point Selection on Time-Integrated Activity Estimation using Bi-Exponential Model for Radiopharmaceutical Therapy Dosimetry',
    authors: ['Wang Yiran','Qiu Lucas','Liu Hui','Sun XiShan','Hu Lingzhi','He Liuchun','Dong Yun','Li Hongdi'],
    venue: 'Radiation Oncology (ASTRO)',
    date:  'March 2026',
    label: null,
    href:  '#',
  },
  {
    title: 'The Effects of Time Since Fire On Bird Community Composition in Chaparral Ecosystems Across Los Angeles County',
    authors: ['Qiu Lucas','et al.'],
    venue: 'arXiv',
    date:  'October 2025',
    label: 'Preprint',
    href:  'https://arxiv.org/abs/2510.03573',
  },
];

// Real headshot, framed to fit the slot. Round prop = circle, otherwise rounded square.
function Headshot({ size = 220, round = true, label = 'headshot' }) {
  const r = round ? size/2 : 6;
  return (
    <div style={{
      width: size, height: size, borderRadius: r, overflow: 'hidden',
      background: '#e8e3d8', border: '1px solid #cfc7b6', flex: '0 0 auto',
    }}>
      <img src="headshot.jpg" alt={PROFILE.name}
           style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </div>
  );
}

const OSS = [
  { org: 'traceroot-ai', label: 'traceroot' },
  { org: 'anthropics',   label: 'anthropic' },
  { org: 'perplexityai', label: 'perplexity' },
];

Object.assign(window, { PROFILE, WRITING, PUBLICATIONS, OSS, Headshot });

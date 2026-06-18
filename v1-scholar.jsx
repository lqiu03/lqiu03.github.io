// V1 — Quiet Scholar.
// Single column, serif-led. Generous whitespace, restrained accent.

function V1Scholar() {
  const styles = scholarStyles;
  return (
    <div className="v1" style={styles.page}>
      <style>{scholarCSS}</style>

      <header style={styles.nav}>
        <div style={styles.navMark}>LQ</div>
        <nav style={styles.navLinks}>
          <a href="#writing">Writing</a>
          <a href="#publications">Publications</a>
          <a href="#reading">Reading</a>
          <a href={`mailto:${PROFILE.email}`}>Contact</a>
        </nav>
      </header>

      <main style={styles.main}>
        {/* Intro */}
        <section style={styles.intro}>
          <div style={styles.introHead}>
            <Headshot size={240} round={false} label="headshot" />
            <div style={styles.introMeta}>
              <h1 style={styles.name}>{PROFILE.name}</h1>
              <div style={styles.employer}>{PROFILE.employer}</div>
              <div style={styles.affiliations}>
                <div>UCLA Biology '25</div>
                <div>Ordway &amp; Zapata Lab</div>
              </div>
            </div>
          </div>

          <div style={styles.blurb}>
            <p style={styles.lede}>
              I'm a researcher working on <em>kinetic modeling</em> for
              Positron Emission Tomography (PET). I also work on
              medical agent harnesses, observability, and alignment.
            </p>
            <p style={styles.lede}>
              I'm excited about the prospect of <span style={styles.accent}>AI-native physical intelligence</span>.
            </p>
            <p style={styles.cta}>
              Get in touch with me if you love building.
            </p>
          </div>

          <ul style={styles.linksRow}>
            {PROFILE.links.map(l => (
              <li key={l.label}><a href={l.href}>{l.label}<span style={styles.arrow}>↗</span></a></li>
            ))}
          </ul>

          {/* Subtle open-source signal: org chips lead, contribution graph trails. */}
          <a href="https://github.com/lqiu03" target="_blank" rel="noreferrer" style={styles.ghBlock}>
            <div style={styles.ghHead}>
              <span style={styles.ghLabel}>Open source contributions</span>
              <span style={styles.ghSep}/>
              <span style={styles.ghHandle}>@lqiu03</span>
              <span style={styles.ghHint}>github ↗</span>
            </div>

            <div style={styles.orgRow}>
              {OSS.map(o => (
                <span key={o.org} style={styles.orgChip}>
                  <img
                    src={`https://github.com/${o.org}.png?size=64`}
                    alt={o.label}
                    style={styles.orgLogo}
                    loading="lazy"
                  />
                  <span style={styles.orgLabel}>@{o.org}</span>
                </span>
              ))}
              <span style={styles.orgMore}>+ more</span>
            </div>

            <div style={styles.ghChartWrap}>
              <img
                src="https://ghchart.rshah.org/c96442/lqiu03"
                alt="GitHub contributions for lqiu03"
                style={styles.ghChart}
                loading="lazy"
              />
            </div>
          </a>
        </section>

        {/* Writing */}
        <section id="writing" style={styles.section}>
          <SectionHead n="01" label="Writing" />
          <ol style={styles.writingList}>
            {WRITING.map((w, i) => (
              <li key={i} style={styles.writingItem}>
                <a href={w.href} target="_blank" rel="noreferrer" style={styles.writingLink}>
                  <div style={styles.writingMeta}>
                    <span style={styles.writingKind}>{w.kind}</span>
                    <span style={styles.writingDate}>{w.date}</span>
                  </div>
                  <h3 style={styles.writingTitle}>{w.title}<span style={styles.writingArrow}>↗</span></h3>
                  <p style={styles.writingDesc}>{w.desc}</p>
                </a>
              </li>
            ))}
          </ol>
        </section>

        {/* Publications */}
        <section id="publications" style={styles.section}>
          <SectionHead n="02" label="Publications" />
          <ol style={styles.pubList}>
            {PUBLICATIONS.map((p, i) => (
              <li key={i} style={styles.pubItem}>
                {p.label && <div style={styles.pubLabel}>{p.label}</div>}
                {p.href && p.href !== '#'
                  ? <h3 style={styles.pubTitle}><a href={p.href} target="_blank" rel="noreferrer" style={styles.pubTitleLink}>{p.title}<span style={styles.pubArrow}>↗</span></a></h3>
                  : <h3 style={styles.pubTitle}>{p.title}</h3>}
                <p style={styles.pubAuthors}>
                  {p.authors.map((a, idx) => (
                    <React.Fragment key={a}>
                      {a === 'Qiu Lucas'
                        ? <strong style={styles.pubMe}>{a}</strong>
                        : <span>{a}</span>}
                      {idx < p.authors.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </p>
                <p style={styles.pubVenue}>
                  <em>{p.venue}</em> · {p.date}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Reading — bookshelf with shuffle */}
        <section id="reading" style={styles.section}>
          <ReadingShelf inline />
        </section>
      </main>

      <footer style={styles.footer}>
        <span>© 2026 {PROFILE.name}</span>
        <span style={styles.footerDot}>·</span>
        <span>Last updated May 2026</span>
      </footer>
    </div>
  );
}

function SectionHead({ n, label }) {
  return (
    <div style={scholarStyles.sectionHead}>
      <span style={scholarStyles.sectionN}>{n}</span>
      <h2 style={scholarStyles.sectionLabel}>{label}</h2>
      <span style={scholarStyles.sectionRule} />
    </div>
  );
}

const INK = '#1d1a14';
const INK_2 = '#4a443a';
const INK_3 = '#7a7264';
const BG = '#f6f3ec';
const PAPER = '#fbf9f3';
const ACCENT = 'oklch(0.55 0.12 35)';
const RULE = '#d9d2c2';

const scholarCSS = `
.v1 a { color: inherit; text-decoration: none; border-bottom: 1px solid ${RULE}; transition: border-color .15s, color .15s; }
.v1 a:hover { color: ${ACCENT}; border-bottom-color: ${ACCENT}; }
.v1 *::selection { background: ${ACCENT}; color: ${PAPER}; }
`;

const scholarStyles = {
  page: {
    background: BG,
    color: INK,
    fontFamily: "'Source Serif 4', Georgia, serif",
    fontFeatureSettings: '"ss01","onum"',
    width: '100%', minHeight: '100%',
    padding: '56px 96px 80px',
    boxSizing: 'border-box',
  },
  nav: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    maxWidth: 880, margin: '0 auto 120px',
  },
  navMark: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '0.16em',
    color: INK_2,
  },
  navLinks: {
    display: 'flex', gap: 28, fontFamily: "'IBM Plex Sans', sans-serif",
    fontSize: 14, color: INK_2,
  },

  main: { maxWidth: 720, margin: '0 auto' },

  intro: { marginBottom: 120 },
  introHead: { display: 'flex', alignItems: 'center', gap: 40, marginBottom: 48 },
  introMeta: { display: 'flex', flexDirection: 'column', gap: 8 },
  employer: {
    fontFamily: "'DM Sans', sans-serif", fontSize: 15,
    color: INK_2, letterSpacing: '-0.005em',
  },
  affiliations: {
    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    color: INK_3, letterSpacing: '-0.005em', lineHeight: 1.5,
    marginTop: 14, display: 'flex', flexDirection: 'column', gap: 2,
  },
  name: {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, fontSize: 30, margin: 0,
    letterSpacing: '-0.02em', lineHeight: 1.05,
  },

  blurb: { marginBottom: 40 },
  lede: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 21, lineHeight: 1.55, margin: '0 0 16px',
    color: INK, fontWeight: 400, textWrap: 'pretty',
    letterSpacing: '-0.005em',
  },
  accent: { color: ACCENT, fontWeight: 500 },
  cta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 16, lineHeight: 1.5, margin: '20px 0 0',
    color: INK_2, fontWeight: 400, fontStyle: 'italic',
  },

  linksRow: {
    display: 'flex', gap: 24, listStyle: 'none', padding: 0, margin: 0,
    fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: INK_2,
  },
  arrow: { marginLeft: 4, fontSize: 11, color: INK_3 },

  ghBlock: {
    display: 'block', marginTop: 44,
    paddingTop: 24, borderTop: `1px solid ${RULE}`,
    borderBottom: 'none', color: 'inherit',
    transition: 'opacity .15s',
  },
  ghHead: {
    display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 14,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: INK_3, letterSpacing: '0.08em', textTransform: 'uppercase',
  },
  ghLabel: { color: INK_2 },
  ghSep: { width: 1, height: 11, background: RULE, display: 'inline-block', alignSelf: 'center' },
  ghHandle: { color: INK },
  ghHint: { marginLeft: 'auto', color: INK_3, textTransform: 'none', letterSpacing: '0.04em' },

  orgRow: {
    display: 'flex', alignItems: 'center', flexWrap: 'wrap',
    gap: 10, marginBottom: 20,
  },
  orgChip: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    padding: '6px 12px 6px 6px',
    border: `1px solid ${RULE}`, background: PAPER,
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    color: INK, letterSpacing: '-0.005em',
  },
  orgLogo: {
    width: 22, height: 22, borderRadius: '50%', display: 'block',
    background: BG,
  },
  orgLabel: { fontWeight: 500 },
  orgMore: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: INK_3, letterSpacing: '0.06em', padding: '0 6px',
  },

  ghChartWrap: {
    width: '100%', overflow: 'hidden',
    filter: 'saturate(0.85) hue-rotate(-8deg)',
    opacity: 0.7,
  },
  ghChart: { width: '100%', height: 'auto', display: 'block' },

  section: { marginBottom: 96 },
  sectionHead: {
    display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36,
  },
  sectionN: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: INK_3, letterSpacing: '0.14em',
  },
  sectionLabel: {
    fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500,
    fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: INK_2, margin: 0,
  },
  sectionRule: { flex: 1, height: 1, background: RULE },

  writingList: { listStyle: 'none', padding: 0, margin: 0 },
  writingItem: { borderTop: `1px solid ${RULE}`, padding: '28px 0' },
  writingLink: { display: 'block', borderBottom: 'none' },
  writingMeta: {
    display: 'flex', gap: 14, alignItems: 'baseline', marginBottom: 10,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: INK_3, letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  writingKind: { color: ACCENT },
  writingDate: {},
  writingTitle: {
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 20,
    lineHeight: 1.3, margin: '0 0 8px', letterSpacing: '-0.01em',
    color: INK,
  },
  writingArrow: { marginLeft: 8, fontSize: 14, color: INK_3, verticalAlign: 'middle' },
  writingDesc: {
    margin: 0, fontFamily: "'DM Sans', sans-serif",
    fontSize: 15, lineHeight: 1.55, color: INK_2, fontWeight: 400,
    textWrap: 'pretty',
  },

  pubList: { listStyle: 'none', padding: 0, margin: 0 },
  pubItem: { borderTop: `1px solid ${RULE}`, padding: '28px 0' },
  pubLabel: {
    display: 'inline-block', fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    color: ACCENT, border: `1px solid ${ACCENT}`,
    padding: '3px 8px', marginBottom: 12, lineHeight: 1,
  },
  pubTitle: {
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 17,
    lineHeight: 1.4, margin: '0 0 10px', letterSpacing: '-0.005em',
    color: INK,
  },
  pubTitleLink: { borderBottom: 'none', color: INK },
  pubArrow: { marginLeft: 6, fontSize: 12, color: INK_3, verticalAlign: 'middle' },
  pubAuthors: {
    margin: '0 0 6px', fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, color: INK_2, lineHeight: 1.55,
  },
  pubMe: { color: INK, fontWeight: 700 },
  pubVenue: {
    margin: 0, fontSize: 13, color: INK_3,
    fontFamily: "'DM Sans', sans-serif",
  },

  footer: {
    maxWidth: 880, margin: '0 auto', paddingTop: 32,
    borderTop: `1px solid ${RULE}`,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    color: INK_3, letterSpacing: '0.08em', textTransform: 'uppercase',
    display: 'flex', gap: 10, justifyContent: 'center',
  },
  footerDot: { color: INK_3 },
};

Object.assign(window, { V1Scholar, SectionHead });

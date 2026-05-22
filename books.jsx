// Reading section — data + procedural covers + three draft variants.
// Drop-in: each variant takes a BOOKS array and renders a self-contained section
// styled to match the Quiet Scholar palette. The data shape mirrors what a
// Douban export would produce, so swapping placeholder→real is one file edit.

// ─── Data ──────────────────────────────────────────────────────────────────────────────────────────
// Real data scraped from Lucas's Douban collect page. Books with personal
// notes sort first per the user's preference.
const BOOKS = (window.BOOKS_DATA || []).map(b => ({
  ...b,
  rating:   b.rating || 0,
  note:     b.note || '',
  date:     b.date || '',
  favorite: b.rating === 5,
  hasNote:  Boolean(b.hasNote ?? (b.note && b.note.length > 0)),
}));

// Subsets for the bookshelf — prioritize commented books, fill all three
// rows. The full library is reachable from the Douban link.
const SHELF_PER_ROW = 80;
const SHELF_ROWS_DATA = (() => {
  const noted   = BOOKS.filter(b => b.hasNote);
  const unnoted = BOOKS.filter(b => !b.hasNote);
  const all = noted.concat(unnoted);
  return [
    all.slice(0,                  SHELF_PER_ROW),
    all.slice(SHELF_PER_ROW,      SHELF_PER_ROW * 2),
    all.slice(SHELF_PER_ROW * 2,  SHELF_PER_ROW * 3),
  ];
})();
const SHELF_BOOKS = SHELF_ROWS_DATA.flat();

const DOUBAN_URL = 'https://book.douban.com/people/244870216/collect';
const DOUBAN_TOTAL_FALLBACK = 400;

const DOUBAN_TOTAL = BOOKS.length || DOUBAN_TOTAL_FALLBACK;

// ─── Palette tokens (scholar) ────────────────────────────────────────────────────
const RPAL = {
  INK:    '#1d1a14',
  INK2:   '#4a443a',
  INK3:   '#7a7264',
  BG:     '#f6f3ec',
  PAPER:  '#fbf9f3',
  ACCENT: 'oklch(0.55 0.12 35)',
  RULE:   '#d9d2c2',
};

// ─── Procedural cover system ─────────────────────────────────────────────────
// Hash → palette index → consistent cover for each title.
function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const COVER_PALETTE = [
  { bg: '#c96442', fg: '#fbf4e8', rule: '#fbf4e8' }, // rust
  { bg: '#3e5a5e', fg: '#f3ebd9', rule: '#d9b16a' }, // teal
  { bg: '#6e3e5c', fg: '#f6e9da', rule: '#d9b16a' }, // plum
  { bg: '#2e3e5a', fg: '#f3ebd9', rule: '#c96442' }, // navy
  { bg: '#3e6044', fg: '#f3ebd9', rule: '#d9b16a' }, // forest
  { bg: '#b58447', fg: '#1d1a14', rule: '#1d1a14' }, // ochre
  { bg: '#1d1a14', fg: '#f3ebd9', rule: '#c96442' }, // ink
  { bg: '#e8d9b8', fg: '#1d1a14', rule: '#c96442' }, // cream
];

function bookPalette(book) {
  return COVER_PALETTE[hashStr(book.title) % COVER_PALETTE.length];
}

function BookCover({ book, height = 200 }) {
  const w = Math.round(height * 0.66);
  const p = bookPalette(book);
  const pad = Math.max(8, w * 0.09);
  const titleSize = Math.max(11, w * 0.13);
  const authorSize = Math.max(9, w * 0.075);
  return (
    <div style={{
      width: w, height,
      background: p.bg, color: p.fg,
      display: 'flex', flexDirection: 'column',
      justifyContent: 'space-between',
      padding: `${pad}px ${pad}px`,
      boxShadow: '0 1px 0 rgba(0,0,0,.05), 0 8px 22px -10px rgba(0,0,0,.35)',
      fontFamily: "'EB Garamond', 'Noto Serif SC', Georgia, serif",
      position: 'relative', flexShrink: 0,
      overflow: 'hidden',
    }}>
      <div style={{ height: 1, background: p.rule, opacity: .7 }} />
      <div style={{
        fontSize: titleSize, lineHeight: 1.12, fontWeight: 500,
        textWrap: 'pretty', letterSpacing: '-0.005em',
        textAlign: 'left',
      }}>{book.title}</div>
      <div>
        <div style={{ height: 1, background: p.rule, opacity: .5, marginBottom: pad * 0.6 }} />
        <div style={{
          fontSize: authorSize, fontStyle: 'italic',
          opacity: .85, letterSpacing: '0.02em',
        }}>{book.author}</div>
      </div>
    </div>
  );
}

function BookSpine({ book, height = 200, active = false, onClick }) {
  const titleLen = book.title.length;
  const w = Math.max(28, Math.min(54, 26 + titleLen * 0.7) + (hashStr(book.title) % 6) - 3);
  const p = bookPalette(book);
  const lastName = book.author.split(/\s+/).pop();
  return (
    <button
      onClick={onClick}
      style={{
        width: w, height, padding: 0, cursor: 'pointer',
        background: p.bg, color: p.fg, border: 'none',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'space-between',
        boxShadow: 'inset -2px 0 rgba(0,0,0,.18), inset 2px 0 rgba(255,255,255,.06)',
        transform: active ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform .18s cubic-bezier(.2,.7,.3,1)',
        fontFamily: "'EB Garamond', 'Noto Serif SC', Georgia, serif",
        position: 'relative', flexShrink: 0,
        outline: active ? `2px solid ${RPAL.ACCENT}` : 'none',
        outlineOffset: active ? '2px' : 0,
      }}>
      <span style={{ width: '60%', height: 2, background: p.rule, marginTop: 10, opacity: .7 }} />
      <span style={{
        writingMode: 'vertical-rl', textOrientation: 'mixed',
        fontSize: 12.5, fontWeight: 500, letterSpacing: '-0.005em',
        textAlign: 'left', whiteSpace: 'nowrap',
        overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: height - 60,
        padding: '4px 0',
      }}>{book.title}</span>
      <span style={{
        fontSize: 9, opacity: .75, fontStyle: 'italic',
        marginBottom: 8, letterSpacing: '0.02em',
      }}>{lastName}</span>
    </button>
  );
}

// ─── Small atoms ─────────────────────────────────────────────────────────────
function Stars({ rating, size = 5, accent = RPAL.ACCENT }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{
          width: size * 2, height: size * 2, borderRadius: '50%',
          background: n <= rating ? accent : 'transparent',
          border: `1px solid ${accent}`,
          opacity: n <= rating ? 1 : 0.35,
          display: 'inline-block',
        }} />
      ))}
    </span>
  );
}

const readingBtn = (variant = 'solid') => ({
  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
  padding: '10px 16px', cursor: 'pointer',
  letterSpacing: '-0.005em',
  transition: 'opacity .15s, background .15s, color .15s',
  display: 'inline-flex', gap: 8, alignItems: 'center',
  ...(variant === 'solid'
    ? { background: RPAL.ACCENT, color: RPAL.PAPER, border: `1px solid ${RPAL.ACCENT}` }
    : { background: 'transparent', color: RPAL.INK2, border: `1px solid ${RPAL.RULE}` }),
});

function ReadingFrame({ n, title, hint, children, inline = false }) {
  const inner = (
    <div style={{ maxWidth: inline ? '100%' : 1040, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: RPAL.INK3, letterSpacing: '0.14em',
        }}>{n}</span>
        <h2 style={{
          fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 500,
          fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: RPAL.INK2, margin: 0,
        }}>{title}</h2>
        <span style={{ flex: 1, height: 1, background: RPAL.RULE }} />
      </div>
      {hint && (
        <p style={{
          margin: '0 0 36px', fontSize: 14, lineHeight: 1.55,
          color: RPAL.INK2, maxWidth: 640,
        }}>{hint}</p>
      )}
      {children}
    </div>
  );

  if (inline) return inner;

  return (
    <div style={{
      background: RPAL.BG, color: RPAL.INK,
      width: '100%', minHeight: '100%',
      padding: '64px 96px 80px',
      boxSizing: 'border-box',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {inner}
    </div>
  );
}

// ─── Variant 2 — Bookshelf (click a spine) ────────────────────────────
const SHELF_ROW_H = 230;
const SHELVES_COUNT = 8;

// Decorative bookshelf wall. Deterministic seed → consistent spines per row.
// Translates Y on shuffle so a different shelf height comes into view.
function BookshelfBackground({ shelfIndex }) {
  const shelves = React.useMemo(() => {
    const result = [];
    for (let s = 0; s < SHELVES_COUNT; s++) {
      const spines = [];
      for (let i = 0; i < 28; i++) {
        const seed = s * 1000 + i * 37 + 11;
        const palette = COVER_PALETTE[(seed * 31) % COVER_PALETTE.length];
        const h = 165 + ((seed * 17) % 48);
        const w = 26 + ((seed * 13) % 28);
        const band = (seed * 7) % 3 === 0;
        spines.push({ palette, h, w, band, key: `s${seed}` });
      }
      result.push(spines);
    }
    return result;
  }, []);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      background: '#3b2f24',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        transform: `translateY(${-shelfIndex * SHELF_ROW_H}px)`,
        transition: 'transform .7s cubic-bezier(.55,.05,.2,1)',
      }}>
        {shelves.map((spines, sIdx) => (
          <div key={sIdx} style={{ position: 'relative', height: SHELF_ROW_H }}>
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 1,
              height: SHELF_ROW_H - 14, padding: '0 28px',
              filter: 'brightness(0.92)',
            }}>
              {spines.map(s => (
                <div key={s.key} style={{
                  width: s.w, height: s.h,
                  background: s.palette.bg,
                  flexShrink: 0, position: 'relative',
                  boxShadow: 'inset -2px 0 rgba(0,0,0,.22), inset 2px 0 rgba(255,255,255,.04)',
                }}>
                  {s.band && (
                    <div style={{
                      position: 'absolute', top: 14, left: 4, right: 4,
                      height: 2, background: s.palette.rule, opacity: 0.55,
                    }} />
                  )}
                </div>
              ))}
            </div>
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0, height: 14,
              background: 'linear-gradient(180deg, #5a4630 0%, #3e2f1d 60%, #2a1f12 100%)',
              boxShadow: '0 2px 4px rgba(0,0,0,.4)',
            }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <span style={{
      display: 'inline-flex', gap: 3, fontSize: 22, lineHeight: 1,
      color: RPAL.ACCENT,
    }} aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <span key={n} style={{ opacity: n <= rating ? 1 : 0.22 }}>★</span>
      ))}
    </span>
  );
}

const miniLabel = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
  color: RPAL.INK3, letterSpacing: '0.14em', textTransform: 'uppercase',
};

const iconBtn = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 20, fontWeight: 400,
  width: 52, height: 52, padding: 0, lineHeight: 1,
  background: RPAL.PAPER, color: RPAL.INK2,
  border: `1px solid ${RPAL.RULE}`, cursor: 'pointer',
  transition: 'background .12s, color .12s, border-color .12s',
};

const bigShuffleBtn = {
  fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600,
  padding: '18px 40px', minWidth: 240,
  background: RPAL.ACCENT, color: '#fff',
  border: 'none', cursor: 'pointer',
  letterSpacing: '-0.005em',
  boxShadow: '0 4px 0 rgba(89, 32, 8, .15), 0 18px 36px -12px rgba(201, 100, 66, .55)',
  display: 'inline-flex', gap: 12, alignItems: 'center',
  transition: 'transform .08s, box-shadow .12s, filter .12s',
};

function ReadingShelf({ inline = false }) {
  const [rows, setRows] = React.useState(SHELF_ROWS_DATA);
  const [active, setActive] = React.useState(null); // { row, idx } | null
  const [orders, setOrders] = React.useState(() =>
    rows.map(row => row.map((_, i) => i))
  );

  function shuffleAll() {
    // Pull a fresh random sample of 240 books from the entire 400+ library,
    // distribute across the three shelves. Each shuffle reveals different books.
    const pool = [...BOOKS];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const newRows = [
      pool.slice(0,                  SHELF_PER_ROW),
      pool.slice(SHELF_PER_ROW,      SHELF_PER_ROW * 2),
      pool.slice(SHELF_PER_ROW * 2,  SHELF_PER_ROW * 3),
    ];
    setRows(newRows);
    setOrders(newRows.map(row => row.map((_, i) => i)));
    const r = Math.floor(Math.random() * newRows.length);
    const idx = Math.floor(Math.random() * newRows[r].length);
    setActive({ row: r, idx });
  }

  const activeBook = active ? rows[active.row][active.idx] : null;

  return (
    <ReadingFrame
      n="03"
      title="Reading"
      hint="Readings is one of my biggest identities, and I read ~80 books a year. Always looking for new book recs!"
      inline={inline}>

      {/* Prominent shuffle CTA — centered, primary action */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 18, marginBottom: 24, flexWrap: 'wrap',
      }}>
        <span style={miniLabel}>Click a spine to pull a book out.</span>
        <button onClick={shuffleAll} style={bigShuffleBtn}>
          <span style={{ fontSize: 22, lineHeight: 1 }}>↻</span>
          Shuffle the shelf
        </button>
      </div>

      {/* The bookshelf scene — all three rows are real, clickable books */}
      <div style={{
        background: '#3b2f24',
        boxShadow: 'inset 0 0 80px rgba(0,0,0,.45)',
        border: '1px solid #1d140b',
      }}>
        {rows.map((row, rIdx) => (
          <UserRow
            key={rIdx}
            books={row}
            order={orders[rIdx]}
            active={active && active.row === rIdx ? active.idx : null}
            setActive={(idx) => setActive(idx == null ? null : { row: rIdx, idx })}
          />
        ))}
      </div>

      {/* Detail panel */}
      <div style={{
        marginTop: 18,
        display: 'grid', gridTemplateColumns: '170px 1fr', gap: 28,
        padding: '24px 28px',
        background: RPAL.PAPER,
        border: `1px solid ${RPAL.RULE}`,
        minHeight: 240,
        opacity: activeBook ? 1 : 0.6,
        transition: 'opacity .18s',
      }}>
        {activeBook ? (
          <>
            <BookCover book={activeBook} height={220} />
            <div>
              <div style={{
                ...miniLabel, marginBottom: 10,
                display: 'flex', gap: 10, alignItems: 'center',
              }}>
                <span>Read {activeBook.date}</span>
                {activeBook.favorite && <span style={{ color: RPAL.ACCENT }}>★ Favorite</span>}
              </div>
              <h3 style={{
                fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif", fontWeight: 500, fontSize: 22,
                lineHeight: 1.2, margin: '0 0 4px', letterSpacing: '-0.01em',
              }}>
                {activeBook.douban
                  ? <a href={activeBook.douban} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{activeBook.title}</a>
                  : activeBook.title}
              </h3>
              <div style={{
                fontSize: 15, color: RPAL.INK2, marginBottom: 16,
                fontStyle: 'italic', fontFamily: "'EB Garamond', 'Noto Serif SC', serif",
              }}>{activeBook.author}</div>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                flexWrap: 'wrap', marginBottom: activeBook.note ? 14 : 0,
              }}>
                <span style={miniLabel}>My rating</span>
                <StarRating rating={activeBook.rating} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12, color: RPAL.INK3,
                }}>{activeBook.rating} / 5</span>
              </div>

              {activeBook.note && (
                <div>
                  <div style={{ ...miniLabel, marginBottom: 6 }}>Lucas's note</div>
                  <p style={{
                    margin: 0, fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
                    fontSize: 14, lineHeight: 1.55, color: RPAL.INK,
                    textWrap: 'pretty', maxWidth: 540,
                    borderLeft: `2px solid ${RPAL.ACCENT}`, paddingLeft: 12,
                  }}>{activeBook.note}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{
            gridColumn: '1 / -1', alignSelf: 'center', justifySelf: 'center',
            color: RPAL.INK3, fontSize: 14, fontStyle: 'italic',
          }}>Click a spine to pull a book — or hit Shuffle.</div>
        )}
      </div>

      {/* Quiet footer */}
      <div style={{
        marginTop: 22, textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: RPAL.INK3, letterSpacing: '0.06em',
      }}>
        <a href={DOUBAN_URL} target="_blank" rel="noreferrer" style={{ color: RPAL.INK2 }}>
          full library on Douban ↗
        </a>
      </div>
    </ReadingFrame>
  );
}

// DecorRow is no longer used after all three shelves became real books, but
// kept here in case we want to flank the shelves with ambient rows later.
function DecorRow({ spines }) {
  return (
    <div style={{ position: 'relative', height: 220 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 1,
        height: 206, padding: '0 28px', filter: 'brightness(0.86) saturate(0.9)',
      }}>
        {spines.map(s => (
          <div key={s.key} style={{
            width: s.w, height: s.h,
            background: s.palette.bg, flexShrink: 0, position: 'relative',
            boxShadow: 'inset -2px 0 rgba(0,0,0,.22), inset 2px 0 rgba(255,255,255,.04)',
          }}>
            {s.band && (
              <div style={{
                position: 'absolute', top: 14, left: 4, right: 4,
                height: 2, background: s.palette.rule, opacity: 0.55,
              }} />
            )}
          </div>
        ))}
      </div>
      <ShelfBoard />
    </div>
  );
}

function UserRow({ books, order, active, setActive }) {
  return (
    <div style={{ position: 'relative', height: 240 }}>
      <div style={{
        height: 226, overflowX: 'auto', overflowY: 'hidden',
        padding: '0 28px',
        scrollbarWidth: 'thin', scrollbarColor: '#5a4630 #3b2f24',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-end', gap: 1,
          height: 226, width: 'max-content',
        }}>
          {order.map(idx => {
            const b = books[idx];
            const variance = hashStr(b.title) % 24;
            return (
              <BookSpine
                key={idx}
                book={b}
                height={196 + variance}
                active={active === idx}
                onClick={() => setActive(active === idx ? null : idx)}
              />
            );
          })}
        </div>
      </div>
      <ShelfBoard />
    </div>
  );
}

function ShelfBoard() {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, height: 14,
      background: 'linear-gradient(180deg, #5a4630 0%, #3e2f1d 60%, #2a1f12 100%)',
      boxShadow: '0 2px 4px rgba(0,0,0,.4)',
    }} />
  );
}

// ─── Variant 1 — Shuffle Card (simple) ──────────────────────────────────────
function ReadingShuffle({ books = BOOKS }) {
  const [i, setI] = React.useState(0);
  const [phase, setPhase] = React.useState('in');
  const b = books[i];

  function go(next) {
    setPhase('out');
    setTimeout(() => { setI(next); setPhase('in'); }, 180);
  }
  function shuffle() {
    let n = i; while (n === i) n = Math.floor(Math.random() * books.length); go(n);
  }
  const prev = () => go((i - 1 + books.length) % books.length);
  const next = () => go((i + 1) % books.length);

  return (
    <ReadingFrame
      n="03"
      title="Reading"
      hint="A pull from my reading log. Hit shuffle for another.">
      <div style={{
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48,
        padding: '48px 52px', background: RPAL.PAPER,
        border: `1px solid ${RPAL.RULE}`,
        transition: 'opacity .18s',
        opacity: phase === 'in' ? 1 : 0,
        minHeight: 440, alignItems: 'center',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BookCover book={b} height={400} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: RPAL.INK3, letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 14, display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <span>Read {b.date}</span>
            {b.favorite && (
              <span style={{ color: RPAL.ACCENT, border: `1px solid ${RPAL.ACCENT}`, padding: '2px 6px' }}>★ Favorite</span>
            )}
          </div>
          <h3 style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: 28,
            lineHeight: 1.15, margin: '0 0 6px', color: RPAL.INK,
            letterSpacing: '-0.02em', textWrap: 'pretty',
          }}>{b.title}</h3>
          <div style={{
            fontSize: 16, color: RPAL.INK2,
            fontStyle: 'italic', fontFamily: "'EB Garamond', serif",
          }}>{b.author}</div>

          <div style={{
            marginTop: 22, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap',
          }}>
            <span style={miniLabel}>My rating</span>
            <StarRating rating={b.rating} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: RPAL.INK3 }}>
              {b.rating} / 5
            </span>
          </div>

          {b.note && (
            <div style={{ marginTop: 22 }}>
              <div style={{ ...miniLabel, marginBottom: 8 }}>Lucas's note</div>
              <p style={{
                margin: 0, fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, lineHeight: 1.55, color: RPAL.INK,
                textWrap: 'pretty', maxWidth: 480,
                borderLeft: `2px solid ${RPAL.ACCENT}`, paddingLeft: 14,
              }}>{b.note}</p>
            </div>
          )}
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: 22,
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: RPAL.INK3, letterSpacing: '0.06em',
        }}>
          {String(i + 1).padStart(2, '0')} / {String(books.length).padStart(2, '0')} shown ·{' '}
          <a href={DOUBAN_URL} target="_blank" rel="noreferrer" style={{ color: RPAL.INK2 }}>
            {DOUBAN_TOTAL}+ on Douban ↗
          </a>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={prev} style={readingBtn('ghost')} aria-label="previous">←</button>
          <button onClick={shuffle} style={readingBtn('solid')}>↻ Shuffle</button>
          <button onClick={next} style={readingBtn('ghost')} aria-label="next">→</button>
        </div>
      </div>
    </ReadingFrame>
  );
}

// ─── Variant 3 — Reading Log ─────────────────────────────────────────────────
function ReadingLog({ books = BOOKS }) {
  const [filter, setFilter] = React.useState('noted');
  const noted = books.filter(b => b.hasNote);
  const favs  = books.filter(b => b.favorite);
  const list = filter === 'fav' ? favs : filter === 'noted' ? noted : books;

  return (
    <ReadingFrame
      n="03"
      title="Reading"
      hint={`A log of what I've been reading. ${books.length} books total — ${noted.length} with a note from me. Newest first; commented books shown by default.`}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <FilterPill active={filter === 'noted'} onClick={() => setFilter('noted')}>
          ✎ Commented ({noted.length})
        </FilterPill>
        <FilterPill active={filter === 'fav'} onClick={() => setFilter('fav')}>
          ★ Favorites ({favs.length})
        </FilterPill>
        <FilterPill active={filter === 'all'} onClick={() => setFilter('all')}>
          All ({books.length})
        </FilterPill>
      </div>

      <div style={{
        maxHeight: 1200, overflowY: 'auto',
        border: `1px solid ${RPAL.RULE}`, background: RPAL.PAPER,
        scrollbarWidth: 'thin',
      }}>
        <ul style={{ listStyle: 'none', padding: '0 24px', margin: 0 }}>
          {list.map((b, i) => (
            <li key={(b.douban || b.title) + i} style={{
              display: 'grid',
              gridTemplateColumns: '76px 56px 1fr auto',
              gap: 24, padding: '20px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${RPAL.RULE}`,
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: RPAL.INK3, letterSpacing: '0.06em',
              }}>{b.date || '—'}</span>
              <BookCover book={b} height={72} />
              <div style={{ minWidth: 0 }}>
                <div style={{
                  fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif", fontWeight: 500,
                  fontSize: 16, color: RPAL.INK, letterSpacing: '-0.005em',
                  display: 'inline-flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap',
                }}>
                  {b.douban
                    ? <a href={b.douban} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{b.title}</a>
                    : b.title}
                  {b.favorite && (
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: RPAL.ACCENT, letterSpacing: '0.12em', textTransform: 'uppercase',
                      border: `1px solid ${RPAL.ACCENT}`, padding: '2px 6px',
                    }}>★ Fav</span>
                  )}
                </div>
                <div style={{
                  fontSize: 13, color: RPAL.INK3, marginTop: 2,
                  fontStyle: 'italic', fontFamily: "'EB Garamond', 'Noto Serif SC', serif",
                }}>{b.author}</div>
                {b.note && (
                  <div style={{
                    fontSize: 14, color: RPAL.INK2, marginTop: 8,
                    fontFamily: "'DM Sans', 'Noto Sans SC', sans-serif",
                    lineHeight: 1.55, textWrap: 'pretty', maxWidth: 720,
                    borderLeft: `2px solid ${RPAL.ACCENT}`, paddingLeft: 12,
                  }}>{b.note}</div>
                )}
              </div>
              <Stars rating={b.rating} size={4} />
            </li>
          ))}
        </ul>
      </div>

      <div style={{
        marginTop: 18,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: RPAL.INK3, letterSpacing: '0.08em', textTransform: 'uppercase',
        textAlign: 'center',
      }}>
        Showing {list.length} of {books.length} ·{' '}
        <a href={DOUBAN_URL} target="_blank" rel="noreferrer" style={{ color: RPAL.ACCENT }}>
          full library on Douban ↗
        </a>
      </div>
    </ReadingFrame>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
      padding: '8px 14px', cursor: 'pointer',
      background: active ? RPAL.INK : 'transparent',
      color: active ? RPAL.PAPER : RPAL.INK2,
      border: `1px solid ${active ? RPAL.INK : RPAL.RULE}`,
      letterSpacing: '-0.005em',
      transition: 'background .12s, color .12s',
    }}>{children}</button>
  );
}

Object.assign(window, {
  BOOKS, BookCover, BookSpine, Stars,
  ReadingShuffle, ReadingShelf, ReadingLog,
});

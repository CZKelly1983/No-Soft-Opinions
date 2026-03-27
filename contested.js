/* ============================================================
   NO SOFT OPINIONS: CINEMA
   contested.js — Most Contested films page
   All six framework gap directions + volatility index
   ============================================================ */

(function () {
  'use strict';

  const GAP_THRESHOLD = 8; // minimum gap to appear in directional views
  const DEFAULT_SHOW = 50;

  let allFilms = [];
  let currentMode = 'volatility';

  fetch('films.json')
    .then(r => r.json())
    .then(data => {
      allFilms = data;
      document.getElementById('gap-filter').addEventListener('change', e => {
        currentMode = e.target.value;
        render();
      });
      render();
    })
    .catch(() => {
      document.getElementById('contested-container').innerHTML =
        '<div class="loading">Could not load film data.</div>';
    });

  function render() {
    let films = [];

    if (currentMode === 'volatility') {
      films = [...allFilms]
        .filter(f => f.volatility_index != null)
        .sort((a, b) => b.volatility_index - a.volatility_index)
        .slice(0, DEFAULT_SHOW);
    } else {
      films = [...allFilms]
        .filter(f => f.gaps && f.gaps[currentMode] != null && f.gaps[currentMode] >= GAP_THRESHOLD)
        .sort((a, b) => b.gaps[currentMode] - a.gaps[currentMode])
        .slice(0, DEFAULT_SHOW);
    }

    document.getElementById('contested-count').textContent =
      `Showing top ${films.length}`;

    if (films.length === 0) {
      document.getElementById('contested-container').innerHTML =
        '<div class="empty-state"><span class="gold" style="font-family:var(--font-display);font-size:1.5rem;">No results</span><p>No films meet this gap threshold.</p></div>';
      return;
    }

    const modeLabels = {
      volatility:   { a: null, b: null, desc: 'Overall spread between all three framework scores' },
      f2_minus_f1:  { a: 'F2 Filmmaker', b: 'F1 Popular',   desc: 'Films the industry prizes that audiences passed over' },
      f1_minus_f2:  { a: 'F1 Popular',   b: 'F2 Filmmaker', desc: 'Films audiences embraced that filmmakers rate lower' },
      f3_minus_f1:  { a: 'F3 Long View', b: 'F1 Popular',   desc: 'Films history is elevating above their original popularity' },
      f1_minus_f3:  { a: 'F1 Popular',   b: 'F3 Long View', desc: 'Films that dominated their moment but aren\'t ageing as well' },
      f3_minus_f2:  { a: 'F3 Long View', b: 'F2 Filmmaker', desc: 'Films history rates higher than the filmmaker consensus' },
      f2_minus_f3:  { a: 'F2 Filmmaker', b: 'F3 Long View', desc: 'Films the industry prizes but whose long-term standing is lower' },
    };

    const mode = modeLabels[currentMode];

    const container = document.getElementById('contested-container');

    // Intro context line
    const intro = `
      <p style="font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono); margin-bottom:1.5rem; letter-spacing:0.02em;">
        ${mode.desc}
      </p>`;

    const cards = films.map((f, i) => {
      const fw = f.frameworks;
      const gaps = f.gaps || {};

      // Build the three framework rows, highlighting the relevant gap
      const f1Val = fw.f1_popular_verdict;
      const f2Val = fw.f2_filmmakers_film;
      const f3Val = fw.f3_long_view;

      const gapVal = currentMode === 'volatility'
        ? f.volatility_index
        : gaps[currentMode];

      // Determine the two frameworks in play for directional modes
      const highlights = {
        f2_minus_f1: ['f2', 'f1'],
        f1_minus_f2: ['f1', 'f2'],
        f3_minus_f1: ['f3', 'f1'],
        f1_minus_f3: ['f1', 'f3'],
        f3_minus_f2: ['f3', 'f2'],
        f2_minus_f3: ['f2', 'f3'],
      };
      const hl = highlights[currentMode] || [];

      // Brief contextual note based on gap
      const contextNote = buildContextNote(f, currentMode, gapVal);

      return `
        <div class="contested-card" style="margin-bottom:1rem;">
          <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
            <div>
              <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.3rem;">
                #${i + 1} · Overall rank #${f.rank}
              </div>
              <div class="contested-card-title">${escHtml(f.title)}</div>
              <div class="contested-card-meta">${f.year} · ${escHtml(f.genre)} · Final score: ${f.final_score}</div>
            </div>
            <div style="text-align:right; flex-shrink:0;">
              <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.2rem;">
                ${currentMode === 'volatility' ? 'Volatility Index' : 'Gap'}
              </div>
              <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:var(--gold); line-height:1;">
                ${gapVal != null ? gapVal.toFixed(1) : '—'}
              </div>
            </div>
          </div>

          <!-- Framework bars -->
          <div style="margin:1.25rem 0 1rem; display:flex; flex-direction:column; gap:0.6rem;">
            ${frameworkBar('F1 Popular',   f1Val, 'f1', hl.includes('f1'))}
            ${frameworkBar('F2 Filmmaker', f2Val, 'f2', hl.includes('f2'))}
            ${frameworkBar('F3 Long View', f3Val, 'f3', hl.includes('f3'))}
          </div>

          ${contextNote ? `<p class="contested-note">${contextNote}</p>` : ''}
        </div>`;
    }).join('');

    container.innerHTML = intro + `<div>${cards}</div>`;
  }

  function frameworkBar(label, val, cls, highlighted) {
    if (val == null) return '';
    const opacity = highlighted || true; // always show, highlight via weight
    const weight = highlighted ? '600' : '400';
    return `
      <div class="framework-row" style="opacity:${highlighted ? '1' : '0.6'};">
        <span class="framework-label ${cls}" style="font-weight:${weight};">${label}</span>
        <div class="framework-bar-track">
          <div class="framework-bar-fill ${cls}" style="width:${val}%;"></div>
        </div>
        <span class="framework-val ${cls}" style="font-weight:${weight};">${val}</span>
      </div>`;
  }

  function buildContextNote(f, mode, gapVal) {
    if (!gapVal) return '';
    const d = f.dimensions;
    const fw = f.frameworks;

    // Pull the most useful dimension note for this gap direction
    // Priority: D5 for filmmaker gaps, D6 for cultural gaps, D7 for trajectory gaps
    const d5 = trimNote(d.d5_note);
    const d6 = trimNote(d.d6_note);
    const d7 = trimNote(d.d7_note);
    const d2 = trimNote(d.d2_note);

    switch (mode) {
      case 'volatility': {
        // Lead with the most specific note available
        const specific = d5 || d6 || d2;
        if (specific) return `${specific} The gap between its highest and lowest framework score is ${f.max_gap} points.`;
        return `Framework spread of ${f.max_gap} points — the three philosophical positions on cinematic value are in genuine disagreement here.`;
      }

      case 'f2_minus_f1': {
        // Filmmaker influence note is the most relevant
        if (d5) return `D5 Filmmaker Influence: ${d5}`;
        if (d6) return `${d6} — absorbed into cinema without reaching the wider culture.`;
        return `Filmmaker esteem ${gapVal.toFixed(1)} points above popular verdict. Its significance is felt primarily inside film culture.`;
      }

      case 'f1_minus_f2': {
        // D6 cultural note or D2 audience note most relevant
        if (d6 && !isGeneric(d6)) return `${d6} Popular reach ${gapVal.toFixed(1)} points above the filmmaker consensus.`;
        if (d2 && !isGeneric(d2)) return `${d2} The audience response was real. The filmmaker community rates it differently.`;
        return `Popular verdict ${gapVal.toFixed(1)} points above filmmaker esteem. Built for audiences rather than for cinema.`;
      }

      case 'f3_minus_f1': {
        // D7 longevity and D4 reassessment most relevant
        const d4 = trimNote(d.d4_note);
        if (d4 && !isGeneric(d4)) return `${d4} History has been more generous than the original popular reception.`;
        if (d7 && !isGeneric(d7)) return `${d7} Critical reassessment is outpacing what the original release suggested.`;
        return `Long view ${gapVal.toFixed(1)} points above popular verdict. A film history is still catching up with.`;
      }

      case 'f1_minus_f3': {
        // D7 trajectory and D6 cultural note most relevant
        if (d7 && !isGeneric(d7)) return `${d7} Popular verdict ${gapVal.toFixed(1)} points above what the long view awards it.`;
        if (d6 && !isGeneric(d6)) return `${d6} It dominated its moment. The long view score of ${fw.f3_long_view} is the index's verdict on how much of that remains.`;
        return `Popular verdict ${gapVal.toFixed(1)} points above the long view. Built for its moment. Whether it outlasts it is the open question.`;
      }

      case 'f3_minus_f2': {
        const d4 = trimNote(d.d4_note);
        if (d4 && !isGeneric(d4)) return `${d4} History rating it ${gapVal.toFixed(1)} points above the filmmaker consensus.`;
        if (d7 && !isGeneric(d7)) return `${d7} The long view is proving more generous than the industry's own assessment.`;
        return `Long view ${gapVal.toFixed(1)} points above filmmaker score. Critical history is outpacing peer recognition.`;
      }

      case 'f2_minus_f3': {
        if (d5 && !isGeneric(d5)) return `${d5} Filmmaker esteem ${gapVal.toFixed(1)} points above the long view — influence that hasn't fully translated into lasting critical standing.`;
        if (d7 && !isGeneric(d7)) return `${d7} Strong filmmaker regard that the long view hasn't yet confirmed.`;
        return `Filmmaker score ${gapVal.toFixed(1)} points above the long view. Respected inside cinema more than history has yet settled.`;
      }

      default:
        return '';
    }
  }

  // Trim a note to a clean sentence-length excerpt
  function trimNote(note) {
    if (!note) return '';
    const clean = note.trim();
    // Skip pure flag letters or very short generic entries
    if (clean.length < 8) return '';
    // Trim to first sentence or 120 chars
    const firstStop = clean.search(/[.!?]/);
    if (firstStop > 20 && firstStop < 130) return clean.slice(0, firstStop + 1);
    if (clean.length > 120) return clean.slice(0, 120).replace(/\s\S+$/, '') + '…';
    return clean;
  }

  // Detect notes that are too generic to be useful
  function isGeneric(note) {
    if (!note) return true;
    const lower = note.toLowerCase();
    const genericPhrases = [
      'franchise exhaustion', 'franchise continuation', 'franchise fatigue',
      'minimal positive cultural', 'minimal cultural', 'minimal',
      'franchise nadir', 'provisional', 'mcu sequel', 'animated sequel',
      'children\'s sequel', 'bay spectacle'
    ];
    return genericPhrases.some(p => lower.includes(p) && note.length < 50);
  }

  function escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();

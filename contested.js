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
    const fw = f.frameworks;
    const title = f.title;

    switch (mode) {
      case 'volatility':
        return `The three frameworks disagree by ${gapVal.toFixed(1)} points on average — one of the widest spreads in the index. The gap between its highest and lowest framework score is ${f.max_gap} points.`;

      case 'f2_minus_f1':
        return `Filmmakers and critics rate ${escHtml(title)} ${gapVal.toFixed(1)} points higher than the popular verdict suggests. Its craft and influence register more strongly in film culture than in box office or audience reach.`;

      case 'f1_minus_f2':
        return `Audiences gave ${escHtml(title)} ${gapVal.toFixed(1)} points more than the filmmaker consensus. Its popular reach significantly outpaces its standing as a filmmaker's reference point.`;

      case 'f3_minus_f1':
        return `History is elevating ${escHtml(title)} ${gapVal.toFixed(1)} points above what its original popularity suggested. Critical reassessment and longevity are working in its favour.`;

      case 'f1_minus_f3':
        return `${escHtml(title)} scored ${gapVal.toFixed(1)} points higher on popular verdict than the long view awards it. It dominated its moment. The question is whether it lasts.`;

      case 'f3_minus_f2':
        return `The long view rates ${escHtml(title)} ${gapVal.toFixed(1)} points above the filmmaker consensus. History is proving more generous than the industry's own assessment.`;

      case 'f2_minus_f3':
        return `Filmmakers rate ${escHtml(title)} ${gapVal.toFixed(1)} points above its long-view score. Strong industry influence that hasn't yet fully translated into lasting critical standing.`;

      default:
        return '';
    }
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

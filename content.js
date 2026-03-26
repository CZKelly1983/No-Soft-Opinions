/* ============================================================
   NO SOFT OPINIONS: CINEMA
   content.js — Content But No Legacy page
   Films where F1 (Popular Verdict) >> F3 (Long View)
   ============================================================ */

(function () {
  'use strict';

  const GAP_THRESHOLD = 10; // F1 must exceed F3 by at least this much

  fetch('films.json')
    .then(r => r.json())
    .then(data => {
      const noLegacy = data
        .filter(f => f.gaps && f.gaps.f1_minus_f3 != null && f.gaps.f1_minus_f3 >= GAP_THRESHOLD)
        .sort((a, b) => b.gaps.f1_minus_f3 - a.gaps.f1_minus_f3);

      render(noLegacy);
    })
    .catch(() => {
      document.getElementById('content-container').innerHTML =
        '<div class="loading">Could not load film data.</div>';
    });

  function render(films) {
    const container = document.getElementById('content-container');

    // Summary stats
    const avgGap = films.reduce((s, f) => s + f.gaps.f1_minus_f3, 0) / films.length;

    // Decade distribution
    const decades = {};
    films.forEach(f => { decades[f.decade] = (decades[f.decade] || 0) + 1; });
    const topDecade = Object.entries(decades).sort((a, b) => b[1] - a[1])[0];

    // Genre distribution
    const genres = {};
    films.forEach(f => { genres[f.genre] = (genres[f.genre] || 0) + 1; });
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0];

    container.innerHTML = `
      <!-- Stats -->
      <div style="display:flex; gap:2rem; flex-wrap:wrap; margin-bottom:2.5rem; padding-bottom:2rem; border-bottom:1px solid var(--border);">
        <div class="stat-item">
          <div class="stat-value">${films.length}</div>
          <div class="stat-label">Films</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${avgGap.toFixed(1)}</div>
          <div class="stat-label">Avg F1/F3 Gap</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${topGenre[0]}</div>
          <div class="stat-label">Most Common Genre</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${topDecade[0]}</div>
          <div class="stat-label">Most Common Decade</div>
        </div>
      </div>

      <!-- Film list -->
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:1rem;">
        ${films.map((f, i) => filmCard(f, i)).join('')}
      </div>
    `;
  }

  function filmCard(f, i) {
    const gap = f.gaps.f1_minus_f3;
    const f1 = f.frameworks.f1_popular_verdict;
    const f2 = f.frameworks.f2_filmmakers_film;
    const f3 = f.frameworks.f3_long_view;
    const d7 = f.dimensions.d7_longevity_trajectory;

    const note = buildNote(f, gap);

    // Trajectory indicator
    const trajectoryColor = d7 >= 60 ? 'var(--f3-color)' : d7 >= 40 ? 'var(--text-muted)' : 'var(--f2-color)';
    const trajectoryLabel = d7 >= 60 ? 'Rising' : d7 >= 40 ? 'Stable' : 'Fading';

    return `
      <div class="contested-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
          <div>
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.3rem;">#${i + 1} · Overall rank #${f.rank}</div>
            <div class="contested-card-title">${escHtml(f.title)}</div>
            <div class="contested-card-meta">${f.year} · ${escHtml(f.genre)}</div>
          </div>
          <div style="text-align:right; flex-shrink:0;">
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.2rem;">F1 over F3</div>
            <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:var(--f1-color); line-height:1;">+${gap.toFixed(1)}</div>
          </div>
        </div>

        <div style="margin:1.25rem 0 1rem; display:flex; flex-direction:column; gap:0.6rem;">
          <div class="framework-row">
            <span class="framework-label f1" style="font-weight:600;">F1 Popular</span>
            <div class="framework-bar-track"><div class="framework-bar-fill f1" style="width:${f1}%;"></div></div>
            <span class="framework-val f1" style="font-weight:600;">${f1}</span>
          </div>
          <div class="framework-row" style="opacity:0.65;">
            <span class="framework-label f2">F2 Filmmaker</span>
            <div class="framework-bar-track"><div class="framework-bar-fill f2" style="width:${f2}%;"></div></div>
            <span class="framework-val f2">${f2}</span>
          </div>
          <div class="framework-row" style="opacity:0.55;">
            <span class="framework-label f3">F3 Long View</span>
            <div class="framework-bar-track"><div class="framework-bar-fill f3" style="width:${f3}%;"></div></div>
            <span class="framework-val f3">${f3}</span>
          </div>
        </div>

        <!-- Longevity trajectory -->
        ${d7 != null ? `
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.75rem; font-family:var(--font-mono); font-size:0.7rem;">
          <span style="color:var(--text-muted);">Longevity trajectory:</span>
          <span style="color:${trajectoryColor}; font-weight:500;">${trajectoryLabel} (${d7})</span>
        </div>` : ''}

        ${note ? `<p class="contested-note">${note}</p>` : ''}
      </div>`;
  }

  function buildNote(f, gap) {
    const f1 = f.frameworks.f1_popular_verdict;
    const f3 = f.frameworks.f3_long_view;
    const d1 = f.dimensions.d1_box_office;
    const d7 = f.dimensions.d7_longevity_trajectory;
    const title = f.title;

    // Recent films — jury still out
    if (f.year >= 2015 && gap >= 10) {
      return `Released ${f.year}. Popular verdict of ${f1} against a long view of ${f3}. Still early — the trajectory score of ${d7 ?? '?'} will tell the story over the next decade.`;
    }

    // Very high box office, low long view
    if (d1 >= 80 && f3 < 45) {
      return `Box office score of ${d1} — a genuine commercial phenomenon. Long view of ${f3} suggests the event didn't translate into lasting critical or cultural presence.`;
    }

    // Large gap
    if (gap >= 18) {
      return `A ${gap.toFixed(1)}-point gap between popular verdict and long view — one of the widest in the index. Built for its moment. The moment has moved on.`;
    }

    // Franchise films
    if (['Superhero', 'Action'].includes(f.genre) && gap >= 12) {
      return `Popular verdict of ${f1} driven by franchise momentum and event-cinema box office. Long view of ${f3} reflects how far that momentum has carried into lasting critical standing.`;
    }

    return `Popular verdict of ${f1} against a long view of ${f3}. The ${gap.toFixed(1)}-point gap is the measure of the distance between what it meant in its moment and what it means now.`;
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

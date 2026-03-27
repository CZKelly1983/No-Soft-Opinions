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
    const d = f.dimensions;
    const f1 = f.frameworks.f1_popular_verdict;
    const f3 = f.frameworks.f3_long_view;

    // Priority: D6 cultural note (most specific to why the legacy gap exists),
    // then D7 trajectory note, then D2 audience note
    const d6 = trimNote(d.d6_note);
    const d7 = trimNote(d.d7_note);
    const d2 = trimNote(d.d2_note);

    // D6 often has the specific cultural moment — use it if substantive and not generic
    if (d6 && d6.length > 25 && !isGeneric(d6)) {
      return d7 && !isGeneric(d7)
        ? `${d6} ${d7}.`
        : d6;
    }

    // D7 trajectory note is the direct measure of the legacy gap
    if (d7 && d7.length > 20 && !isGeneric(d7)) return d7;

    // D2 audience note for audience-specific observations
    if (d2 && d2.length > 20 && !isGeneric(d2)) {
      return `${d2} Popular verdict of ${f1} against a long view of ${f3}.`;
    }

    // Score-based fallback — at least specific to this film's numbers
    if (f.year >= 2015) {
      return `Released ${f.year}. Popular verdict of ${f1} against a long view of ${f3}. Longevity trajectory score of ${d.d7_longevity_trajectory ?? '?'} — still too early to call.`;
    }
    if (d.d1_box_office >= 80 && f3 < 45) {
      return `Box office score of ${d.d1_box_office}. Long view of ${f3} is the index's verdict on what that commercial weight left behind.`;
    }
    return `Popular verdict of ${f1} against a long view of ${f3}. The ${gap.toFixed(1)}-point gap is the distance between what it meant then and what it means now.`;
  }

  function trimNote(note) {
    if (!note) return '';
    const clean = note.trim();
    if (clean.length < 8) return '';
    const stripped = clean.replace(/^[A-Z+]+:\s*/, '');
    // Take up to first sentence break, but not too short
    const firstStop = stripped.search(/[.!?]/);
    if (firstStop > 20 && firstStop < 130) return stripped.slice(0, firstStop + 1);
    if (stripped.length > 120) return stripped.slice(0, 120).replace(/\s\S+$/, '') + '…';
    return stripped;
  }

  function isGeneric(note) {
    if (!note) return true;
    const lower = note.toLowerCase();
    const genericPhrases = [
      'franchise exhaustion', 'franchise continuation', 'franchise fatigue',
      'franchise nadir', 'minimal positive cultural', 'minimal cultural',
      'minimal', 'provisional', 'mcu sequel', 'animated sequel',
      'children\'s sequel', 'bay spectacle', 'franchise disappointment',
      'franchise dated', 'mcu disappointment'
    ];
    // Only flag as generic if the note is short AND matches
    return note.length < 55 && genericPhrases.some(p => lower.includes(p));
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

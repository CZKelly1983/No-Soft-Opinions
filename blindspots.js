/* ============================================================
   NO SOFT OPINIONS: CINEMA
   blindspots.js — Institutional Blind Spots page
   Films where F2 (Filmmaker's Film) >> F1 (Popular Verdict)
   ============================================================ */

(function () {
  'use strict';

  const GAP_THRESHOLD = 10; // F2 must exceed F1 by at least this much

  fetch('films.json')
    .then(r => r.json())
    .then(data => {
      const blindspots = data
        .filter(f => f.gaps && f.gaps.f2_minus_f1 != null && f.gaps.f2_minus_f1 >= GAP_THRESHOLD)
        .sort((a, b) => b.gaps.f2_minus_f1 - a.gaps.f2_minus_f1);

      render(blindspots);
    })
    .catch(() => {
      document.getElementById('blindspots-container').innerHTML =
        '<div class="loading">Could not load film data.</div>';
    });

  function render(films) {
    const container = document.getElementById('blindspots-container');

    // Summary stats
    const avgGap = films.reduce((s, f) => s + f.gaps.f2_minus_f1, 0) / films.length;
    const genres = {};
    films.forEach(f => { genres[f.genre] = (genres[f.genre] || 0) + 1; });
    const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0];

    container.innerHTML = `
      <!-- Stats -->
      <div style="display:flex; gap:2rem; flex-wrap:wrap; margin-bottom:2.5rem; padding-bottom:2rem; border-bottom:1px solid var(--border);">
        <div class="stat-item">
          <div class="stat-value">${films.length}</div>
          <div class="stat-label">Blind Spot Films</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${avgGap.toFixed(1)}</div>
          <div class="stat-label">Avg F2/F1 Gap</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${topGenre[0]}</div>
          <div class="stat-label">Most Common Genre</div>
        </div>
      </div>

      <!-- Intro argument -->
      <div style="max-width:65ch; margin-bottom:2.5rem;">
        <p style="font-size:0.9rem; line-height:1.8; color:var(--text-secondary);">
          These ${films.length} films represent a specific kind of cultural disconnect. Their F2 Filmmaker score exceeds their F1 Popular Verdict by at least ${GAP_THRESHOLD} points — meaning the film industry, film schools, and critical culture have absorbed and valued them far more than general audiences have. They are not obscure failures. Many are ranked among the greatest films ever made. They simply exist almost entirely within specialist film culture, largely invisible to the mainstream.
        </p>
        <p style="font-size:0.9rem; line-height:1.8; color:var(--text-secondary); margin-top:0.75rem;">
          The gap is also a measure of what AI knows that popular culture doesn't register. These are films Claude can discuss in depth — their techniques, their influence, their place in the canon — but cannot fully interpret, because interpreting them requires the kind of cultural encounter that only happens in the dark of a cinema or a film school screening room.
        </p>
      </div>

      <!-- Film list -->
      <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap:1rem;">
        ${films.map((f, i) => filmCard(f, i)).join('')}
      </div>
    `;
  }

  function filmCard(f, i) {
    const gap = f.gaps.f2_minus_f1;
    const f1 = f.frameworks.f1_popular_verdict;
    const f2 = f.frameworks.f2_filmmakers_film;
    const f3 = f.frameworks.f3_long_view;

    // Contextual note
    const note = buildNote(f, gap);

    return `
      <div class="contested-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:1rem;">
          <div>
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.3rem;">#${i + 1} blind spot · Overall rank #${f.rank}</div>
            <div class="contested-card-title">${escHtml(f.title)}</div>
            <div class="contested-card-meta">${f.year} · ${escHtml(f.genre)}</div>
          </div>
          <div style="text-align:right; flex-shrink:0;">
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.2rem;">F2 over F1</div>
            <div style="font-family:var(--font-display); font-size:1.8rem; font-weight:900; color:var(--f2-color); line-height:1;">+${gap.toFixed(1)}</div>
          </div>
        </div>

        <div style="margin:1.25rem 0 1rem; display:flex; flex-direction:column; gap:0.6rem;">
          <div class="framework-row" style="opacity:0.55;">
            <span class="framework-label f1">F1 Popular</span>
            <div class="framework-bar-track"><div class="framework-bar-fill f1" style="width:${f1}%;"></div></div>
            <span class="framework-val f1">${f1}</span>
          </div>
          <div class="framework-row">
            <span class="framework-label f2" style="font-weight:600;">F2 Filmmaker</span>
            <div class="framework-bar-track"><div class="framework-bar-fill f2" style="width:${f2}%;"></div></div>
            <span class="framework-val f2" style="font-weight:600;">${f2}</span>
          </div>
          <div class="framework-row" style="opacity:0.75;">
            <span class="framework-label f3">F3 Long View</span>
            <div class="framework-bar-track"><div class="framework-bar-fill f3" style="width:${f3}%;"></div></div>
            <span class="framework-val f3">${f3}</span>
          </div>
        </div>

        ${note ? `<p class="contested-note">${note}</p>` : ''}
      </div>`;
  }

  function buildNote(f, gap) {
    const d = f.dimensions;
    const f1 = f.frameworks.f1_popular_verdict;
    const f2 = f.frameworks.f2_filmmakers_film;

    // D5 filmmaker influence note is the primary source — this is exactly what
    // the blind spot gap is measuring. Use it directly if it's substantive.
    const d5 = trimNote(d.d5_note);
    const d6 = trimNote(d.d6_note);
    const d2 = trimNote(d.d2_note);

    if (d5 && d5.length > 20) return d5;
    if (d6 && d6.length > 20 && !isGeneric(d6)) return `${d6} Its influence on cinema is larger than its cultural penetration suggests.`;
    if (d2 && d2.length > 20 && !isGeneric(d2)) return `${d2} — a film with devoted specialist audiences whose reach ends at the edge of that world.`;

    // Fallback: specific observation from the scores
    if (gap >= 20) return `A ${gap.toFixed(1)}-point gap between filmmaker esteem (${f2}) and popular verdict (${f1}) — one of the widest disconnects in the entire index.`;
    if (d.d5_filmmaker_influence >= 85) return `Filmmaker influence score of ${d.d5_filmmaker_influence} against a popular verdict of ${f1}. Studied everywhere, seen by relatively few.`;
    return `F2 of ${f2} against a popular verdict of ${f1}. Its significance lives inside cinema rather than in the culture around it.`;
  }

  function trimNote(note) {
    if (!note) return '';
    const clean = note.trim();
    if (clean.length < 8) return '';
    // Strip leading codes like "F:", "F+C:", "F+X:" etc
    const stripped = clean.replace(/^[A-Z+]+:\s*/, '');
    const firstStop = stripped.search(/[.!?]/);
    if (firstStop > 20 && firstStop < 140) return stripped.slice(0, firstStop + 1);
    if (stripped.length > 130) return stripped.slice(0, 130).replace(/\s\S+$/, '') + '…';
    return stripped;
  }

  function isGeneric(note) {
    if (!note) return true;
    const lower = note.toLowerCase();
    const genericPhrases = ['within serious film culture', 'within feminist film culture',
      'within documentary', 'within experimental', 'limited broader', 'minimal'];
    return genericPhrases.some(p => lower.startsWith(p));
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

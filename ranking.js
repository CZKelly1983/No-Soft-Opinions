/* ============================================================
   NO SOFT OPINIONS: CINEMA
   ranking.js — Full interactive ranking page
   ============================================================ */

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  let allFilms = [];
  let filtered = [];
  let currentPage = 1;
  const PER_PAGE = 50;
  let sortKey = 'final_score';
  let expandedId = null;

  // ── Boot ───────────────────────────────────────────────────
  fetch('films.json')
    .then(r => r.json())
    .then(data => {
      allFilms = data;
      populateGenreFilter();
      bindControls();
      checkUrlHash();
      checkSessionFilters();
      applyFilters();
    })
    .catch(() => {
      document.getElementById('film-tbody').innerHTML =
        '<tr><td colspan="7" class="loading">Could not load film data. Make sure films.json is in the same directory.</td></tr>';
    });

  // ── Populate genre dropdown ────────────────────────────────
  function populateGenreFilter() {
    const genres = [...new Set(allFilms.map(f => f.genre))].sort();
    const sel = document.getElementById('filter-genre');
    genres.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      sel.appendChild(opt);
    });
  }

  // ── Bind controls ─────────────────────────────────────────
  function bindControls() {
    document.getElementById('search-input').addEventListener('input', debounce(() => {
      currentPage = 1;
      applyFilters();
    }, 200));

    ['filter-decade', 'filter-genre', 'filter-tier'].forEach(id => {
      document.getElementById(id).addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
      });
    });

    document.getElementById('sort-select').addEventListener('change', e => {
      sortKey = e.target.value;
      currentPage = 1;
      applyFilters();
    });
  }

  // ── Check sessionStorage for pre-filters from other pages ─
  function checkSessionFilters() {
    const decade = sessionStorage.getItem('nso-filter-decade');
    const genre = sessionStorage.getItem('nso-filter-genre');
    if (decade) {
      document.getElementById('filter-decade').value = decade;
      sessionStorage.removeItem('nso-filter-decade');
    }
    if (genre) {
      document.getElementById('filter-genre').value = genre;
      sessionStorage.removeItem('nso-filter-genre');
    }
  }

  // ── Check URL hash for direct film link ───────────────────
  function checkUrlHash() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#film-')) {
      const id = parseInt(hash.replace('#film-', ''));
      if (!isNaN(id)) {
        expandedId = id;
        // Find which page this film is on and jump there
        const idx = allFilms.findIndex(f => f.id === id);
        if (idx !== -1) {
          currentPage = Math.floor(idx / PER_PAGE) + 1;
        }
      }
    }
  }

  // ── Filter + sort + render ─────────────────────────────────
  function applyFilters() {
    const search = document.getElementById('search-input').value.toLowerCase().trim();
    const decade = document.getElementById('filter-decade').value;
    const genre = document.getElementById('filter-genre').value;
    const tier = document.getElementById('filter-tier').value;

    filtered = allFilms.filter(f => {
      if (search && !f.title.toLowerCase().includes(search)) return false;
      if (decade && f.decade !== decade) return false;
      if (genre && f.genre !== genre) return false;
      if (tier && getTier(f.final_score) !== tier) return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortKey) {
        case 'final_score':  return (b.final_score || 0) - (a.final_score || 0);
        case 'f1':           return (b.frameworks.f1_popular_verdict || 0) - (a.frameworks.f1_popular_verdict || 0);
        case 'f2':           return (b.frameworks.f2_filmmakers_film || 0) - (a.frameworks.f2_filmmakers_film || 0);
        case 'f3':           return (b.frameworks.f3_long_view || 0) - (a.frameworks.f3_long_view || 0);
        case 'volatility':   return (b.volatility_index || 0) - (a.volatility_index || 0);
        case 'year_asc':     return (a.year || 0) - (b.year || 0);
        case 'year_desc':    return (b.year || 0) - (a.year || 0);
        default:             return (b.final_score || 0) - (a.final_score || 0);
      }
    });

    // Update count
    document.getElementById('filter-count').textContent =
      `${filtered.length.toLocaleString()} film${filtered.length !== 1 ? 's' : ''}`;

    renderPage();
    renderPagination();
  }

  // ── Render current page of results ────────────────────────
  function renderPage() {
    const start = (currentPage - 1) * PER_PAGE;
    const page = filtered.slice(start, start + PER_PAGE);
    const tbody = document.getElementById('film-tbody');

    if (page.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7">
            <div class="empty-state">
              <span class="gold" style="font-family:var(--font-display); font-size:1.5rem;">No results</span>
              <p>No films match your current filters.</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = page.map((f, i) => {
      const globalRank = start + i + 1;
      const isExpanded = f.id === expandedId;
      const tier = getTier(f.final_score);

      return `
        <tr class="film-row${isExpanded ? ' expanded' : ''}"
            data-id="${f.id}"
            onclick="window.NSO.toggleFilm(${f.id})"
            id="film-${f.id}">
          <td class="film-rank">${globalRank}</td>
          <td class="film-title-cell">
            <div class="film-title">${escHtml(f.title)}</div>
            <div class="film-meta">${f.year} · ${escHtml(f.genre)} · <span class="${tierClass(tier)}" style="font-family:var(--font-mono); font-size:0.65rem;">${tier}</span></div>
          </td>
          <td class="film-score f1">${f.frameworks.f1_popular_verdict ?? '—'}</td>
          <td class="film-score f2">${f.frameworks.f2_filmmakers_film ?? '—'}</td>
          <td class="film-score f3">${f.frameworks.f3_long_view ?? '—'}</td>
          <td class="film-score final">${f.final_score ?? '—'}</td>
          <td class="film-volatility">${f.volatility_index ?? '—'}</td>
        </tr>
        <tr class="film-detail${isExpanded ? ' open' : ''}" id="detail-${f.id}">
          <td colspan="7">${renderDetail(f)}</td>
        </tr>`;
    }).join('');

    // Scroll to expanded film if coming from hash
    if (expandedId) {
      const el = document.getElementById(`film-${expandedId}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
      }
      expandedId = null;
    }
  }

  // ── Render expanded film detail ────────────────────────────
  // Map raw D1 flag notes to readable text
  function d1NoteText(raw, score) {
    if (!raw) return 'Box office performance, inflation-adjusted.';
    const trimmed = raw.trim();
    // If it's just a flag letter, replace with score-contextual text
    const flags = { 'H': null, 'M': null, 'L': null, 'P-C': null, 'P-L': null };
    if (trimmed in flags) {
      if (score >= 75) return 'Strong box office performer. Score is inflation-adjusted for era.';
      if (score >= 50) return 'Moderate box office performance. Score is inflation-adjusted for era.';
      return 'Limited box office reach. Score is inflation-adjusted for era.';
    }
    // Otherwise use the actual note (it's descriptive)
    return trimmed;
  }

  function renderDetail(f) {
    const d = f.dimensions;
    const fw = f.frameworks;
    const gaps = f.gaps || {};

    const dims = [
      { key: 'd1_box_office',           label: 'D1 — Box Office',            note: d1NoteText(d.d1_note, d.d1_box_office) },
      { key: 'd2_audience_devotion',     label: 'D2 — Audience Devotion',     note: d.d2_note },
      { key: 'd3_critical_release',      label: 'D3 — Critical at Release',   note: d.d3_note },
      { key: 'd4_critical_now',          label: 'D4 — Critical Now',          note: d.d4_note },
      { key: 'd5_filmmaker_influence',   label: 'D5 — Filmmaker Influence',   note: d.d5_note },
      { key: 'd6_cultural_footprint',    label: 'D6 — Cultural Footprint',    note: d.d6_note },
      { key: 'd7_longevity_trajectory',  label: 'D7 — Longevity Trajectory',  note: d.d7_note },
    ];

    const gapEntries = [
      { label: 'F2 over F1', key: 'f2_minus_f1', desc: 'Filmmaker prizes over popular verdict' },
      { label: 'F1 over F2', key: 'f1_minus_f2', desc: 'Popular verdict over filmmaker' },
      { label: 'F3 over F1', key: 'f3_minus_f1', desc: 'Long view over popular verdict' },
      { label: 'F1 over F3', key: 'f1_minus_f3', desc: 'Popular verdict over long view' },
      { label: 'F3 over F2', key: 'f3_minus_f2', desc: 'Long view over filmmaker' },
      { label: 'F2 over F3', key: 'f2_minus_f3', desc: 'Filmmaker over long view' },
    ].filter(g => gaps[g.key] !== undefined && Math.abs(gaps[g.key]) >= 3);

    const critique = f.critique
      ? `<div class="critique-block">
          <div class="detail-section-title">Verdict</div>
          <p class="critique-text">${escHtml(f.critique)}</p>
        </div>`
      : `<div class="critique-block">
          <div class="detail-section-title">Verdict</div>
          <p class="critique-placeholder">Individual film verdicts coming in a future update.</p>
        </div>`;

    return `
      <div class="detail-inner">

        <!-- Left: Dimensions -->
        <div>
          <div class="detail-section-title">Seven Dimensions</div>
          <div class="dimension-list">
            ${dims.map(dim => {
              const score = d[dim.key];
              if (score == null) return '';
              return `
                <div class="dimension-item">
                  <div class="dimension-header">
                    <span class="dimension-name">${dim.label}</span>
                    <span class="dimension-score-val">${score}</span>
                  </div>
                  <div class="dimension-bar-track">
                    <div class="dimension-bar-fill" style="width:${score}%"></div>
                  </div>
                  ${dim.note ? `<div class="dimension-note">${escHtml(dim.note)}</div>` : ''}
                </div>`;
            }).join('')}
          </div>
        </div>

        <!-- Right: Frameworks + gaps -->
        <div>
          <div class="detail-section-title">Three Frameworks</div>
          <div class="framework-comparison">
            <div class="framework-row">
              <span class="framework-label f1">F1 Popular</span>
              <div class="framework-bar-track">
                <div class="framework-bar-fill f1" style="width:${fw.f1_popular_verdict}%"></div>
              </div>
              <span class="framework-val f1">${fw.f1_popular_verdict}</span>
            </div>
            <div class="framework-row">
              <span class="framework-label f2">F2 Filmmaker</span>
              <div class="framework-bar-track">
                <div class="framework-bar-fill f2" style="width:${fw.f2_filmmakers_film}%"></div>
              </div>
              <span class="framework-val f2">${fw.f2_filmmakers_film}</span>
            </div>
            <div class="framework-row">
              <span class="framework-label f3">F3 Long View</span>
              <div class="framework-bar-track">
                <div class="framework-bar-fill f3" style="width:${fw.f3_long_view}%"></div>
              </div>
              <span class="framework-val f3">${fw.f3_long_view}</span>
            </div>
          </div>

          <!-- Final score -->
          <div style="display:flex; align-items:baseline; gap:1rem; padding:1rem 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); margin-bottom:1.25rem;">
            <span style="font-family:var(--font-mono); font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted);">Final Score</span>
            <span style="font-family:var(--font-display); font-size:2rem; font-weight:900; color:var(--gold); line-height:1;">${f.final_score}</span>
            <span class="tier-badge ${tierClass(getTier(f.final_score))}">${getTier(f.final_score)}</span>
            <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted); margin-left:auto;">Vol. ${f.volatility_index}</span>
          </div>

          <!-- Framework gaps -->
          ${gapEntries.length > 0 ? `
          <div class="detail-section-title">Framework Gaps</div>
          <div style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom:1rem;">
            ${gapEntries.map(g => {
              const val = gaps[g.key];
              const positive = val > 0;
              return `
                <div style="display:flex; justify-content:space-between; align-items:baseline; font-size:0.78rem; padding:0.35rem 0; border-bottom:1px solid var(--border);">
                  <span style="color:var(--text-secondary);">${g.desc}</span>
                  <span style="font-family:var(--font-mono); color:${positive ? 'var(--f3-color)' : 'var(--f2-color)'}; font-weight:500;">
                    ${positive ? '+' : ''}${val}
                  </span>
                </div>`;
            }).join('')}
          </div>` : ''}

          <!-- Other info -->
          <div style="font-family:var(--font-mono); font-size:0.68rem; color:var(--text-muted); line-height:1.8;">
            <div>Year: ${f.year} · Decade: ${f.decade}</div>
            <div>Genre: ${escHtml(f.genre)}</div>
            <div>Overall Rank: #${f.rank} of 1,104</div>
          </div>
        </div>

        <!-- Full width: Critique -->
        ${critique}

      </div>`;
  }

  // ── Toggle expanded row ────────────────────────────────────
  window.NSO = window.NSO || {};
  window.NSO.toggleFilm = function (id) {
    const row = document.querySelector(`.film-row[data-id="${id}"]`);
    const detail = document.getElementById(`detail-${id}`);
    if (!row || !detail) return;

    const isOpen = detail.classList.contains('open');

    // Close any currently open row
    document.querySelectorAll('.film-detail.open').forEach(el => el.classList.remove('open'));
    document.querySelectorAll('.film-row.expanded').forEach(el => el.classList.remove('expanded'));

    if (!isOpen) {
      detail.classList.add('open');
      row.classList.add('expanded');
      // Update URL hash without jumping
      history.replaceState(null, '', `#film-${id}`);
    } else {
      history.replaceState(null, '', window.location.pathname);
    }
  };

  // ── Pagination ─────────────────────────────────────────────
  function renderPagination() {
    const total = Math.ceil(filtered.length / PER_PAGE);
    const pag = document.getElementById('pagination');

    if (total <= 1) { pag.innerHTML = ''; return; }

    const maxVisible = 7;
    let pages = [];

    if (total <= maxVisible) {
      pages = Array.from({ length: total }, (_, i) => i + 1);
    } else {
      pages = [1];
      if (currentPage > 3) pages.push('…');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(total - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < total - 2) pages.push('…');
      pages.push(total);
    }

    pag.innerHTML = `
      <button class="page-btn" onclick="window.NSO.goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>
      ${pages.map(p =>
        p === '…'
          ? `<span class="page-info">…</span>`
          : `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="window.NSO.goPage(${p})">${p}</button>`
      ).join('')}
      <button class="page-btn" onclick="window.NSO.goPage(${currentPage + 1})" ${currentPage === total ? 'disabled' : ''}>Next →</button>
      <span class="page-info">${((currentPage - 1) * PER_PAGE) + 1}–${Math.min(currentPage * PER_PAGE, filtered.length)} of ${filtered.length.toLocaleString()}</span>
    `;
  }

  window.NSO.goPage = function (page) {
    const total = Math.ceil(filtered.length / PER_PAGE);
    if (page < 1 || page > total) return;
    currentPage = page;
    renderPage();
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Helpers ────────────────────────────────────────────────
  function getTier(score) {
    if (score >= 90) return 'S+';
    if (score >= 80) return 'S';
    if (score >= 70) return 'A';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    return 'D';
  }

  function tierClass(tier) {
    return { 'S+': 's-plus', 'S': 's', 'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd' }[tier] || 'd';
  }

  function escHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

})();

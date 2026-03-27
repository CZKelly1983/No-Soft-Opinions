/* ============================================================
   NO SOFT OPINIONS: CINEMA
   genres.js — Genre breakdowns with context and top films
   ============================================================ */

(function () {
  'use strict';

  const GENRE_NOTES = {
    'Drama':       { note: 'The index\'s largest genre at 283 films — by volume and by average score. Drama is the genre most rewarded by the framework\'s Long View emphasis, its films most likely to accumulate critical reassessment over time. Leads the index on F2 Filmmaker average.' },
    'Crime':       { note: 'Punches significantly above its volume. The Godfather and Pulp Fiction sit at ranks 1 and 7 overall. Crime drama has the highest average score of any genre in the index — the framework rewards films that combine popular reach with formal ambition, and Crime does this more consistently than any other category.' },
    'Sci-Fi':      { note: 'Small in volume, enormous in influence. 2001: A Space Odyssey, Star Wars, and Alien cluster in the top 15 overall. The genre\'s D5 Filmmaker Influence scores are among the highest in the dataset — science fiction changes what cinema thinks it can show and how it can show it.' },
    'Animation':   { note: '102 films spanning Snow White (1937) to the present. Animation has the most consistent score distribution of any genre — fewer extreme outliers, more films clustered in the 55–75 range. Studio Ghibli and Pixar dominate the upper tier; the franchise-animation industrial complex dominates the lower.' },
    'Historical':  { note: 'The genre most affected by the pre-1950 commercial data limitation. Many Historical films score conservatively on D1 Box Office due to incomplete records. Strong on D4 Critical Now and D7 Longevity when the subject matter has retained cultural relevance.' },
    'Comedy':      { note: 'The genre that ages least consistently. Some comedies have D7 trajectories as strong as any film in the dataset; others date sharply. The framework captures this: Comedy has the widest score spread of any substantial genre, from City Lights at 75.6 to films scoring under 25.' },
    'Action':      { note: 'Divided sharply between films with genuine filmmaker esteem (Raiders of the Lost Ark, Mad Max: Fury Road) and franchise sequels that score high on F1 Popular and low on everything else. The genre\'s F1/F2 gap is among the widest in the dataset.' },
    'War':         { note: '53 films covering the genre from All Quiet on the Western Front (1930) to Dunkirk. War films have the highest average D3 Critical at Release score of any genre — historically the Academy has treated serious war films as the most legitimate prestige cinema.' },
    'Thriller':    { note: 'Psycho leads the genre at 85.8 — the index\'s third-highest overall score. Hitchcock defines the upper tier; the genre\'s lower half clusters with franchise and franchise-adjacent films whose D7 longevity scores reflect declining relevance.' },
    'Superhero':   { note: '48 films, nearly all from the 2010s, with the widest F1/F2 gap of any genre in the dataset. The Dark Knight (83.5) is a genuine outlier — a filmmaker\'s film that also found massive popular reach. The genre\'s average F2 score is the lowest of any substantial category, its average volatility among the highest.' },
    'Musical':     { note: 'Strong upper tier anchored by Singin\' in the Rain and The Wizard of Oz. The genre\'s D6 Cultural Footprint scores are among the highest of any category — musicals produce imagery and songs that detach most successfully from their films and enter the broader culture independently.' },
    'Romance':     { note: 'Casablanca leads at 76.6, its cross-genre status (also War, also Drama) showing the limitation of single-genre classification. Romance scores consistently on D2 Audience Devotion — the films people return to — but has a wide spread on D5 Filmmaker Influence.' },
    'Fantasy':     { note: 'The Lord of the Rings trilogy anchors the upper tier. Fantasy\'s D5 scores reflect the genre\'s technical influence — world-building, VFX, production design — more than its narrative influence on subsequent filmmakers.' },
    'Western':     { note: '25 films, and the genre most visibly affected by the dataset\'s period bias. The great Westerns of the 1950s and 1960s score strongly on D4 and D5; the genre\'s decline in commercial viability after the 1970s is legible in the data.' },
    'Horror':      { note: 'Nineteen films — the most underrepresented major genre relative to its influence. Psycho, The Shining, and Jaws cluster near the top; the genre\'s D5 Filmmaker Influence scores are disproportionately high relative to its critical recognition history. Horror invented more formal grammar than the dataset captures.' },
    'Sports':      { note: 'Twelve films anchored by Rocky and Raging Bull. Sports drama rewards the framework\'s D2 Audience Devotion weighting — these are films people watch repeatedly and emotionally. Rocky\'s F1 of 74.1 is the highest Popular Verdict in the genre.' },
    'Documentary': { note: 'Five films — the most significant underrepresentation by volume in the entire dataset. Man with a Movie Camera scores D5 of 90, ninth highest in the index. The genre\'s absence is documented fully on the dataset page. These five films are here because they crossed into art cinema canonical lists; the vast majority of significant documentary work did not.' },
    'Experimental':{ note: 'Three films: Meshes of the Afternoon, Man with a Movie Camera, and Sans Soleil. All three score F2 significantly above F1. The category exists at the edge of what the dataset\'s source lists can capture — its presence here is the minimum, not the measure of experimental cinema\'s significance.' },
  };

  let allFilms = [];
  let currentGenre = null;

  fetch('films.json')
    .then(r => r.json())
    .then(data => {
      allFilms = data;
      const genres = [...new Set(data.map(f => f.genre))].sort((a,b) => {
        // Sort by count descending
        const ca = data.filter(f => f.genre === a).length;
        const cb = data.filter(f => f.genre === b).length;
        return cb - ca;
      });
      renderTabs(genres);
      renderGenre(genres[0], data);
      currentGenre = genres[0];
    })
    .catch(() => {
      document.getElementById('genres-container').innerHTML =
        '<div class="loading">Could not load film data.</div>';
    });

  function renderTabs(genres) {
    const tabsEl = document.getElementById('genre-tabs');
    tabsEl.innerHTML = genres.map(g => `
      <button
        class="page-btn ${g === genres[0] ? 'active' : ''}"
        onclick="window.NSO_genres.selectGenre('${g}')"
        id="tab-${g.replace(/[^a-z]/gi,'_')}"
      >${g} <span style="opacity:0.5;">${allFilms.filter(f=>f.genre===g).length}</span></button>
    `).join('');
  }

  function renderGenre(genre, films) {
    const group = films
      .filter(f => f.genre === genre)
      .sort((a,b) => (b.final_score||0) - (a.final_score||0));

    const top5 = group.slice(0, 5);
    const contested = [...group].sort((a,b) => (b.volatility_index||0) - (a.volatility_index||0)).slice(0,3);
    const note = GENRE_NOTES[genre] || { note: '' };

    const avgScore = (group.reduce((s,f) => s+(f.final_score||0),0)/group.length).toFixed(1);
    const avgF1 = (group.reduce((s,f) => s+(f.frameworks.f1_popular_verdict||0),0)/group.length).toFixed(1);
    const avgF2 = (group.reduce((s,f) => s+(f.frameworks.f2_filmmakers_film||0),0)/group.length).toFixed(1);
    const avgF3 = (group.reduce((s,f) => s+(f.frameworks.f3_long_view||0),0)/group.length).toFixed(1);

    document.getElementById('genres-container').innerHTML = `
      <!-- Genre header -->
      <div style="margin-bottom:1.5rem;">
        <div style="display:flex; align-items:baseline; gap:1.5rem; flex-wrap:wrap; margin-bottom:1rem;">
          <h2 style="font-family:var(--font-display); font-size:2rem; font-weight:900; color:var(--gold);">${escHtml(genre)}</h2>
          <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);">${group.length} films</span>
        </div>

        <!-- Avg scores strip -->
        <div style="display:flex; gap:2rem; flex-wrap:wrap; padding:1rem 0; border-top:1px solid var(--border); border-bottom:1px solid var(--border); margin-bottom:1.25rem;">
          <div>
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.2rem;">Avg Score</div>
            <div style="font-family:var(--font-display); font-size:1.5rem; font-weight:900; color:var(--gold);">${avgScore}</div>
          </div>
          <div>
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--f1-color); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.2rem;">Avg F1</div>
            <div style="font-family:var(--font-display); font-size:1.5rem; font-weight:900; color:var(--f1-color);">${avgF1}</div>
          </div>
          <div>
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--f2-color); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.2rem;">Avg F2</div>
            <div style="font-family:var(--font-display); font-size:1.5rem; font-weight:900; color:var(--f2-color);">${avgF2}</div>
          </div>
          <div>
            <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--f3-color); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:0.2rem;">Avg F3</div>
            <div style="font-family:var(--font-display); font-size:1.5rem; font-weight:900; color:var(--f3-color);">${avgF3}</div>
          </div>
        </div>

        ${note.note ? `<p style="font-size:0.9rem; line-height:1.8; color:var(--text-secondary); max-width:70ch; margin-bottom:1.5rem;">${note.note}</p>` : ''}
      </div>

      <div style="display:grid; grid-template-columns:1fr 300px; gap:2rem; align-items:start;">

        <!-- Top films -->
        <div>
          <div style="font-family:var(--font-mono); font-size:0.65rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:0.75rem;">Top Films — ${escHtml(genre)}</div>
          <table class="film-table">
            <thead>
              <tr>
                <th style="width:3rem; text-align:right;">#</th>
                <th>Film</th>
                <th style="text-align:center; color:var(--f1-color);">F1</th>
                <th style="text-align:center; color:var(--f2-color);">F2</th>
                <th style="text-align:center; color:var(--f3-color);">F3</th>
                <th style="text-align:center;">Score</th>
              </tr>
            </thead>
            <tbody>
              ${top5.map(f => `
                <tr class="film-row" onclick="window.location='ranking.html#film-${f.id}'" style="cursor:pointer;">
                  <td class="film-rank">${f.rank}</td>
                  <td class="film-title-cell">
                    <div class="film-title">${escHtml(f.title)}</div>
                    <div class="film-meta">${f.year} · ${f.decade}</div>
                  </td>
                  <td class="film-score f1">${f.frameworks.f1_popular_verdict}</td>
                  <td class="film-score f2">${f.frameworks.f2_filmmakers_film}</td>
                  <td class="film-score f3">${f.frameworks.f3_long_view}</td>
                  <td class="film-score final">${f.final_score}</td>
                </tr>`).join('')}
            </tbody>
          </table>
          <div style="margin-top:1rem;">
            <a href="#" onclick="window.NSO_genres.seeAll('${genre}'); return false;"
               style="font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em; color:var(--gold);">
              See all ${group.length} ${escHtml(genre)} films in ranking →
            </a>
          </div>
        </div>

        <!-- Most contested sidebar -->
        <div>
          <div style="font-family:var(--font-mono); font-size:0.65rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold); margin-bottom:0.75rem;">Most Contested</div>
          ${contested.map(f => `
            <div class="contested-card" style="margin-bottom:0.75rem; cursor:pointer;" onclick="window.location='ranking.html#film-${f.id}'">
              <div style="font-family:var(--font-display); font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:0.2rem;">${escHtml(f.title)}</div>
              <div style="font-family:var(--font-mono); font-size:0.65rem; color:var(--text-muted); margin-bottom:0.75rem;">${f.year} · vol: ${f.volatility_index}</div>
              <div style="display:flex; gap:0.75rem; font-family:var(--font-mono); font-size:0.72rem;">
                <span style="color:var(--f1-color);">F1: ${f.frameworks.f1_popular_verdict}</span>
                <span style="color:var(--f2-color);">F2: ${f.frameworks.f2_filmmakers_film}</span>
                <span style="color:var(--f3-color);">F3: ${f.frameworks.f3_long_view}</span>
              </div>
            </div>`).join('')}
        </div>

      </div>
    `;
  }

  // Public interface
  window.NSO_genres = {
    selectGenre(genre) {
      currentGenre = genre;
      // Update tab active states
      document.querySelectorAll('#genre-tabs .page-btn').forEach(btn => btn.classList.remove('active'));
      const tabId = 'tab-' + genre.replace(/[^a-z]/gi,'_');
      const tab = document.getElementById(tabId);
      if (tab) tab.classList.add('active');
      renderGenre(genre, allFilms);
    },
    seeAll(genre) {
      sessionStorage.setItem('nso-filter-genre', genre);
      window.location.href = 'ranking.html';
    }
  };

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

})();

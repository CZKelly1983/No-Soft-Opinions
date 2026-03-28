/* ============================================================
   NO SOFT OPINIONS: CINEMA
   decades.js — Decade breakdowns with essays and top films
   ============================================================ */

(function () {
  'use strict';

  const DECADE_ESSAYS = {
    '1920s': {
      headline: 'The Grammar Gets Written',
      essay: `Fifteen films in the dataset from a decade that invented the language every subsequent film would speak. The index scores the 1920s with an average F2 of 53.2 — higher than F1 (47.2) by 6 points — which is the decade's signature: a period whose significance is felt primarily by filmmakers and film historians rather than general audiences. Metropolis leads with 71.2, its F2 of 78.2 reflecting the degree to which Lang's visual language — the dystopian cityscape, the robot as human double, the crowd as mass organism — became the template for every science fiction film that followed. Battleship Potemkin has the highest F2 of the decade at 78.9 and the highest volatility at 17.4: a film that every serious filmmaker has studied and most general audiences have never watched, its Odessa Steps sequence now more famous as a reference than as an experience. Man with a Movie Camera has a D5 filmmaker influence score of 90 — ninth highest in the entire dataset — from a documentary with almost no popular reach. The 1920s built the foundations invisibly. The fact that most people have never seen these films is not the point. The fact that every film they have seen descends from them is.`
    },
    '1930s': {
      headline: 'Hollywood Learns to Talk — and to Dream',
      essay: `Ninety-seven films, the largest pre-war decade in the dataset, spanning the transition from silents to sound and the full maturation of the Hollywood studio system. The 1930s produces the index's most surprising top two: Snow White and the Seven Dwarfs (82.9) and The Wizard of Oz (82.6) — both sitting above Citizen Kane, both scoring above 80 across all three frameworks. Snow White's F2 of 86.3 is the highest filmmaker score of the decade, reflecting the fact that it invented feature animation grammar wholesale: every animated film for the next eighty years is either building on it or arguing with it. The decade's most contested films are not the popular hits but the European art cinema that the Hollywood infrastructure was already beginning to define itself against — The Rules of the Game (vol: 14.6), La Grande Illusion (vol: 12.3), M (vol: 12.5). Fritz Lang's M scores F2 of 78.4 against an F1 of 59.6: a film about a child murderer that the filmmaker community reveres as a formal landmark and that audiences have never quite made their own. The average F2 beating F1 by nearly a point across the whole decade tells the same story as the 1920s: the 1930s matters more to those who make films than to those who watch them.`
    },
    '1940s': {
      headline: 'War, Noir, and the Camera That Could Lie',
      essay: `Seventy-nine films scored across a decade split by war and shaped by its aftermath. The 1940s contains the dataset's most contested single film — Meshes of the Afternoon (1943, vol: 17.8), Maya Deren's fourteen-minute experimental short that scores F2 of 66.4 against an F1 of 39.7, a film that the avant-garde tradition considers foundational and that exists almost entirely outside mainstream film culture. Citizen Kane sits at 79.1 overall, with its F2 of 87.3 the highest filmmaker score of the decade — the film that cinema people point to as the grammar of modern filmmaking, with its F1 of 68.9 reflecting the honest reality that most audiences find it more admirable than loved. Casablanca and Citizen Kane were released within two years of each other: Casablanca's F1 of 71.9 exceeds Citizen Kane's by three points; Citizen Kane's F2 of 87.3 exceeds Casablanca's by nine. The decade produces the fullest version of that split — between films made for the culture and films made for cinema — that any decade in the index contains. Pinocchio's volatility of 1.0 matches The Godfather's: a film that all three frameworks agree on completely, its craft and its reach and its longevity converging without argument.`
    },
    '1950s': {
      headline: 'The World Discovers It Has More Than One Cinema',
      essay: `Seventy-four films, and the decade where the dataset's Anglo-American bias becomes most visible in what it doesn't contain. Seven Samurai leads on F2 at 84.7 — the highest filmmaker score of the 1950s — while scoring only 64.3 on F1. Kurosawa's film is the defining example of the decade's central dynamic: the emergence of non-Hollywood cinema into the Western critical consciousness, absorbed by filmmakers (Leone, Sturges, and dozens of others cited it directly) while remaining at a distance from mainstream audiences. Vertigo leads the decade overall at 77.2, with its trajectory story as interesting as its score — re-evaluated comprehensively since its original modest reception, its D4 current critical score of 80 reflecting a film that took decades to find its proper position. The 400 Blows has the decade's third-highest volatility at 13.4, its French New Wave grammar generating sharp F2 scores while its F1 of 57.3 reflects a film that film students watch and general audiences don't. Ben-Hur leads on F1 at 72.6 — eleven Oscars, massive commercial reach — and sits outside the top 40 overall. The 1950s is where the gap between the cinema that wins awards and the cinema that changes filmmaking first becomes fully visible in the data.`
    },
    '1960s': {
      headline: 'Everything Gets Broken at Once',
      essay: `Eighty-seven films from the decade where cinema's formal assumptions were dismantled systematically by filmmakers across three continents simultaneously. The 1960s has the highest average score of any decade in the dataset at 56.7, driven by a concentration of films that score across all three frameworks: Psycho (85.8), 2001: A Space Odyssey (85.0), Dr. Strangelove (80.7). Psycho and 2001 have the highest F2 scores of the decade — 88.5 and 88.6 respectively — both films that transformed what cinema thought it could do, both scoring above 80 on F1 as well. The 1960s is the only decade where the filmmaker consensus and the popular verdict are in close agreement at the top. The most contested films tell the other story: Breathless (vol: 14.9), Persona (vol: 13.9), Au Hasard Balthazar (vol: 13.6) — the European art cinema that the French New Wave and Bergman and Bresson were building while Hollywood was still processing the implications of Psycho. Dr. Strangelove's F2 of 85.3 against its F1 of 74.0 reflects a film that satirised nuclear annihilation so precisely that it became uncomfortable to love straightforwardly. The 1960s is the decade where the index most rewards watching widely rather than deep within any single tradition.`
    },
    '1970s': {
      headline: 'The Peak — And Everything It Left Out',
      essay: `The highest-scoring decade in the dataset by average (58.3), and the one that contains both the index's number one film and its most instructive blind spot. The Godfather at 91.2 and Star Wars at 89.3 are the two films where all three frameworks are most completely in agreement on greatness — volatility of 1.0 and 1.6 respectively. Jaws and Alien and The Godfather Part II follow at scores that would lead almost any other decade. The 1970s Hollywood renaissance was genuinely one of the most concentrated periods of commercially significant and formally ambitious filmmaking in cinema history, and the index reflects that without apology. But Jeanne Dielman sits at rank 136 with a volatility of 15.5 — the fourth highest in the dataset — its F1 of 42.6 against an F2 of 65.8 the most precise description in the index of a film that exists in two completely different cultural registers simultaneously. Touki Bouki has a volatility of 12.8, its F1 of 39.1 reflecting how completely the 1970s African cinema tradition that Djibril Diop Mambéty was working in never reached Western mainstream audiences. Tarkovsky's Stalker scores F2 of 68.4 against F1 of 48.9. The 1970s top line is the most famous in cinema history. Its most contested films are among the most invisible.`
    },
    '1980s': {
      headline: 'The Blockbuster Takes Over — Quietly',
      essay: `Ninety-three films, and the decade where the shift that Jaws and Star Wars began in the 1970s completes itself. The Empire Strikes Back leads at 84.8 — notably with F1 of 87.2 exceeding its F2 of 83.4, the reverse of most decades' pattern, meaning audiences rate it higher than the filmmaker consensus does. Raiders of the Lost Ark and E.T. follow the same logic: films where popular reach slightly outpaces critical and filmmaker esteem. Back to the Future at 77.8 has an F1 of 82.1 against an F2 of 75.5 — the largest popular-over-filmmaker gap in the decade's top ten. The Shining at 77.6 runs the opposite direction: F2 of 80.3 against F1 of 72.7, originally received coolly and now recognised as a formal landmark in what horror can do with a camera. The 1980s most contested films are Sans Soleil (vol: 14.0), Shoah (vol: 12.9), The Decalogue (vol: 12.9) — experimental and documentary work that the filmmaker community places in the canon and that sits almost invisible in the popular consciousness. The decade's average F2 of 58.7 beats F1 of 55.2, but the gap is narrowing compared to earlier decades. The blockbuster is winning the popular verdict. The art cinema is winning the filmmaker vote. The distance between them is becoming structural.`
    },
    '1990s': {
      headline: 'Pulp, Pixels, and the Last Analogue Decade',
      essay: `One hundred and seven films, and the decade most people under 50 think of when they think of cinema. Pulp Fiction leads at 84.1, its F2 of 88.5 the highest of the decade — a film that reinvented what dialogue and structure could do in mainstream cinema and generated a wave of imitators that lasted ten years. Toy Story has the second-highest F2 at 85.9: the first feature-length CGI film, its technical achievement now so absorbed into everything that comes after that its radical novelty is almost invisible. The Matrix at 81.0 completes the decade's technology argument — a film that changed visual language in mainstream action cinema as completely as any film has changed any genre. GoodFellas scores F2 of 85.5, its D5 filmmaker influence among the highest of the decade, directing grammar that is still being used. The most interesting contested film is Home Alone — vol: 11.3, F1 of 70.1 against F2 of 53.2 — a film that audiences loved straightforwardly and that the filmmaker community rates much more cautiously. Jurassic Park leads the decade on F1 at 81.5, sitting outside the top 20 overall: enormous reach, more modest filmmaker and long-view scores. The 1990s produced the last decade of films shot entirely on celluloid and the first decade of films that proved digital could replace it. The index catches that transition at the exact moment it happens.`
    },
    '2000s': {
      headline: 'Franchise Begins. Pixar Arrives. Nolan Changes Things.',
      essay: `One hundred and twenty-two films, the largest decade in the dataset until the 2010s, and the one where the structural shift toward franchise filmmaking becomes fully legible in the data. The Dark Knight leads at 83.5, with an F1 of 85.8 and F2 of 82.8 — the most complete mainstream genre film of the decade, a superhero film that the filmmaker community takes as seriously as audiences do. The Lord of the Rings trilogy enters as three separate scores, its Fellowship at 76.6 the highest of the three. Spirited Away at 74.8 has the decade's highest F2 among non-Hollywood films at 79.6, the point where Studio Ghibli's reputation in the Western critical community reaches its fullest expression. The 2000s most contested films are Transformers: Revenge of the Fallen (vol: 14.6), Pirates of the Caribbean: At World's End (vol: 14.5), Spider-Man 3 (vol: 14.5) — all franchise sequels where F1 Popular scores sit 20+ points above F2 and F3. The decade's average F2 of 54.0 falls below F1 of 55.9 for the first time in the dataset's history. The direction is clear: popular verdict is now regularly outpacing filmmaker and long-view esteem. The gap will widen in the decade that follows.`
    },
    '2010s': {
      headline: 'Volume, Franchises, and the D6 Floor',
      essay: `Two hundred and eighty-one films — more than any other decade, and a dataset that reflects the explosion in production volume rather than a concentration of significance. The 2010s average score of 47.6 is the lowest of any decade except the 2020s, and the average F2 of 46.4 falls 5.9 points below F1 — the widest popular-over-filmmaker gap in the dataset. Parasite leads the decade at 75.3, the only film in the 2010s top five with a higher F2 than F1, a film where critical consensus and filmmaker respect converge on something that also reached mainstream audiences. Mad Max: Fury Road at 73.5 has the decade's second-highest F2 at 76.5: an action film the filmmaker community treats as a formal achievement. The Superhero genre has 31 entries in the 2010s — more than the entire dataset has Horror films — and its most contested entries (Transformers: Age of Extinction vol: 15.8, Pirates: On Stranger Tides vol: 15.1) show the decade's most extreme F1/F2 gaps. The D6 cultural footprint finding is at its starkest here: the post-2015 mean D6 across the whole dataset is 21.2. Films earn enormous box office scores and leave almost nothing permanently detached from their release moment. The 2010s produced a lot of cinema. The data is honest about how much of it will last.`
    },
    '2020s': {
      headline: 'Too Early to Know — But the Data Has Opinions',
      essay: `Ninety-three films through 2025, and the decade the index is most explicitly cautious about. All 2020s scores should be read as provisional — the Long View framework cannot fully function on films whose long view is still being written. The average score of 48.5 is the lowest in the dataset, and the F3 average of 46.6 reflects conservative scoring on legacy and longevity that will change as these films age. KPop Demon Hunters leads the decade at 77.8 — a streaming-first film with an F1 of 83.0 and a D6 of 72, the joint-highest cultural footprint score of any post-2015 film in the index, its phenomenon operating in ways that bypass traditional critical infrastructure entirely. Sinners sits second at 74.4 with the decade's lowest volatility at 1.2 — all three frameworks in near-perfect agreement on a film that is simultaneously the most commercially ambitious, most critically acclaimed, and most culturally immediate work of the decade so far. The most interesting structural finding in the 2020s top ten is the F2 inversion: Marty Supreme (72.0), One Battle After Another (72.0), and Sentimental Value (69.0) all score their F2 Filmmaker's Film 14 to 19 points above their F1 Popular Verdict — a cluster of films the industry is taking seriously that haven't yet reached the audience breadth to match. The Secret Agent (67.0) has the decade's highest volatility at 14.3, its F1 of 54.4 against an F2 of 75.9 the most extreme filmmaker-versus-popular gap in the decade, reflecting a Brazilian political thriller that swept Cannes and the critics' trifecta while remaining largely invisible to mainstream audiences. The 2020s superhero entries cluster at the contested end: Thor: Love and Thunder (vol: 15.0) and Red Notice (vol: 13.6) both showing F1 scores 20+ points above F2 and F3. The decade's story is not yet written. The framework is ready for when it is.`
    }
  };

  fetch('films.json')
    .then(r => r.json())
    .then(data => render(data))
    .catch(() => {
      document.getElementById('decades-container').innerHTML =
        '<div class="loading">Could not load film data.</div>';
    });

  function render(films) {
    const decades = ['1920s','1930s','1940s','1950s','1960s','1970s','1980s','1990s','2000s','2010s','2020s'];
    const container = document.getElementById('decades-container');

    container.innerHTML = decades.map(decade => {
      const group = films
        .filter(f => f.decade === decade)
        .sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

      if (!group.length) return '';

      const essay = DECADE_ESSAYS[decade] || { headline: decade, essay: '' };
      const top5 = group.slice(0, 5);
      const mostContested = [...group].sort((a,b) => (b.volatility_index||0) - (a.volatility_index||0)).slice(0,1)[0];
      const avgScore = (group.reduce((s,f) => s + (f.final_score||0), 0) / group.length).toFixed(1);

      return `
        <div class="decade-card" id="decade-${decade}">
          <div class="decade-header">
            <div class="decade-name">${decade}</div>
            <div class="decade-count">${group.length} films · avg ${avgScore}</div>
          </div>

          <div class="decade-essay">
            <div style="font-family:var(--font-display); font-size:1.1rem; font-weight:700; color:var(--text-primary); margin-bottom:0.75rem; font-style:italic;">${essay.headline}</div>
            <p style="font-size:0.88rem; line-height:1.8; color:var(--text-secondary); margin:0;">${essay.essay}</p>
          </div>

          <div class="decade-films">
            <div style="padding:0.75rem 1.5rem; border-bottom:1px solid var(--border);">
              <span style="font-family:var(--font-mono); font-size:0.65rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--gold);">Top 5 — ${decade}</span>
            </div>
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
                      <div class="film-meta">${f.year} · ${escHtml(f.genre)}</div>
                    </td>
                    <td class="film-score f1">${f.frameworks.f1_popular_verdict}</td>
                    <td class="film-score f2">${f.frameworks.f2_filmmakers_film}</td>
                    <td class="film-score f3">${f.frameworks.f3_long_view}</td>
                    <td class="film-score final">${f.final_score}</td>
                  </tr>`).join('')}
              </tbody>
            </table>

            ${mostContested ? `
            <div style="padding:0.75rem 1.5rem; border-top:1px solid var(--border); display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
              <span style="font-family:var(--font-mono); font-size:0.65rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--text-muted);">Most contested:</span>
              <span style="font-family:var(--font-display); font-size:0.9rem; font-weight:700; color:var(--text-primary);">${escHtml(mostContested.title)}</span>
              <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--text-muted);">vol: ${mostContested.volatility_index}</span>
              <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--f1-color);">F1: ${mostContested.frameworks.f1_popular_verdict}</span>
              <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--f2-color);">F2: ${mostContested.frameworks.f2_filmmakers_film}</span>
              <span style="font-family:var(--font-mono); font-size:0.7rem; color:var(--f3-color);">F3: ${mostContested.frameworks.f3_long_view}</span>
              <a href="ranking.html#film-${mostContested.id}" style="font-family:var(--font-mono); font-size:0.65rem; color:var(--gold); letter-spacing:0.08em; margin-left:auto;">View →</a>
            </div>` : ''}

            <div style="padding:0.75rem 1.5rem; border-top:1px solid var(--border);">
              <a href="ranking.html?decade=${encodeURIComponent(decade)}" style="font-family:var(--font-mono); font-size:0.7rem; letter-spacing:0.08em; color:var(--gold);">
                See all ${group.length} films from the ${decade} →
              </a>
            </div>
          </div>
        </div>`;
    }).join('');

    // Wire up the "see all" links to pre-filter the ranking page
    document.querySelectorAll('a[href^="ranking.html?decade="]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const decade = new URL(link.href).searchParams.get('decade');
        sessionStorage.setItem('nso-filter-decade', decade);
        window.location.href = 'ranking.html';
      });
    });
  }

  function escHtml(str) {
    if (!str) return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

})();

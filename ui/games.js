/*
  Game listing, templating and play-page bindings (extracted from previous ui.js)
*/
export function initGames() {
    const btnPopular = document.getElementById('btn-popular');
    const btn2Player = document.getElementById('btn-2player');
    const btnAwarded = document.getElementById('btn-awarded');
    const gameCards = Array.from(document.querySelectorAll('.game-card'));
    const featuredSection = document.getElementById('featured-games');

    function clearActiveLinks() {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        if (featuredSection && featuredSection.dataset.original) {
            featuredSection.innerHTML = featuredSection.dataset.original;
            delete featuredSection.dataset.original;
        }
    }

    function applyFilterAndScroll(tag, btn) {
        document.getElementById('settings-page')?.classList.add('hidden');
        document.getElementById('about-page')?.classList.add('hidden');
        document.getElementById('community-page')?.classList.add('hidden');
        document.getElementById('game-page')?.classList.add('hidden');
        clearActiveLinks();
        btn.classList.add('active');

        const pages = {
            popular: {
                title: 'Popular Games',
                grid: `
                <div class="template-grid">
                    <div class="template-card"><img src="https://mellekosterimg.github.io/thumbnail/datadiggers.png" alt="Data Diggers"><h3>Data Diggers</h3><p>Rike Games</p></div>
                    <div class="template-card"><img src="https://mellekosterimg.github.io/thumbnail/drive-mad.jpg" alt=""><h3>Drive Mad</h3><p>Fancade</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160" alt=""><h3>Poly Track</h3><p>Kodub</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160" alt=""><h3>Popular Game D</h3><p>Short blurb.</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160" alt=""><h3>Popular Game E</h3><p>Short blurb.</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160" alt=""><h3>Popular Game F</h3><p>Short blurb.</p></div>
                </div>`
            },
            '2player': {
                title: '2 Player Games',
                grid: `
                <div class="template-grid">
                    <div class="template-card"><img src="https://via.placeholder.com/300x160?text=2P+Game+A" alt=""><h3>2P Showdown</h3><p>Local or online two-player action.</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160?text=2P+Game+B" alt=""><h3>Co-op Puzzle</h3><p>Work together to solve puzzles.</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160?text=2P+Game+C" alt=""><h3>Racing Duel</h3><p>Head-to-head races.</p></div>
                </div>`
            },
            awarded: {
                title: 'Awarded Games',
                grid: `
                <div class="template-grid">
                    <div class="template-card"><img src="https://via.placeholder.com/300x160?text=Award+Winner+1" alt=""><h3>Award Winner 2024</h3><p>Critically acclaimed experience.</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160?text=Award+Winner+2" alt=""><h3>Innovative Title</h3><p>Recognized for design.</p></div>
                    <div class="template-card"><img src="https://via.placeholder.com/300x160?text=Award+Winner+3" alt=""><h3>Artful Journey</h3><p>Beautiful storytelling.</p></div>
                </div>`
            }
        };

        const page = pages[tag] || null;
        if (page) {
            document.getElementById('hero').style.display = 'none';
            if (!featuredSection.dataset.original) featuredSection.dataset.original = featuredSection.innerHTML;
            featuredSection.innerHTML = `<h2>${page.title}</h2>` + page.grid;
        } else {
            document.getElementById('hero').style.display = '';
            if (featuredSection.dataset.original) {
                featuredSection.innerHTML = featuredSection.dataset.original;
                delete featuredSection.dataset.original;
            }
        }

        const headerOffset = document.querySelector('header').offsetHeight || 64;
        const rect = featuredSection.getBoundingClientRect();
        const targetY = window.scrollY + rect.top - headerOffset - 16;
        window.scrollTo({ top: targetY, behavior: 'smooth' });

        if (page) {
            gameCards.forEach(card => card.style.display = 'none');
        } else {
            gameCards.forEach(card => card.style.display = '');
        }

        setTimeout(bindGameCardClicks, 50);
    }

    btnPopular && btnPopular.addEventListener('click', (e) => { e.preventDefault(); applyFilterAndScroll('popular', btnPopular); });
    btn2Player && btn2Player.addEventListener('click', (e) => { e.preventDefault(); applyFilterAndScroll('2player', btn2Player); });
    btnAwarded && btnAwarded.addEventListener('click', (e) => { e.preventDefault(); applyFilterAndScroll('awarded', btnAwarded); });

    featuredSection && featuredSection.addEventListener('click', () => {
        document.getElementById('settings-page')?.classList.add('hidden');
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        gameCards.forEach(card => card.style.display = '');
    });

    function bindGameCardClicks() {
        const templateCards = Array.from(document.querySelectorAll('.template-card, .game-card'));

        // Data Diggers card
        const dataCard = templateCards.find(c => {
            const img = c.querySelector('img');
            const h3 = c.querySelector('h3');
            return (img && img.src && img.src.includes('datadiggers.png')) || (h3 && h3.textContent && h3.textContent.trim().toLowerCase() === 'data diggers');
        });
        if (dataCard) {
            dataCard.style.cursor = 'pointer';
            dataCard.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('hero').style.display = 'none';
                document.getElementById('featured-games').style.display = 'none';
                document.getElementById('game-page-datadiggers').classList.remove('hidden');
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                const iframe = document.getElementById('game-iframe-datadiggers');
                iframe.src = document.getElementById('game-page-datadiggers').dataset.playUrl || '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Drive Mad card
        const driveCard = templateCards.find(c => {
            const img = c.querySelector('img');
            const h3 = c.querySelector('h3');
            return (img && img.src && img.src.includes('drive-mad.jpg')) || (h3 && h3.textContent && h3.textContent.trim().toLowerCase() === 'drive mad');
        });
        if (driveCard) {
            driveCard.style.cursor = 'pointer';
            driveCard.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('hero').style.display = 'none';
                document.getElementById('featured-games').style.display = 'none';
                document.getElementById('game-page-drive').classList.remove('hidden');
                document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                const iframe = document.getElementById('game-iframe-drive');
                iframe.src = document.getElementById('game-page-drive').dataset.playUrl || '';
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }

        // Generic binding: any other template-card with a data-play attribute can open generic page
        templateCards.forEach(c => {
            const playAttr = c.dataset.playUrl || null;
            const h3 = c.querySelector('h3');
            if (!playAttr && (c === dataCard || c === driveCard)) return;
            if (playAttr) {
                c.style.cursor = 'pointer';
                c.addEventListener('click', (e) => {
                    e.preventDefault();
                    document.getElementById('hero').style.display = 'none';
                    document.getElementById('featured-games').style.display = 'none';
                    const gp = document.getElementById('game-page-generic');
                    gp.classList.remove('hidden');
                    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                    const iframe = document.getElementById('game-iframe-generic');
                    iframe.src = playAttr;
                    document.getElementById('generic-title').textContent = h3 ? h3.textContent.trim() : 'Game';
                    document.getElementById('generic-author').textContent = c.querySelector('p') ? c.querySelector('p').textContent.trim() : 'Unknown';
                    document.getElementById('generic-desc').textContent = c.querySelector('p') ? c.querySelector('p').textContent.trim() : 'Description not available.';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        });
    }
    bindGameCardClicks();

    // back buttons for game pages
    const gbBackData = document.getElementById('game-back-datadiggers');
    gbBackData && gbBackData.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('game-page-datadiggers').classList.add('hidden');
        document.getElementById('featured-games').style.display = '';
        document.getElementById('hero').style.display = '';
        const iframe = document.getElementById('game-iframe-datadiggers'); if (iframe) iframe.src = '';
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const gbBackDrive = document.getElementById('game-back-drive');
    gbBackDrive && gbBackDrive.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('game-page-drive').classList.add('hidden');
        document.getElementById('featured-games').style.display = '';
        document.getElementById('hero').style.display = '';
        const iframe = document.getElementById('game-iframe-drive'); if (iframe) iframe.src = '';
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const gbBackGeneric = document.getElementById('game-back-generic');
    gbBackGeneric && gbBackGeneric.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('game-page-generic').classList.add('hidden');
        document.getElementById('featured-games').style.display = '';
        document.getElementById('hero').style.display = '';
        const iframe = document.getElementById('game-iframe-generic'); if (iframe) iframe.src = '';
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // fullscreen handlers for per-page buttons
    document.querySelectorAll('.fullscreen-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.dataset.fullscreenTarget;
            const iframe = document.getElementById(targetId);
            if (!iframe) return;
            const el = iframe;
            if (document.fullscreenElement) document.exitFullscreen();
            else {
                (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen)?.call(el).catch(() => {
                    const wrapper = el.closest('.play-area') || el;
                    (wrapper.requestFullscreen || wrapper.webkitRequestFullscreen || wrapper.mozRequestFullScreen || wrapper.msRequestFullscreen)?.call(wrapper).catch(() => { });
                });
            }
        });
    });

    // back buttons for about/community (kept here to centralize view toggles)
    const aboutBack = document.getElementById('about-back');
    aboutBack && aboutBack.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('about-page')?.classList.add('hidden');
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        document.getElementById('featured-games').style.display = '';
        document.getElementById('hero').style.display = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    const communityBack = document.getElementById('community-back');
    communityBack && communityBack.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('community-page')?.classList.add('hidden');
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        document.getElementById('featured-games').style.display = '';
        document.getElementById('hero').style.display = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

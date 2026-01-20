/*
  Sidebar, page navigation and simple view toggles
  (extracted from previous ui.js for clarity)
*/
export function initSidebar() {
    // Collapsible category
    const collapsibleCategory = document.querySelector('.sidebar-category.collapsible');
    if (collapsibleCategory) {
        const collapsibleHeader = collapsibleCategory.querySelector('.collapsible-header');
        const collapseIcon = collapsibleHeader.querySelector('.collapse-icon');
        collapsibleHeader.addEventListener('click', () => {
            collapsibleCategory.classList.toggle('open');
            if (collapsibleCategory.classList.contains('open')) collapseIcon.textContent = '▲';
            else collapseIcon.textContent = '▼';
        });
    }

    // Mobile sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    sidebarToggle && sidebarToggle.addEventListener('click', (e) => { e.preventDefault(); document.body.classList.toggle('sidebar-open'); });

    // Close sidebar when clicking link on mobile
    document.querySelectorAll('#sidebar .sidebar-link').forEach(l => {
        l.addEventListener('click', (e) => {
            if (window.innerWidth <= 720) document.body.classList.remove('sidebar-open');
            // let special handlers run for settings/about/community
            if (l.id === 'btn-settings' || l.id === 'btn-about' || l.id === 'btn-community') return;
            document.getElementById('settings-page')?.classList.add('hidden');
            document.getElementById('game-page')?.classList.add('hidden');
            document.getElementById('about-page')?.classList.add('hidden');
            document.getElementById('featured-games') && (document.getElementById('featured-games').style.display = '');
            document.getElementById('hero') && (document.getElementById('hero').style.display = '');
        });
    });

    // Settings / About / Community open handlers (expose simple functions used elsewhere)
    const btnSettings = document.getElementById('btn-settings');
    const settingsPage = document.getElementById('settings-page');
    if (btnSettings) btnSettings.addEventListener('click', (e) => { e.preventDefault(); openSettingsView(); if (window.innerWidth <= 720) document.body.classList.remove('sidebar-open'); });

    const btnAbout = document.getElementById('btn-about');
    const aboutPage = document.getElementById('about-page');
    if (btnAbout) btnAbout.addEventListener('click', (e) => { e.preventDefault(); openAboutView(); if (window.innerWidth <= 720) document.body.classList.remove('sidebar-open'); });

    const btnCommunity = document.getElementById('btn-community');
    const communityPage = document.getElementById('community-page');
    if (btnCommunity) btnCommunity.addEventListener('click', (e) => { e.preventDefault(); openCommunityView(); if (window.innerWidth <= 720) document.body.classList.remove('sidebar-open'); });

    function openSettingsView() {
        document.getElementById('hero').style.display = 'none';
        document.getElementById('featured-games').style.display = 'none';
        document.getElementById('game-page')?.classList.add('hidden');
        aboutPage && aboutPage.classList.add('hidden');
        communityPage && communityPage.classList.add('hidden');
        settingsPage && settingsPage.classList.remove('hidden');
        setTimeout(()=>document.querySelector('.theme-btn')?.focus(),50);
    }

    function openAboutView() {
        document.getElementById('hero').style.display = 'none';
        document.getElementById('featured-games').style.display = 'none';
        document.getElementById('game-page')?.classList.add('hidden');
        settingsPage && settingsPage.classList.add('hidden');
        communityPage && communityPage.classList.add('hidden');
        aboutPage && aboutPage.classList.remove('hidden');
        setTimeout(()=>document.getElementById('about-back')?.focus(),50);
    }

    function openCommunityView() {
        document.getElementById('hero').style.display = 'none';
        document.getElementById('featured-games').style.display = 'none';
        document.getElementById('game-page')?.classList.add('hidden');
        settingsPage && settingsPage.classList.add('hidden');
        aboutPage && aboutPage.classList.add('hidden');
        communityPage && communityPage.classList.remove('hidden');
        setTimeout(()=>document.getElementById('community-back')?.focus(),50);
    }

    // back buttons for about/community handled in games module (keeps navigation consistent)

    // Home link: close all full-page views
    const homeLink = document.getElementById('home-link');
    homeLink && homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('game-page')?.classList.add('hidden');
        document.getElementById('featured-games').style.display = '';
        document.getElementById('hero').style.display = '';
        document.getElementById('settings-page')?.classList.add('hidden');
        document.getElementById('about-page')?.classList.add('hidden');
        document.getElementById('community-page')?.classList.add('hidden');
        const iframe = document.getElementById('game-iframe');
        if (iframe) iframe.src = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

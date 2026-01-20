import { setCookie, getCookie, clearAllCookies, safeSetStorage, safeGetStorage } from './utils.js';

const DEFAULT_SETTINGS = { theme: 'dark', hideSidebarMobile: true, accent: 'aegis', accentHex: '#6d4cff' };

export function initSettings() {
    // wire settings UI: theme buttons, accent buttons, custom picker, cookies modal
    const themeButtons = Array.from(document.querySelectorAll('.theme-btn'));
    const accentButtons = Array.from(document.querySelectorAll('.accent-btn'));
    const customPicker = document.getElementById('custom-accent-picker');
    const accentColorInput = document.getElementById('accent-color-input');
    const accentHexInput = document.getElementById('accent-hex-input');
    const accentSave = document.getElementById('accent-save');

    // cookies modal controls
    const resetCookiesBtn = document.getElementById('reset-cookies-btn');
    const cookiesModal = document.getElementById('cookies-modal');
    const cookiesModalClose = document.getElementById('cookies-modal-close');
    const cookiesConfirm = document.getElementById('cookies-confirm');
    const cookiesCancel = document.getElementById('cookies-cancel');

    // replace usage of inline picker with centered modal elements
    const accentModal = document.getElementById('accent-modal');
    const accentModalClose = document.getElementById('accent-modal-close');
    const accentModalColor = document.getElementById('accent-modal-color');
    const accentModalHex = document.getElementById('accent-modal-hex');
    const accentModalSave = document.getElementById('accent-modal-save');
    const accentModalCancel = document.getElementById('accent-modal-cancel');

    // add cookie banner handling
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept');
    const cookieLeaveBtn = document.getElementById('cookie-leave');
    function showCookieBanner(show = true) { if (!cookieBanner) return; cookieBanner.classList.toggle('hidden', !show); }
    function hasAcceptedCookies() { return !!getCookie('aegis_cookie_accept'); }
    cookieAcceptBtn && cookieAcceptBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setCookie('aegis_cookie_accept', '1', 365);
        try { safeSetStorage('aegis.settings', safeGetStorage('aegis.settings') || {}); } catch(e){}
        showCookieBanner(false);
    });
    cookieLeaveBtn && cookieLeaveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // try to close; if blocked, navigate away
        try { window.close(); } catch(e){}
        setTimeout(()=> { window.location.href = 'about:blank'; }, 200);
    });
    // show banner if not accepted
    if (!hasAcceptedCookies()) { // show after small delay so it doesn't flash before layout
        setTimeout(()=> showCookieBanner(true), 450);
    }

    // background controls
    const bgStandardBtn = document.getElementById('bg-standard-btn');
    const bgUploadInput = document.getElementById('bg-upload-input');
    const bgRemoveBtn = null; // removed from DOM, keep placeholder to avoid runtime errors

    // color preset buttons removed; keep empty list to avoid further references
    const bgColorButtons = [];
    const uploadBtnLabel = document.querySelector('.upload-btn');

    function updateBgActiveUI(mode, value) {
        // clear previous active states
        document.querySelectorAll('.bg-choices .btn, .upload-btn').forEach(el => el.classList.remove('active'));
        // mark upload label when custom file in use, or mark matching button
        if (mode === 'custom') {
            uploadBtnLabel && uploadBtnLabel.classList.add('active');
        } else {
            const match = document.querySelector(`.bg-choices [data-bg="${mode}"]`);
            match && match.classList.add('active');
        }
    }

    function applyBackgroundSetting(s = {}) {
        const bgMode = s.bg || 'standard';
        if (bgMode === 'custom' && s.bgData) {
            document.body.dataset.bg = 'custom';
            document.body.style.backgroundImage = `url("${s.bgData}")`;
        } else {
            document.body.dataset.bg = 'standard';
            document.body.style.backgroundImage = ''; // fallback to CSS background from theme
        }
    }

    // applyBackgroundSetting will be invoked after applySettings where needed

    function loadSettings() {
        let s = Object.assign({}, DEFAULT_SETTINGS, safeGetStorage('aegis.settings') || {});
        const cookieTheme = getCookie('aegis_theme');
        if (cookieTheme) s.theme = decodeURIComponent(cookieTheme);
        const accentCookie = getCookie('aegis_accent');
        if (accentCookie) {
            const val = decodeURIComponent(accentCookie);
            if (val === 'aegis') { s.accent = 'aegis'; s.accentHex = DEFAULT_SETTINGS.accentHex; }
            else if (val.startsWith('#')) { s.accent = 'custom'; s.accentHex = val; }
        }
        // background cookie/data
        const bgCookie = getCookie('aegis_bg');
        const bgData = safeGetStorage('aegis_bg_data') || null;
        if (bgCookie === 'custom' && bgData) { s.bg = 'custom'; s.bgData = bgData; }
        else { s.bg = 'standard'; s.bgData = null; }
        // update UI state
        themeButtons.forEach(btn => btn.setAttribute('aria-pressed', btn.dataset.theme === s.theme ? 'true' : 'false'));
        document.querySelectorAll('.accent-btn').forEach(b => {
            const is = (b.dataset.accent === (s.accent === 'aegis' ? 'aegis' : 'custom'));
            b.setAttribute('aria-pressed', is ? 'true' : 'false');
        });
        if (bgStandardBtn) bgStandardBtn.classList.toggle('active', s.bg === 'standard');
        updateBgActiveUI(s.bg || 'standard', s.bgData || null);
        applySettings(s);
        // ensure background is applied after settings are applied
        applyBackgroundSetting(s);
    }

    // background button handlers
    bgStandardBtn && bgStandardBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setCookie('aegis_bg', 'standard', 365);
        const stored = safeGetStorage('aegis.settings') || {};
        stored.bg = 'standard';
        delete stored.bgData;
        safeSetStorage('aegis.settings', stored);
        updateBgActiveUI('standard');
        applyBackgroundSetting({ bg: 'standard' });
    });

    // preset color buttons removed — users can use Standard or Upload only

    bgUploadInput && bgUploadInput.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const allowed = /\.(png|jpe?g|webp|gif)$/i;
        if (!allowed.test(file.name)) { alert('Unsupported file type.'); return; }
        const reader = new FileReader();
        reader.onload = function(ev) {
            const data = ev.target.result;
            try { safeSetStorage('aegis_bg_data', data); } catch(e){}
            setCookie('aegis_bg', 'custom', 365);
            const stored = safeGetStorage('aegis.settings') || {};
            stored.bg = 'custom';
            stored.bgData = data;
            safeSetStorage('aegis.settings', stored);
            updateBgActiveUI('custom');
            applyBackgroundSetting({ bg: 'custom', bgData: data });
        };
        reader.readAsDataURL(file);
    });

    // bgRemoveBtn removed from DOM — removal handled via 'Standard' button or upload overwrite

    function applySettings(s = {}) {
        if (!s.theme) s.theme = 'dark';
        if (s.theme === 'system') {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.dataset.theme = prefersDark ? 'dark' : 'light';
        } else {
            document.body.dataset.theme = s.theme;
        }
        if (s.hideSidebarMobile) {
            if (window.innerWidth <= 720) document.body.classList.remove('sidebar-open');
        }
        const accentHex = (s.accent === 'aegis' ? '#6d4cff' : (s.accentHex || '#6d4cff'));
        document.body.style.setProperty('--accent', accentHex);
        document.body.style.setProperty('--accent-strong', accentHex);
    }

    // theme interaction
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            themeButtons.forEach(b => b.setAttribute('aria-pressed','false'));
            btn.setAttribute('aria-pressed','true');
            const theme = btn.dataset.theme;
            if (theme === 'system') {
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.body.dataset.theme = prefersDark ? 'dark' : 'light';
            } else {
                document.body.dataset.theme = theme;
            }
            setCookie('aegis_theme', theme, 365);
            safeSetStorage('aegis.settings', { theme: theme, hideSidebarMobile: true });
        });
    });

    // respond to system changes when system theme is selected
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const stored = safeGetStorage('aegis.settings') || {};
        if ((stored.theme || DEFAULT_SETTINGS.theme) === 'system') {
            document.body.dataset.theme = e.matches ? 'dark' : 'light';
        }
    });

    // accent controls
    accentButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            accentButtons.forEach(b => b.setAttribute('aria-pressed','false'));
            btn.setAttribute('aria-pressed','true');
            if (btn.dataset.accent === 'aegis') {
                setCookie('aegis_accent', 'aegis', 365);
                safeSetStorage('aegis.settings', { theme: (safeGetStorage('aegis.settings')||{}).theme || DEFAULT_SETTINGS.theme, hideSidebarMobile: true, accent: 'aegis', accentHex: DEFAULT_SETTINGS.accentHex });
                applySettings({ accent: 'aegis', accentHex: DEFAULT_SETTINGS.accentHex, theme: (safeGetStorage('aegis.settings')||{}).theme || DEFAULT_SETTINGS.theme, hideSidebarMobile: true });
            } else {
                // open centered accent modal
                if (!accentModal) return;
                accentModal.classList.remove('hidden');
                accentModal.setAttribute('aria-hidden','false');
                // populate modal inputs with current value
                const cur = safeGetStorage('aegis.settings')?.accentHex || getCookie('aegis_accent') || DEFAULT_SETTINGS.accentHex;
                const hex = (cur === 'aegis') ? DEFAULT_SETTINGS.accentHex : cur;
                accentModalColor.value = hex.startsWith('#') ? hex : DEFAULT_SETTINGS.accentHex;
                accentModalHex.value = accentModalColor.value;
                setTimeout(()=>accentModalColor.focus(),40);
            }
        });
    });

    // modal interactions
    accentModalClose && accentModalClose.addEventListener('click', () => { if (!accentModal) return; accentModal.classList.add('hidden'); accentModal.setAttribute('aria-hidden','true'); });
    accentModalCancel && accentModalCancel.addEventListener('click', (e) => { e.preventDefault(); if (!accentModal) return; accentModal.classList.add('hidden'); accentModal.setAttribute('aria-hidden','true'); });
    if (accentModalColor) accentModalColor.addEventListener('input', (e) => { accentModalHex.value = e.target.value; });
    if (accentModalHex) accentModalHex.addEventListener('input', (e) => {
        const v = e.target.value.trim();
        if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)) accentModalColor.value = v;
    });
    accentModalSave && accentModalSave.addEventListener('click', (e) => {
        e.preventDefault();
        const hex = (accentModalHex.value || accentModalColor.value || DEFAULT_SETTINGS.accentHex).trim();
        setCookie('aegis_accent', hex, 365);
        safeSetStorage('aegis.settings', { theme: (safeGetStorage('aegis.settings')||{}).theme || DEFAULT_SETTINGS.theme, hideSidebarMobile: true, accent: 'custom', accentHex: hex });
        document.querySelectorAll('.accent-btn').forEach(b => b.setAttribute('aria-pressed', b.dataset.accent==='custom' ? 'true':'false'));
        applySettings({ accent: 'custom', accentHex: hex, theme: (safeGetStorage('aegis.settings')||{}).theme || DEFAULT_SETTINGS.theme, hideSidebarMobile: true });
        if (accentModal) { accentModal.classList.add('hidden'); accentModal.setAttribute('aria-hidden','true'); }
        // saved silently — no popup
    });

    // cookies modal handling
    function showCookiesModal(show = true) { if (!cookiesModal) return; cookiesModal.classList.toggle('hidden', !show); }
    resetCookiesBtn && resetCookiesBtn.addEventListener('click', (e) => { e.preventDefault(); showCookiesModal(true); });
    cookiesModalClose && cookiesModalClose.addEventListener('click', () => showCookiesModal(false));
    cookiesConfirm && cookiesConfirm.addEventListener('click', (e) => {
        e.preventDefault();
        clearAllCookies();
        try { localStorage.clear(); sessionStorage.clear(); } catch(e){}
        showCookiesModal(false);
        alert('Cookies and local storage cleared.');
    });
    cookiesCancel && cookiesCancel.addEventListener('click', (e) => { e.preventDefault(); showCookiesModal(false); });

    // initial apply
    loadSettings();
    // ensure any initial global settings also apply background for the current stored settings
    const initStored = safeGetStorage('aegis.settings') || {};
    applyBackgroundSetting({
        bg: initStored.bg || (getCookie('aegis_bg') === 'custom' ? 'custom' : 'standard'),
        bgData: initStored.bgData || safeGetStorage('aegis_bg_data') || null
    });
}

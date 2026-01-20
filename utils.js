// small utilities: cookie and storage helpers
export function setCookie(name, value, days = 365) {
    try {
        const maxAge = days * 24 * 60 * 60;
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}`;
    } catch (e) { /* ignore */ }
}
export function getCookie(name) {
    try {
        return document.cookie.split(';').map(c=>c.trim()).find(c=>c.startsWith(name+'='))?.split('=')[1];
    } catch(e){ return null; }
}
export function clearAllCookies() {
    try {
        document.cookie.split(';').forEach(c => {
            const eqPos = c.indexOf('=');
            const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim();
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=' + location.hostname;
        });
    } catch(e){}
}
export function safeSetStorage(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch(e){}
}
export function safeGetStorage(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch(e){ return null; }
}


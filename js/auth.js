/* auth.js — localStorage-based auth (no backend) */

const DEMO_USERS = [
  { id: 'u1', name: 'Demo Student', email: 'student@gcma.com', password: 'demo1234',
    stats: { answered: 47, correct: 36, streak: 5, timeMin: 140 } },
  { id: 'u2', name: 'Test User',   email: 'test@gcma.com',    password: 'test1234',
    stats: { answered: 12, correct: 9,  streak: 2, timeMin: 42  } },
];

const Auth = {
  login(email, password) {
    const user = DEMO_USERS.find(u => u.email === email.trim().toLowerCase() && u.password === password);
    if (!user) return { ok: false, error: 'Invalid email or password.' };
    const session = { id: user.id, name: user.name, email: user.email, stats: user.stats, loginAt: Date.now() };
    localStorage.setItem('np_session', JSON.stringify(session));
    return { ok: true, user: session };
  },

  logout() {
    localStorage.removeItem('np_session');
  },

  getUser() {
    try { return JSON.parse(localStorage.getItem('np_session')); }
    catch { return null; }
  },

  saveUser(user) {
    localStorage.setItem('np_session', JSON.stringify(user));
  },

  requireAuth(redirectTo = 'login.html') {
    if (!this.getUser()) { window.location.href = redirectTo; return null; }
    return this.getUser();
  },

  redirectIfAuthed(redirectTo = 'platform.html') {
    if (this.getUser()) { window.location.href = redirectTo; }
  },
};

// ── Theme Manager ──
const Theme = {
  init() {
    const currentTheme = localStorage.getItem('gcma_theme') || 'dark'; // DEFAULT TO DARK!
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    // Set a listener to ensure theme icons update when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.updateIcons());
    } else {
      this.updateIcons();
    }
  },

  toggle() {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('gcma_theme', isDark ? 'dark' : 'light');
    this.updateIcons();
    if (typeof toast === 'function') {
      toast(`Switched to ${isDark ? 'Dark' : 'Light'} Mode`, 'info');
    }
  },

  updateIcons() {
    const isDark = document.documentElement.classList.contains('dark-theme');
    const btns = document.querySelectorAll('#theme-toggle-btn');
    btns.forEach(btn => {
      if (isDark) {
        // Sun Icon
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px; color: var(--amber);"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
      } else {
        // Moon Icon
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 15px; height: 15px; color: currentColor;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;
      }
    });
  }
};

// Initialize theme instantly to prevent screen flash
Theme.init();

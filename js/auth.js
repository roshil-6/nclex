/* auth.js — localStorage-based auth (no backend) */

const DEMO_USERS = [
  { id: 'u3', name: 'Juhy GCMA',   email: 'juhygcma@2026',   password: 'JUHYGCMA@2026', role: 'admin',
    stats: { answered: 0,  correct: 0,  streak: 0, timeMin: 0   } }
];

const Auth = {
  async login(email, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.ok) {
        localStorage.setItem('np_session', JSON.stringify(data.user));
        return { ok: true, user: data.user };
      }
      return { ok: false, error: data.error || 'Authentication failed.' };
    } catch (e) {
      console.warn("Backend auth offline. Falling back to local offline mock login.");
      const localUsers = JSON.parse(localStorage.getItem('gcma_local_users') || '[]');
      const allUsers = [...DEMO_USERS, ...localUsers];
      const user = allUsers.find(u => u.email === email.trim().toLowerCase() && u.password === password);
      if (!user) return { ok: false, error: 'Invalid email or password.' };
      const session = { id: user.id, name: user.name, email: user.email, role: user.role || 'student', stats: user.stats, loginAt: Date.now() };
      localStorage.setItem('np_session', JSON.stringify(session));
      return { ok: true, user: session };
    }
  },

  async register(name, email, password) {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn("Backend auth offline. Saving user to local storage fallback.");
      const cleanEmail = email.trim().toLowerCase();
      const localUsers = JSON.parse(localStorage.getItem('gcma_local_users') || '[]');
      const allUsers = [...DEMO_USERS, ...localUsers];
      if (allUsers.some(u => u.email === cleanEmail)) {
        return { ok: false, error: 'Email already exists.' };
      }
      const newUser = {
        id: 'u-' + Date.now(),
        name,
        email: cleanEmail,
        password,
        role: 'student',
        stats: { answered: 0, correct: 0, streak: 0, timeMin: 0 }
      };
      localUsers.push(newUser);
      localStorage.setItem('gcma_local_users', JSON.stringify(localUsers));
      return { ok: true, message: 'Registration successful!' };
    }
  },

  async changePassword(email, currentPassword, newPassword) {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, currentPassword, newPassword })
      });
      const data = await response.json();
      return data;
    } catch (e) {
      console.warn("Backend auth offline. Changing password locally.");
      const cleanEmail = email.trim().toLowerCase();
      
      // Check in fallback DEMO_USERS first
      const demoUser = DEMO_USERS.find(u => u.email === cleanEmail);
      if (demoUser) {
        if (demoUser.password !== currentPassword) {
          return { ok: false, error: 'Incorrect current password.' };
        }
        demoUser.password = newPassword;
        return { ok: true, message: 'Password changed successfully.' };
      }

      // Check in localUsers
      const localUsers = JSON.parse(localStorage.getItem('gcma_local_users') || '[]');
      const user = localUsers.find(u => u.email === cleanEmail);
      if (!user) return { ok: false, error: 'User account not found.' };
      if (user.password !== currentPassword) {
        return { ok: false, error: 'Incorrect current password.' };
      }
      user.password = newPassword;
      localStorage.setItem('gcma_local_users', JSON.stringify(localUsers));
      return { ok: true, message: 'Password changed successfully.' };
    }
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

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

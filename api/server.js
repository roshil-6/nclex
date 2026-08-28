const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static frontend files directly

// Check for DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.warn("WARNING: DATABASE_URL env variable is not set. Falling back to local mock storage.");
}

const pool = dbUrl ? new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
}) : null;

// Initialize Database Schema on start
async function initDb() {
  if (!pool) return;
  try {
    console.log("Initializing database schema...");
    
    // Create Users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        answered INT DEFAULT 0,
        correct INT DEFAULT 0,
        streak INT DEFAULT 0,
        time_min INT DEFAULT 0,
        active_session_token VARCHAR(255)
      );
    `);

    // Create User Progress / Checklist table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(100) NOT NULL,
        item_key VARCHAR(150) NOT NULL,
        item_type VARCHAR(50) NOT NULL, -- 'lecture' or 'chapter'
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_email, item_key, item_type)
      );
    `);

    // Insert Default Admin User if empty
    const { rows } = await pool.query('SELECT count(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      console.log("Inserting default admin user...");
      await pool.query(`
        INSERT INTO users (id, name, email, password, role, answered, correct, streak, time_min)
        VALUES 
          ('u3', 'Juhy GCMA', 'juhygcma@2026', 'juhygcma321', 'admin', 0, 0, 0, 0)
        ON CONFLICT DO NOTHING;
      `);
    }

    console.log("Database schema successfully initialized!");
  } catch (err) {
    console.error("Error creating database schema:", err);
  }
}

// ── API ROUTES ──

// Login validation
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!pool) {
    // Local memory mock fallback if no DB connection URL is set
    return res.json({ ok: false, error: 'Database connection offline.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, password, role, answered, correct, streak, time_min AS "timeMin" FROM users WHERE email = $1',
      [cleanEmail]
    );

    if (rows.length === 0 || rows[0].password !== password) {
      return res.status(401).json({ ok: false, error: 'Invalid email or password.' });
    }

    const user = rows[0];
    delete user.password; // Do not return pass hash

    // Generate unique session token to block other devices
    const sessionToken = 'sess-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    await pool.query('UPDATE users SET active_session_token = $1 WHERE email = $2', [sessionToken, cleanEmail]);

    // Get checkmarks logs
    const progressRes = await pool.query(
      'SELECT item_key, item_type FROM user_progress WHERE user_email = $1',
      [cleanEmail]
    );

    const lecturesChecked = progressRes.rows.filter(r => r.item_type === 'lecture').map(r => r.item_key);
    const chaptersChecked = progressRes.rows.filter(r => r.item_type === 'chapter').map(r => r.item_key);

    return res.json({
      ok: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        sessionToken,
        stats: {
          answered: user.answered,
          correct: user.correct,
          streak: user.streak,
          timeMin: user.timeMin
        },
        lecturesChecked,
        chaptersChecked
      }
    });
  } catch (err) {
    console.error("Login API error:", err);
    return res.status(500).json({ ok: false, error: 'Database query error.' });
  }
});

// Register new student account
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ ok: false, error: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  if (!pool) {
    return res.status(503).json({ ok: false, error: 'Database offline.' });
  }

  try {
    // Check if duplicate email
    const checkRes = await pool.query('SELECT id FROM users WHERE email = $1', [cleanEmail]);
    if (checkRes.rows.length > 0) {
      return res.status(400).json({ ok: false, error: 'An account with this email already exists.' });
    }

    const userId = 'u-' + Date.now();
    await pool.query(
      `INSERT INTO users (id, name, email, password, role, answered, correct, streak, time_min)
       VALUES ($1, $2, $3, $4, 'student', 0, 0, 0, 0)`,
      [userId, name, cleanEmail, password]
    );

    return res.json({ ok: true, message: 'Account registered successfully!' });
  } catch (err) {
    console.error("Register API error:", err);
    return res.status(500).json({ ok: false, error: 'Failed to write registration to database.' });
  }
});

app.post('/api/user/stats', async (req, res) => {
  const { email, answered, correct, streak, timeMin } = req.body;
  if (!email) return res.status(400).json({ ok: false, error: 'User email is required.' });

  if (!pool) return res.json({ ok: true }); // local mock fallback

  try {
    await pool.query(
      `UPDATE users 
       SET answered = $1, correct = $2, streak = $3, time_min = $4 
       WHERE email = $5`,
      [answered || 0, correct || 0, streak || 0, timeMin || 0, email.trim().toLowerCase()]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error updating stats:", err);
    return res.status(500).json({ ok: false, error: 'Error writing stats to database.' });
  }
});

// Record user checklists (watched classes / read chapters)
app.post('/api/user/progress', async (req, res) => {
  const { email, itemKey, itemType } = req.body;
  if (!email || !itemKey || !itemType) {
    return res.status(400).json({ ok: false, error: 'Missing parameters.' });
  }

  if (!pool) return res.json({ ok: true });

  try {
    await pool.query(
      `INSERT INTO user_progress (user_email, item_key, item_type)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_email, item_key, item_type) DO NOTHING`,
      [email.trim().toLowerCase(), itemKey, itemType]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error logging progress:", err);
    return res.status(500).json({ ok: false, error: 'Database write error.' });
  }
});

// Change password route (validates current password first)
app.post('/api/auth/change-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, error: 'Missing parameters.' });
  }

  if (!pool) {
    return res.status(503).json({ ok: false, error: 'Database offline.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const { rows } = await pool.query('SELECT password FROM users WHERE email = $1', [cleanEmail]);
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: 'User account not found.' });
    }

    if (rows[0].password !== currentPassword) {
      return res.status(400).json({ ok: false, error: 'Incorrect current password value.' });
    }

    await pool.query('UPDATE users SET password = $1 WHERE email = $2', [newPassword, cleanEmail]);
    return res.json({ ok: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error("Change password route error:", err);
    return res.status(500).json({ ok: false, error: 'Database update failed.' });
  }
});

// Verify if local session token matches active database session token
app.post('/api/auth/validate-session', async (req, res) => {
  const { email, sessionToken } = req.body;
  if (!email || !sessionToken) {
    return res.status(400).json({ ok: false, error: 'Missing parameters.' });
  }

  if (!pool) return res.json({ ok: true }); // Fallback locally

  try {
    const { rows } = await pool.query(
      'SELECT active_session_token FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );

    if (rows.length === 0) {
      return res.json({ ok: false, error: 'User not found.' });
    }

    const matches = rows[0].active_session_token === sessionToken;
    return res.json({ ok: matches });
  } catch (err) {
    console.error("Session verification error:", err);
    return res.status(500).json({ ok: false, error: 'Database verification failed.' });
  }
});

// Fetch all registered students (Admin portal metric)
app.get('/api/admin/students', async (req, res) => {
  if (!pool) {
    return res.json({ ok: true, students: [] });
  }

  try {
    // Get all student roles
    const usersRes = await pool.query(
      `SELECT id, name, email, role, answered, correct, streak, time_min AS "timeMin" 
       FROM users WHERE role = 'student'`
    );

    const students = [];
    for (let user of usersRes.rows) {
      const progRes = await pool.query(
        'SELECT item_key, item_type FROM user_progress WHERE user_email = $1',
        [user.email]
      );

      students.push({
        name: user.name,
        email: user.email,
        stats: {
          answered: user.answered,
          correct: user.correct,
          streak: user.streak,
          timeMin: user.timeMin
        },
        lecturesChecked: progRes.rows.filter(r => r.item_type === 'lecture').map(r => r.item_key),
        chaptersChecked: progRes.rows.filter(r => r.item_type === 'chapter').map(r => r.item_key)
      });
    }

    return res.json({ ok: true, students });
  } catch (err) {
    console.error("Admin dashboard fetch error:", err);
    return res.status(500).json({ ok: false, error: 'Failed to retrieve students list.' });
  }
});

// Start listening
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDb();
});

/**
 * NursePrep Pro — App Controller
 * Handles UI rendering and routing between screens.
 */

/* =========================================
   SCREEN ENUM
   ========================================= */
const SCREEN = {
  HOME: 'HOME',
  SETUP: 'SETUP',
  QUIZ: 'QUIZ',
  RESULTS: 'RESULTS',
};

/* =========================================
   APP STATE
   ========================================= */
const appState = {
  screen: SCREEN.HOME,
  selectedAnswers: [],
  answered: false,
  lastResult: null,
  elapsed: 0,
  quizCount: 10,
  examType: 'RN',
  format: 'ALL',
  category: 'ALL',
  difficulty: 'ALL',
};

/* =========================================
   ROOT RENDER
   ========================================= */
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(buildHeader());

  switch (appState.screen) {
    case SCREEN.HOME:   app.appendChild(buildHomeScreen());   break;
    case SCREEN.SETUP:  app.appendChild(buildSetupScreen());  break;
    case SCREEN.QUIZ:   app.appendChild(buildQuizScreen());   break;
    case SCREEN.RESULTS:app.appendChild(buildResultsScreen());break;
  }

  app.appendChild(buildToastContainer());
}

/* =========================================
   HEADER
   ========================================= */
function buildHeader() {
  const header = el('header', 'header');
  const logo = el('div', 'header-logo');
  logo.innerHTML = `<div class="logo-icon">🏥</div><span class="text-gradient">NursePrep Pro</span>`;
  logo.onclick = () => navigate(SCREEN.HOME);

  const nav = el('div', 'header-nav');

  if (appState.screen === SCREEN.QUIZ) {
    const quitBtn = btn('Quit Quiz', 'btn btn-ghost btn-sm', () => {
      if (confirm('End this quiz session? Your progress will be lost.')) {
        quizEngine.stopTimer();
        navigate(SCREEN.HOME);
      }
    });
    nav.appendChild(quitBtn);
  } else if (appState.screen !== SCREEN.HOME) {
    const homeBtn = btn('🏠 Home', 'btn btn-ghost btn-sm', () => navigate(SCREEN.HOME));
    nav.appendChild(homeBtn);
  }

  header.appendChild(logo);
  header.appendChild(nav);
  return header;
}

/* =========================================
   HOME SCREEN
   ========================================= */
function buildHomeScreen() {
  const wrap = el('div');

  // ---- Hero ----
  const hero = el('section', 'hero');
  const totalQ = QUESTION_BANK.length;
  const sataCount = QUESTION_BANK.filter(q => q.format === 'SATA').length;
  const ngnCount = QUESTION_BANK.filter(q => q.format === 'NGN Case Study').length;

  hero.innerHTML = `
    <div class="hero-eyebrow">⚕️ Next-Generation NCLEX Prep</div>
    <h1 class="hero-title">Master the <span class="text-gold">NCLEX-RN</span> &amp;<br><span class="text-gold">NCLEX-PN</span> with Confidence</h1>
    <p class="hero-subtitle">High-fidelity practice questions with expert rationales, clinical judgment focus, and real exam-style formats.</p>
    <div class="hero-cta">
      <button class="btn btn-primary btn-xl" id="start-quiz-btn" onclick="navigate(SCREEN.SETUP)">
        Start Practice Quiz →
      </button>
      <button class="btn btn-secondary btn-lg" onclick="navigate(SCREEN.SETUP)">
        Browse Questions
      </button>
    </div>
    <div class="hero-stats">
      <div class="hero-stat"><div class="hero-stat-value">${totalQ}+</div><div class="hero-stat-label">Questions</div></div>
      <div class="hero-stat"><div class="hero-stat-value">${sataCount}</div><div class="hero-stat-label">SATA</div></div>
      <div class="hero-stat"><div class="hero-stat-value">${ngnCount}</div><div class="hero-stat-label">NGN Cases</div></div>
      <div class="hero-stat"><div class="hero-stat-value">8</div><div class="hero-stat-label">Categories</div></div>
    </div>
  `;
  wrap.appendChild(hero);

  // ---- Features ----
  const features = el('section', 'features-section');
  features.innerHTML = `
    <div class="container">
      <div class="section-title">
        <h2>Everything You Need to <span class="text-gold">Pass Your Boards</span></h2>
        <p class="text-muted">Built around the NCLEX Clinical Judgment Measurement Model (CJMM)</p>
      </div>
      <div class="feature-grid">
        ${featureCard('📊', 'Select All That Apply (SATA)', 'Multi-select questions requiring you to identify ALL correct options — just like the real exam.', SCREEN.SETUP)}
        ${featureCard('🎯', 'Prioritization & Delegation', 'Clinical triage scenarios testing your ability to apply ABC and Maslow frameworks under pressure.', SCREEN.SETUP)}
        ${featureCard('📋', 'Next-Gen NCLEX Case Studies', 'Multi-faceted client scenarios with vital signs, labs, and structured clinical reasoning.', SCREEN.SETUP)}
        ${featureCard('💡', 'Expert Rationales', 'Every question includes Core Concept, Right/Wrong Analysis, and a one-sentence Educational Objective.', SCREEN.SETUP)}
      </div>
    </div>
  `;
  wrap.appendChild(features);

  return wrap;
}

function featureCard(icon, title, desc, screen) {
  return `
    <div class="feature-card" onclick="navigate('${screen}')">
      <div class="feature-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="feature-arrow">Practise this format →</div>
    </div>
  `;
}

/* =========================================
   SETUP SCREEN
   ========================================= */
function buildSetupScreen() {
  const wrap = el('div', 'quiz-setup');
  const inner = el('div', 'quiz-setup-inner');

  inner.innerHTML = `
    <button class="back-btn" onclick="navigate(SCREEN.HOME)">← Back to Home</button>
    <h2 class="setup-title">Configure Your <span class="text-gold">Practice Session</span></h2>
    <p class="setup-subtitle">Customise your quiz to focus on your weakest areas.</p>

    <div class="filter-section">
      <div class="filter-label">Exam Type</div>
      <div class="filter-pills" id="filter-exam">
        ${filterPill('ALL', 'examType', appState.examType)}
        ${filterPill('RN', 'examType', appState.examType)}
        ${filterPill('PN', 'examType', appState.examType)}
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-label">Question Format</div>
      <div class="filter-pills" id="filter-format">
        ${filterPill('ALL', 'format', appState.format)}
        ${filterPill('SATA', 'format', appState.format)}
        ${filterPill('Prioritization', 'format', appState.format)}
        ${filterPill('NGN Case Study', 'format', appState.format)}
        ${filterPill('Multiple Choice', 'format', appState.format)}
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-label">Difficulty</div>
      <div class="filter-pills" id="filter-diff">
        ${filterPill('ALL', 'difficulty', appState.difficulty)}
        ${filterPill('Foundational', 'difficulty', appState.difficulty)}
        ${filterPill('Application', 'difficulty', appState.difficulty)}
        ${filterPill('Analysis', 'difficulty', appState.difficulty)}
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-label">Clinical Category</div>
      <div class="filter-pills" id="filter-cat">
        ${filterPill('ALL', 'category', appState.category)}
        ${Object.values(CATEGORIES).map(c => filterPill(c, 'category', appState.category)).join('')}
      </div>
    </div>

    <div class="filter-section">
      <div class="filter-label">Number of Questions</div>
      <div class="filter-pills" id="filter-count">
        ${[5, 10, 15, 20].map(n => `
          <span class="filter-pill${appState.quizCount === n ? ' active' : ''}"
            onclick="setQuizCount(${n})" data-count="${n}">${n} Questions</span>
        `).join('')}
      </div>
    </div>

    <div style="margin-top: 36px;" id="setup-cta">
      <button class="btn btn-primary btn-xl" onclick="startQuiz()">🚀 Begin Quiz</button>
      <p class="text-muted text-sm" style="margin-top: 12px;" id="q-count-msg">Loading question count...</p>
    </div>
  `;

  wrap.appendChild(inner);

  // After DOM is built, update count
  setTimeout(() => updateSetupCount(), 10);

  return wrap;
}

function filterPill(value, filterKey, currentValue) {
  const active = value === currentValue ? ' active' : '';
  return `<span class="filter-pill${active}" onclick="setFilter('${filterKey}','${value}')">${value}</span>`;
}

function setFilter(key, value) {
  appState[key] = value;
  render();
  updateSetupCount();
}

function setQuizCount(n) {
  appState.quizCount = n;
  render();
  updateSetupCount();
}

function updateSetupCount() {
  const msg = document.getElementById('q-count-msg');
  if (!msg) return;
  quizEngine.setFilters({
    examType: appState.examType,
    format: appState.format,
    category: appState.category,
    difficulty: appState.difficulty,
  });
  const pool = QUESTION_BANK.filter(q => {
    if (appState.examType !== 'ALL' && !q.examType.includes(appState.examType)) return false;
    if (appState.format !== 'ALL' && q.format !== appState.format) return false;
    if (appState.category !== 'ALL' && q.category !== appState.category) return false;
    if (appState.difficulty !== 'ALL' && q.difficulty !== appState.difficulty) return false;
    return true;
  });
  const avail = Math.min(pool.length, appState.quizCount);
  msg.textContent = `${avail} question${avail !== 1 ? 's' : ''} available with current filters`;
  msg.style.color = avail === 0 ? 'var(--danger)' : 'var(--text-muted)';
  document.querySelector('#setup-cta .btn')?.toggleAttribute('disabled', avail === 0);
}

function startQuiz() {
  quizEngine.setFilters({
    examType: appState.examType,
    format: appState.format,
    category: appState.category,
    difficulty: appState.difficulty,
  });
  const count = quizEngine.buildSession(appState.quizCount);
  if (count === 0) { showToast('No questions match your filters. Please adjust.', 'error'); return; }
  appState.selectedAnswers = [];
  appState.answered = false;
  appState.lastResult = null;
  appState.elapsed = 0;
  navigate(SCREEN.QUIZ);
}

/* =========================================
   QUIZ SCREEN
   ========================================= */
function buildQuizScreen() {
  const question = quizEngine.getCurrentQuestion();
  if (!question) { navigate(SCREEN.HOME); return el('div'); }

  const { current, total, pct } = quizEngine.getProgress();
  const wrap = el('div', 'quiz-screen');
  const inner = el('div', 'quiz-inner');

  // ---- Header ----
  const header = el('div', 'quiz-header');
  header.innerHTML = `
    <div class="quiz-meta">
      <span class="quiz-progress-text">Question <strong>${current}</strong> of <strong>${total}</strong></span>
      ${badgeHtml(question.format)}
      ${badgeHtml(question.difficulty, question.difficulty === 'Analysis' ? 'badge-danger' : question.difficulty === 'Application' ? 'badge-warning' : 'badge-teal')}
    </div>
    <div class="quiz-timer" id="quiz-timer">⏱ 00:00</div>
  `;
  inner.appendChild(header);

  // ---- Progress bar ----
  const progressSec = el('div', 'progress-section');
  progressSec.innerHTML = `
    <div class="progress-wrap">
      <div class="progress-bar" id="progress-bar" style="width: ${pct}%"></div>
    </div>
  `;
  inner.appendChild(progressSec);

  // ---- Question Card ----
  const qCard = buildQuestionCard(question);
  inner.appendChild(qCard);

  // ---- Rationale Panel (shown after submit) ----
  if (appState.answered && appState.lastResult) {
    inner.appendChild(buildRationalePanel(appState.lastResult));
  }

  wrap.appendChild(inner);

  // Start timer
  setTimeout(() => {
    quizEngine.startTimer((s) => {
      appState.elapsed = s;
      const timerEl = document.getElementById('quiz-timer');
      if (timerEl) {
        const color = s > 120 ? 'danger' : s > 60 ? 'warning' : '';
        timerEl.className = `quiz-timer${color ? ' ' + color : ''}`;
        timerEl.textContent = `⏱ ${quizEngine.formatTime(s)}`;
      }
    });
  }, 50);

  return wrap;
}

function buildQuestionCard(question) {
  const card = el('div', 'question-card');
  const isSATA = question.format === FORMATS.SATA;
  const isNGN = question.format === FORMATS.NGN;

  let html = '';

  // Question meta
  html += `<div class="question-meta">
    <span class="badge badge-blue">📚 ${question.category}</span>
  </div>`;

  // NGN: case title + scenario + client data
  if (isNGN) {
    html += `<div style="margin-bottom:20px;">
      <h3 style="color:var(--accent-teal);margin-bottom:12px;font-size:1rem;text-transform:uppercase;letter-spacing:0.04em;">
        📋 ${question.caseTitle}
      </h3>
      <div class="question-scenario">${question.scenario}</div>
      <div class="ngn-layout">
        <div class="ngn-client-data">
          <h4>📊 Client Data</h4>
          ${question.clientData.map(d => `
            <div class="ngn-data-row">
              <span>${d.label}</span>
              <span class="${d.alert ? 'alert-value' : ''}">${d.value}</span>
            </div>
          `).join('')}
        </div>
        <div style="display:flex;flex-direction:column;justify-content:center;">
          <div class="info-note" style="background:var(--accent-purple-glow);border:1px solid rgba(155,109,255,0.3);border-radius:var(--radius-md);padding:16px;">
            <p style="font-size:0.8rem;color:var(--accent-purple);font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">NGN Clinical Scenario</p>
            <p style="font-size:0.875rem;color:var(--text-secondary);line-height:1.6;">Apply clinical judgment to analyze the client data and identify priority nursing actions.</p>
          </div>
        </div>
      </div>
    </div>`;
  }

  // SATA instruction
  if (isSATA) {
    html += `<div class="sata-instruction">
      ⚠️ <strong>Select ALL that apply.</strong> There may be more than one correct answer. Partial credit is not awarded — all selections must be correct.
    </div>`;
  }

  // Question stem
  html += `<p class="question-stem">${question.stem}</p>`;

  // Options list
  html += `<ul class="options-list" id="options-list">`;
  question.options.forEach(opt => {
    const isSelected = appState.selectedAnswers.includes(opt.id);
    let optClass = 'option-item';

    if (appState.answered) {
      optClass += ' disabled';
      const isCorrect = question.correctAnswers.includes(opt.id);
      const wasSelected = appState.selectedAnswers.includes(opt.id);

      if (wasSelected && isCorrect) optClass += ' correct';
      else if (wasSelected && !isCorrect) optClass += ' incorrect';
      else if (!wasSelected && isCorrect) optClass += ' missed';
    } else {
      if (isSelected) optClass += ' selected';
    }

    if (isSATA) {
      html += `<li class="${optClass}" onclick="toggleOption('${opt.id}')">
        <div class="option-checkbox">
          ${isSelected || (appState.answered && question.correctAnswers.includes(opt.id)) ? '✓' : ''}
        </div>
        <span class="option-text">${opt.text}</span>
      </li>`;
    } else {
      html += `<li class="${optClass}" onclick="selectOption('${opt.id}')">
        <div class="option-indicator">${opt.id}</div>
        <span class="option-text">${opt.text}</span>
      </li>`;
    }
  });
  html += `</ul>`;

  // Action buttons
  html += `<div class="quiz-actions" style="margin-top:24px;">
    <div class="quiz-actions-left">
      <button class="btn btn-ghost btn-sm" onclick="skipQuestion()">⏭ Skip</button>
    </div>
    <div class="quiz-actions-right">`;

  if (!appState.answered) {
    html += `<button class="btn btn-primary" id="submit-btn" onclick="submitAnswer()" ${appState.selectedAnswers.length === 0 ? 'disabled' : ''}>
      ✔ Submit Answer
    </button>`;
  } else {
    if (quizEngine.isLastQuestion()) {
      html += `<button class="btn btn-primary" onclick="showResults()">📊 View Results</button>`;
    } else {
      html += `<button class="btn btn-primary" onclick="nextQuestion()">Next Question →</button>`;
    }
  }

  html += `</div></div>`;

  card.innerHTML = html;
  return card;
}

/* =========================================
   OPTION SELECTION
   ========================================= */
function selectOption(id) {
  if (appState.answered) return;
  appState.selectedAnswers = [id];
  refreshOptions();
}

function toggleOption(id) {
  if (appState.answered) return;
  const idx = appState.selectedAnswers.indexOf(id);
  if (idx === -1) appState.selectedAnswers.push(id);
  else appState.selectedAnswers.splice(idx, 1);
  refreshOptions();
}

function refreshOptions() {
  const question = quizEngine.getCurrentQuestion();
  const isSATA = question.format === FORMATS.SATA;
  const list = document.getElementById('options-list');
  if (!list) return;

  list.querySelectorAll('.option-item').forEach((item, index) => {
    const optId = question.options[index].id;
    const isSelected = appState.selectedAnswers.includes(optId);

    if (isSATA) {
      item.classList.toggle('selected', isSelected);
      const checkbox = item.querySelector('.option-checkbox');
      if (checkbox) checkbox.innerHTML = isSelected ? '✓' : '';
    } else {
      item.classList.toggle('selected', isSelected);
      const indicator = item.querySelector('.option-indicator');
      if (indicator) {
        indicator.textContent = optId;
      }
    }
  });

  const submitBtn = document.getElementById('submit-btn');
  if (submitBtn) submitBtn.disabled = appState.selectedAnswers.length === 0;
}

/* =========================================
   SUBMIT / NAVIGATION
   ========================================= */
function submitAnswer() {
  if (appState.selectedAnswers.length === 0) return;
  quizEngine.stopTimer();
  const result = quizEngine.submitAnswer(appState.selectedAnswers);
  appState.answered = true;
  appState.lastResult = result;

  // Show toast
  if (result.isCorrect) {
    showToast('✅ Correct! Great clinical thinking.', 'success');
  } else {
    showToast('❌ Incorrect. Review the rationale below.', 'error');
  }

  render();
}

function nextQuestion() {
  quizEngine.stopTimer();
  quizEngine.nextQuestion();
  appState.selectedAnswers = [];
  appState.answered = false;
  appState.lastResult = null;
  appState.elapsed = 0;
  render();
}

function skipQuestion() {
  if (quizEngine.isLastQuestion()) {
    showResults();
    return;
  }
  quizEngine.stopTimer();
  quizEngine.submitAnswer([]); // record as unanswered
  quizEngine.nextQuestion();
  appState.selectedAnswers = [];
  appState.answered = false;
  appState.lastResult = null;
  appState.elapsed = 0;
  render();
}

function showResults() {
  quizEngine.stopTimer();
  // Persist completed session for the review page
  try {
    const results = quizEngine.getResults();
    sessionStorage.setItem('nclex_review_session', JSON.stringify({
      answers: results.answers,
      correct: results.correct,
      total:   results.total,
      pct:     results.pct,
      elapsed: results.elapsed,
    }));
  } catch (_) { /* storage unavailable — review page will show fallback */ }
  navigate(SCREEN.RESULTS);
}

/* =========================================
   RATIONALE PANEL
   ========================================= */
function buildRationalePanel(result) {
  const panel = el('div', 'rationale-panel');
  const { isCorrect, question, selectedIds, correctIds } = result;
  const r = question.rationale;

  panel.innerHTML = `
    <div class="rationale-header">
      <div class="verdict-icon ${isCorrect ? 'correct' : 'incorrect'}">
        ${isCorrect ? '✅' : '❌'}
      </div>
      <div class="verdict-text">
        <h3 class="${isCorrect ? 'correct' : 'incorrect'}">${isCorrect ? 'Correct!' : 'Incorrect'}</h3>
        <p>Review the comprehensive rationale below.</p>
      </div>
    </div>

    <div class="rationale-section rationale-section--concept">
      <div class="rationale-section-label">🧠 Core Concept</div>
      <p>${r.concept}</p>
    </div>

    <div class="rationale-section rationale-section--right">
      <div class="rationale-section-label">✅ Correct Answer Analysis</div>
      <p><strong>Correct: ${correctIds.join(', ')}</strong></p>
      <p>${r.right}</p>
    </div>

    ${r.wrong && r.wrong.length > 0 ? `
    <div class="rationale-section rationale-section--wrong">
      <div class="rationale-section-label">❌ Incorrect Options Explained</div>
      <ul>
        ${r.wrong.map(w => `<li><strong>Option ${w.option}:</strong> ${w.text}</li>`).join('')}
      </ul>
    </div>` : ''}

    <div class="rationale-section rationale-section--objective">
      <div class="rationale-section-label">🎯 Educational Objective</div>
      <p>${r.objective}</p>
    </div>
  `;

  return panel;
}

/* =========================================
   RESULTS SCREEN
   ========================================= */
function buildResultsScreen() {
  const results = quizEngine.getResults();
  const verdict = quizEngine.getVerdictMessage(results.pct);
  const wrap = el('div', 'results-screen');
  const inner = el('div', 'results-inner');

  // Hero
  const hero = el('div', 'results-hero');
  hero.innerHTML = `
    <div class="score-circle-wrap">
      <div class="score-circle" style="--score-pct: ${results.pct * 3.6}deg;">
        <div class="score-number">${results.pct}%</div>
        <div class="score-label">Score</div>
      </div>
    </div>
    <h2 class="results-verdict">${verdict.title}</h2>
    <p class="results-subtitle">${verdict.sub}</p>
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-card-value" style="color:var(--success)">${results.correct}</div>
        <div class="stat-card-label">Correct</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-value" style="color:var(--danger)">${results.incorrect}</div>
        <div class="stat-card-label">Incorrect</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-value" style="color:var(--accent-blue)">${results.total}</div>
        <div class="stat-card-label">Total</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-value" style="color:var(--warning)">${quizEngine.formatTime(Math.round((Date.now() - quizEngine.startTime) / 1000))}</div>
        <div class="stat-card-label">Time</div>
      </div>
    </div>
    <div class="results-actions">
      <button class="btn btn-primary btn-lg" onclick="window.location.href='review.html'">📋 Detailed Review</button>
      <button class="btn btn-secondary btn-lg" onclick="retakeQuiz()">🔁 Retake Quiz</button>
      <button class="btn btn-ghost btn-lg" onclick="navigate(SCREEN.HOME)">🏠 Home</button>
    </div>
  `;
  inner.appendChild(hero);

  // Category breakdown
  if (Object.keys(results.byCategory).length > 0) {
    const catSection = el('div', 'card mb-4');
    catSection.style.padding = '24px';
    let catHtml = '<h3 style="margin-bottom:16px;">📊 Performance by Category</h3>';
    Object.entries(results.byCategory).forEach(([cat, data]) => {
      const pct = Math.round((data.correct / data.total) * 100);
      catHtml += `
        <div style="margin-bottom: 16px;">
          <div class="flex justify-between mb-1">
            <span style="font-size:0.875rem;color:var(--text-secondary)">${cat}</span>
            <span style="font-size:0.875rem;font-weight:600;color:${pct >= 75 ? 'var(--success)' : 'var(--danger)'}">${pct}% (${data.correct}/${data.total})</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar" style="width:${pct}%;background:${pct >= 75 ? 'linear-gradient(90deg,var(--accent-teal),var(--accent-blue))' : 'linear-gradient(90deg,var(--danger),#c62a47)'}"></div>
          </div>
        </div>`;
    });
    catSection.innerHTML = catHtml;
    inner.appendChild(catSection);
  }

  // Review answers
  const reviewSection = el('div', 'review-section');
  reviewSection.innerHTML = '<h3>📝 Question Review</h3>';

  results.answers.forEach((ans, idx) => {
    if (!ans) return;
    const q = ans.question;
    const item = el('div', `review-item${ans.isCorrect ? '' : ''}`);
    item.setAttribute('data-idx', idx);
    item.innerHTML = `
      <div class="review-item-header" onclick="toggleReview(${idx})">
        <div class="review-status ${ans.isCorrect ? 'correct' : 'incorrect'}">${ans.isCorrect ? '✓' : '✗'}</div>
        <p class="review-item-q">Q${idx + 1}: ${q.stem.substring(0, 100)}${q.stem.length > 100 ? '...' : ''}</p>
        <span class="review-chevron">▼</span>
      </div>
      <div class="review-body">
        <div class="review-body-inner">
          <p><strong>Your answer:</strong> ${ans.selectedIds.length > 0 ? ans.selectedIds.join(', ') : '(Skipped)'}</p>
          <p><strong>Correct answer:</strong> ${ans.correctIds.join(', ')}</p>
          <div style="margin-top:10px;padding:12px;background:var(--info-bg);border-radius:var(--radius-sm);border:1px solid var(--info-border);">
            <p style="font-size:0.85rem;font-weight:600;color:var(--accent-blue);margin-bottom:6px;">🧠 Core Concept</p>
            <p style="font-size:0.875rem;">${q.rationale.concept}</p>
          </div>
          <div style="margin-top:10px;padding:12px;background:var(--accent-purple-glow);border-radius:var(--radius-sm);border:1px solid rgba(155,109,255,0.3);">
            <p style="font-size:0.85rem;font-weight:600;color:var(--accent-purple);margin-bottom:6px;">🎯 Educational Objective</p>
            <p style="font-size:0.875rem;">${q.rationale.objective}</p>
          </div>
        </div>
      </div>
    `;
    reviewSection.appendChild(item);
  });

  inner.appendChild(reviewSection);
  wrap.appendChild(inner);
  return wrap;
}

function toggleReview(idx) {
  const item = document.querySelector(`[data-idx="${idx}"]`);
  if (item) item.classList.toggle('open');
}

function retakeQuiz() {
  const count = quizEngine.buildSession(appState.quizCount);
  if (count === 0) { navigate(SCREEN.HOME); return; }
  appState.selectedAnswers = [];
  appState.answered = false;
  appState.lastResult = null;
  navigate(SCREEN.QUIZ);
}

/* =========================================
   NAVIGATION
   ========================================= */
function navigate(screen) {
  quizEngine.stopTimer();
  appState.screen = screen;
  render();
  window.scrollTo(0, 0);
}

/* =========================================
   TOAST
   ========================================= */
function buildToastContainer() {
  return el('div', 'toast-container', 'toast-container');
}

let toastTimeout;
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  container.innerHTML = '';
  const toast = el('div', `toast ${type}`);
  toast.textContent = message;
  container.appendChild(toast);
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.remove(); }, 3500);
}

/* =========================================
   BADGE HELPER
   ========================================= */
function badgeHtml(text, extraClass = '') {
  const classMap = {
    'SATA': 'badge-warning',
    'Prioritization': 'badge-blue',
    'NGN Case Study': 'badge-purple',
    'Multiple Choice': 'badge-teal',
    'Foundational': 'badge-teal',
    'Application': 'badge-warning',
    'Analysis': 'badge-danger',
  };
  const cls = extraClass || classMap[text] || 'badge-teal';
  return `<span class="badge ${cls}">${text}</span>`;
}

/* =========================================
   DOM HELPERS
   ========================================= */
function el(tag, className = '', id = '') {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (id) e.id = id;
  return e;
}

function btn(text, className, onClick) {
  const b = el('button', className);
  b.textContent = text;
  b.onclick = onClick;
  return b;
}

/* =========================================
   BACKGROUND PARTICLES
   ========================================= */
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  const COLORS = ['rgba(212,175,55,', 'rgba(240,192,64,', 'rgba(46,139,90,'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Radial gradient overlay
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W);
    grad.addColorStop(0, 'rgba(5, 18, 10, 0.0)');
    grad.addColorStop(1, 'rgba(5, 14, 8, 0.65)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();
    });

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212,175,55,${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawFrame);
  }

  resize();
  initParticles();
  drawFrame();
  window.addEventListener('resize', () => { resize(); initParticles(); });
}

/* =========================================
   BOOT
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  render();
  initBackground();
});

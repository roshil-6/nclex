/**
 * NursePrep Pro — Quiz Review Controller
 * ----------------------------------------
 * Reads completed quiz session from sessionStorage,
 * renders a step-by-step review interface:
 *   - Fixed topbar with live Score + Timer
 *   - Question card with Answer Matrix
 *   - Tabbed Rationale block
 *   - Fixed footer with Prev/Next nav + dot indicators
 *   - Utility overlay (Download / Share / Print)
 *   - Completion modal → redirect to index.html
 */

/* =============================================
   MODULE STATE
============================================= */
const ReviewState = {
  answers:      [],       // [{questionId, selectedIds, correctIds, isCorrect, question}]
  index:        0,        // current review position (0-based)
  reviewStart:  Date.now(),
  timerHandle:  null,
  overlayOpen:  false,
  totalQ:       0,
  correctCount: 0,
};

/* =============================================
   BOOT
============================================= */
document.addEventListener('DOMContentLoaded', () => {
  loadSession();
  initParticles();
  bindUtilityMenu();
  bindCompletionModal();
  bindFooterNav();
  startReviewTimer();
});

/* =============================================
   SESSION LOADING
============================================= */
function loadSession() {
  let raw;
  try {
    raw = JSON.parse(sessionStorage.getItem('nclex_review_session'));
  } catch (_) { raw = null; }

  if (!raw || !Array.isArray(raw.answers) || raw.answers.length === 0) {
    showNoData();
    return;
  }

  ReviewState.answers      = raw.answers;
  ReviewState.totalQ       = raw.answers.length;
  ReviewState.correctCount = raw.answers.filter(a => a && a.isCorrect).length;
  ReviewState.index        = 0;

  buildDots();
  renderQuestion(0);
}

function showNoData() {
  document.getElementById('rv-content').innerHTML = `
    <div class="rv-loading" style="text-align:center">
      <div style="font-size:3rem;margin-bottom:16px">📭</div>
      <h3 style="color:var(--text-primary);margin-bottom:8px">No review session found</h3>
      <p style="color:var(--text-muted);margin-bottom:24px">Complete a quiz first, then launch the detailed review.</p>
      <a href="index.html" class="btn btn-primary">🏠 Back to Dashboard</a>
    </div>`;
  document.getElementById('rv-score-text').textContent = 'No session';
}

/* =============================================
   DOT INDICATORS
============================================= */
function buildDots() {
  const wrap = document.getElementById('rv-dots');
  wrap.innerHTML = '';
  ReviewState.answers.forEach((ans, i) => {
    const d = document.createElement('div');
    d.className = 'rv-dot' +
      (ans && ans.isCorrect  ? ' correct'  : '') +
      (ans && !ans.isCorrect && ans.selectedIds && ans.selectedIds.length > 0 ? ' incorrect' : '') +
      (ans && ans.selectedIds && ans.selectedIds.length === 0 ? ' skipped' : '') +
      (i === 0 ? ' active' : '');
    d.setAttribute('role', 'listitem');
    d.setAttribute('aria-label', `Question ${i + 1}`);
    d.title = `Q${i + 1}: ${ans && ans.isCorrect ? 'Correct' : 'Incorrect'}`;
    d.onclick = () => jumpTo(i);
    wrap.appendChild(d);
  });
}

function refreshDots(idx) {
  document.querySelectorAll('.rv-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
  // scroll active dot into view
  const activeDot = document.querySelectorAll('.rv-dot')[idx];
  activeDot?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
}

/* =============================================
   TOPBAR METRICS
============================================= */
function refreshTopbar(idx) {
  const total   = ReviewState.totalQ;
  const correct = ReviewState.correctCount;
  const pct     = total > 0 ? Math.round((idx + 1) / total * 100) : 0;

  // Progress
  document.getElementById('rv-progress-label').textContent = `Q ${idx + 1} / ${total}`;
  const fill = document.getElementById('rv-progress-fill');
  fill.style.width = pct + '%';
  fill.parentElement.setAttribute('aria-valuenow', pct);

  // Score
  document.getElementById('rv-score-text').textContent = `Score: ${correct} / ${total}`;
}

/* =============================================
   REVIEW TIMER
============================================= */
function startReviewTimer() {
  ReviewState.reviewStart = Date.now();
  ReviewState.timerHandle = setInterval(() => {
    const elapsed = Math.round((Date.now() - ReviewState.reviewStart) / 1000);
    document.getElementById('rv-timer-text').textContent = formatTime(elapsed);
  }, 1000);
}

function formatTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, '0');
  const sec = (s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

/* =============================================
   QUESTION RENDERER
============================================= */
function renderQuestion(idx) {
  ReviewState.index = idx;
  const ans = ReviewState.answers[idx];
  if (!ans) return;

  const q   = ans.question;
  const content = document.getElementById('rv-content');

  // Build card HTML
  const isSATA = q.format === 'SATA';
  const isNGN  = q.format === 'NGN Case Study';

  content.innerHTML = buildCardHTML(ans, q, isSATA, isNGN, idx);

  // Activate first rationale tab
  activateTab('tab-concept');

  // Update surrounding state
  refreshTopbar(idx);
  refreshDots(idx);
  updateFooterNav(idx);

  // Scroll top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Card builder ---- */
function buildCardHTML(ans, q, isSATA, isNGN, idx) {
  return `
    <div class="rv-card" role="article" aria-label="Question ${idx + 1} review">

      <!-- ── Q header ── -->
      <div class="rv-q-header">
        <span class="rv-q-number">Question ${idx + 1} of ${ReviewState.totalQ}</span>
        <div class="rv-q-badges">
          ${buildBadge(q.format)}
          ${buildBadge(q.difficulty, q.difficulty === 'Analysis' ? 'badge-danger' : q.difficulty === 'Application' ? 'badge-warning' : 'badge-teal')}
          <span class="badge badge-blue" style="font-size:.68rem">📚 ${q.category}</span>
        </div>
      </div>

      <!-- ── Verdict banner ── -->
      <div class="rv-verdict-banner ${ans.isCorrect ? 'correct' : 'incorrect'}" aria-live="polite">
        <div class="rv-verdict-icon" aria-hidden="true">${ans.isCorrect ? '✓' : '✗'}</div>
        <span>
          ${ans.isCorrect
            ? 'Your answer was <strong>correct</strong>.'
            : `Your answer was <strong>incorrect</strong>. Correct: <strong>${ans.correctIds.join(', ')}</strong>`}
          ${isSATA ? ' <em>(SATA — all selections must match)</em>' : ''}
        </span>
      </div>

      <!-- ── Body ── -->
      <div class="rv-q-body">
        ${isNGN ? buildNGNBlock(q) : ''}
        ${isSATA ? `<div class="sata-instruction" style="margin-bottom:16px">⚠️ <strong>Select All That Apply</strong> — all correct options must be chosen.</div>` : ''}
        <p class="rv-q-stem">${q.stem}</p>
      </div>

      <!-- ── Answer Matrix ── -->
      <div class="rv-matrix-section">
        <div class="rv-legend">
          <div class="rv-legend-item"><div class="rv-legend-dot correct"></div>Correct selection</div>
          <div class="rv-legend-item"><div class="rv-legend-dot incorrect"></div>Incorrect selection</div>
          <div class="rv-legend-item"><div class="rv-legend-dot missed"></div>Missed correct answer</div>
        </div>
        <div class="rv-matrix-label">Answer Matrix</div>
        ${buildAnswerMatrix(ans, q)}
      </div>

      <!-- ── Rationale ── -->
      ${buildRationaleBlock(q.rationale)}

    </div>`;
}

/* ── NGN client data block ── */
function buildNGNBlock(q) {
  if (!q.caseTitle && !q.scenario) return '';
  return `
    <div style="margin-bottom:18px">
      <h3 style="color:var(--accent-teal);font-size:.95rem;text-transform:uppercase;letter-spacing:.04em;margin-bottom:10px">
        📋 ${q.caseTitle || 'Clinical Case'}
      </h3>
      <div class="rv-scenario">${q.scenario}</div>
      ${q.clientData ? `
        <div class="rv-client-table" role="table" aria-label="Client data">
          <div class="rv-client-table-title" role="rowheader">📊 Client Data</div>
          ${q.clientData.map(d => `
            <div class="rv-client-row" role="row">
              <span role="cell">${d.label}</span>
              <span class="${d.alert ? 'rv-alert' : ''}" role="cell">${d.value}</span>
            </div>`).join('')}
        </div>` : ''}
    </div>`;
}

/* ── Answer matrix table ── */
function buildAnswerMatrix(ans, q) {
  const rows = q.options.map(opt => {
    const isSelected = ans.selectedIds && ans.selectedIds.includes(opt.id);
    const isCorrect  = q.correctAnswers.includes(opt.id);

    let rowClass = 'rv-row-neutral';
    let tag = '';
    let statusIcon = '';

    if (isSelected && isCorrect)  { rowClass = 'rv-row-correct';   tag = `<span class="rv-row-tag rv-tag-correct">✓ Correct</span>`;   statusIcon = '✅'; }
    else if (isSelected && !isCorrect) { rowClass = 'rv-row-incorrect'; tag = `<span class="rv-row-tag rv-tag-incorrect">✗ Wrong</span>`;    statusIcon = '❌'; }
    else if (!isSelected && isCorrect) { rowClass = 'rv-row-missed';    tag = `<span class="rv-row-tag rv-tag-missed">↑ Missed</span>`;    statusIcon = '⚠'; }
    else { tag = `<span class="rv-row-tag rv-tag-neutral">–</span>`; }

    return `
      <tr class="${rowClass}" role="row" aria-label="Option ${opt.id}">
        <td><span class="rv-opt-chip" aria-hidden="true">${opt.id}</span></td>
        <td>${opt.text}</td>
        <td>${tag}</td>
        <td class="rv-opt-status" aria-label="${statusIcon || 'Not selected'}">${statusIcon}</td>
      </tr>`;
  }).join('');

  return `
    <table class="rv-matrix-table" role="table" aria-label="Answer options matrix">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Answer Option</th>
          <th scope="col">Status</th>
          <th scope="col">Result</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

/* ── Tabbed rationale block ── */
function buildRationaleBlock(r) {
  const hasWrong = r.wrong && r.wrong.length > 0;
  return `
    <div class="rv-rationale" role="region" aria-label="Rationale">
      <div class="rv-rationale-tabs" role="tablist" aria-label="Rationale sections">
        <button class="rv-tab active" id="tab-concept"   role="tab" aria-selected="true"  aria-controls="panel-concept"   onclick="activateTab('tab-concept')">🧠 Core Concept</button>
        <button class="rv-tab"        id="tab-correct"   role="tab" aria-selected="false" aria-controls="panel-correct"   onclick="activateTab('tab-correct')">✅ Right Answer</button>
        ${hasWrong ? `<button class="rv-tab" id="tab-wrong" role="tab" aria-selected="false" aria-controls="panel-wrong" onclick="activateTab('tab-wrong')">❌ Why Wrong</button>` : ''}
        <button class="rv-tab"        id="tab-objective" role="tab" aria-selected="false" aria-controls="panel-objective" onclick="activateTab('tab-objective')">🎯 Objective</button>
      </div>
      <div class="rv-tab-panels">
        <div id="panel-concept"   class="rv-tab-panel active" role="tabpanel" aria-labelledby="tab-concept">
          <p>${r.concept}</p>
        </div>
        <div id="panel-correct"   class="rv-tab-panel" role="tabpanel" aria-labelledby="tab-correct">
          <p>${r.right}</p>
        </div>
        ${hasWrong ? `
        <div id="panel-wrong"     class="rv-tab-panel" role="tabpanel" aria-labelledby="tab-wrong">
          <ul class="rv-rationale-list">
            ${r.wrong.map(w => `<li><strong>Option ${w.option}:</strong> ${w.text}</li>`).join('')}
          </ul>
        </div>` : ''}
        <div id="panel-objective" class="rv-tab-panel" role="tabpanel" aria-labelledby="tab-objective">
          <div class="rv-objective-box">${r.objective}</div>
        </div>
      </div>
    </div>`;
}

/* ── Tab switching ── */
function activateTab(tabId) {
  document.querySelectorAll('.rv-tab').forEach(t => {
    const active = t.id === tabId;
    t.classList.toggle('active', active);
    t.setAttribute('aria-selected', active);
  });
  document.querySelectorAll('.rv-tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === tabId.replace('tab-', 'panel-'));
  });
}

/* ── Badge helper ── */
function buildBadge(text, cls = '') {
  const map = {
    'SATA': 'badge-warning', 'Prioritization': 'badge-blue',
    'NGN Case Study': 'badge-purple', 'Multiple Choice': 'badge-teal',
    'Foundational': 'badge-teal', 'Application': 'badge-warning', 'Analysis': 'badge-danger',
  };
  return `<span class="badge ${cls || map[text] || 'badge-teal'}">${text}</span>`;
}

/* =============================================
   FOOTER NAVIGATION
============================================= */
function bindFooterNav() {
  document.getElementById('rv-prev-btn').addEventListener('click', () => {
    if (ReviewState.index > 0) jumpTo(ReviewState.index - 1);
  });
  document.getElementById('rv-next-btn').addEventListener('click', () => {
    const next = ReviewState.index + 1;
    if (next >= ReviewState.totalQ) {
      openCompletionModal();
    } else {
      jumpTo(next);
    }
  });
}

function jumpTo(idx) {
  if (idx < 0 || idx >= ReviewState.totalQ) return;
  renderQuestion(idx);
}

function updateFooterNav(idx) {
  const total = ReviewState.totalQ;
  const prevBtn = document.getElementById('rv-prev-btn');
  const nextBtn = document.getElementById('rv-next-btn');

  prevBtn.disabled = (idx === 0);

  const isLast = (idx === total - 1);
  nextBtn.innerHTML = isLast
    ? `Finish <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`
    : `Next <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`;
  nextBtn.classList.toggle('rv-last', isLast);
  nextBtn.setAttribute('aria-label', isLast ? 'Finish review' : 'Next question');
}

/* =============================================
   UTILITY OVERLAY
============================================= */
function bindUtilityMenu() {
  const btn      = document.getElementById('rv-util-btn');
  const overlay  = document.getElementById('rv-overlay');
  const backdrop = document.getElementById('rv-overlay-backdrop');
  const close    = document.getElementById('rv-overlay-close');

  function openOverlay() {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    backdrop.classList.add('open');
    backdrop.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('active');
    ReviewState.overlayOpen = true;
    close.focus();
  }

  function closeOverlay() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('active');
    ReviewState.overlayOpen = false;
    btn.focus();
  }

  btn.addEventListener('click', () => ReviewState.overlayOpen ? closeOverlay() : openOverlay());
  close.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);

  // Keyboard trap
  overlay.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeOverlay();
  });

  // ── Action handlers ──
  document.getElementById('rv-action-download').addEventListener('click', () => {
    closeOverlay();
    handleDownload();
  });
  document.getElementById('rv-action-share').addEventListener('click', () => {
    closeOverlay();
    handleShare();
  });
  document.getElementById('rv-action-print').addEventListener('click', () => {
    closeOverlay();
    handlePrint();
  });
}

function handleDownload() {
  // Generate a downloadable text summary without resetting state
  const lines = ['NursePrep Pro — Quiz Review Summary', '='.repeat(44), ''];
  ReviewState.answers.forEach((ans, i) => {
    if (!ans) return;
    const q = ans.question;
    lines.push(`Q${i + 1}. [${ans.isCorrect ? 'CORRECT' : 'INCORRECT'}] ${q.stem}`);
    lines.push(`   Your answer:    ${ans.selectedIds && ans.selectedIds.length ? ans.selectedIds.join(', ') : '(Skipped)'}`);
    lines.push(`   Correct answer: ${ans.correctIds.join(', ')}`);
    lines.push(`   Core Concept:   ${q.rationale.concept}`);
    lines.push(`   Objective:      ${q.rationale.objective}`);
    lines.push('');
  });
  const score = ReviewState.correctCount;
  const total = ReviewState.totalQ;
  lines.push(`Final Score: ${score}/${total} (${Math.round(score/total*100)}%)`);

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `nclex-review-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('⬇ Review downloaded successfully.', 'success');
}

function handleShare() {
  const score  = ReviewState.correctCount;
  const total  = ReviewState.totalQ;
  const pct    = Math.round(score / total * 100);
  const text   = `I just scored ${score}/${total} (${pct}%) on NursePrep Pro's NCLEX practice quiz! 🏥`;
  const url    = window.location.origin + '/index.html';

  if (navigator.share) {
    navigator.share({ title: 'NursePrep Pro Score', text, url }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(`${text}\n${url}`)
      .then(() => showToast('🔗 Link copied to clipboard!', 'success'))
      .catch(() => showToast('Unable to copy. Please copy the URL manually.', 'error'));
  } else {
    showToast('Share not supported in this browser.', 'info');
  }
}

function handlePrint() {
  showToast('🖨 Opening print dialog…', 'info');
  setTimeout(() => window.print(), 300);
}

/* =============================================
   COMPLETION MODAL
============================================= */
function bindCompletionModal() {
  document.getElementById('rv-complete-dashboard').addEventListener('click', () => {
    clearInterval(ReviewState.timerHandle);
    window.location.href = 'index.html';
  });
  document.getElementById('rv-complete-restart').addEventListener('click', () => {
    closeCompletionModal();
    jumpTo(0);
  });
}

function openCompletionModal() {
  const score   = ReviewState.correctCount;
  const total   = ReviewState.totalQ;
  const elapsed = Math.round((Date.now() - ReviewState.reviewStart) / 1000);
  const pct     = total > 0 ? Math.round(score / total * 100) : 0;

  document.getElementById('rv-complete-stats').innerHTML = `
    <div class="rv-complete-stat">
      <div class="rv-complete-stat-value" style="color:var(--accent-teal)">${score}</div>
      <div class="rv-complete-stat-label">Correct</div>
    </div>
    <div class="rv-complete-stat">
      <div class="rv-complete-stat-value" style="color:var(--danger)">${total - score}</div>
      <div class="rv-complete-stat-label">Incorrect</div>
    </div>
    <div class="rv-complete-stat">
      <div class="rv-complete-stat-value" style="color:var(--warning)">${pct}%</div>
      <div class="rv-complete-stat-label">Score</div>
    </div>`;

  document.getElementById('rv-complete-backdrop').classList.add('open');
  document.getElementById('rv-complete-backdrop').setAttribute('aria-hidden', 'false');
  document.getElementById('rv-complete-modal').classList.add('open');
  document.getElementById('rv-complete-modal').setAttribute('aria-hidden', 'false');
  document.getElementById('rv-complete-dashboard').focus();
}

function closeCompletionModal() {
  document.getElementById('rv-complete-backdrop').classList.remove('open');
  document.getElementById('rv-complete-backdrop').setAttribute('aria-hidden', 'true');
  document.getElementById('rv-complete-modal').classList.remove('open');
  document.getElementById('rv-complete-modal').setAttribute('aria-hidden', 'true');
}

/* =============================================
   TOAST
============================================= */
let _toastTimer;
function showToast(msg, type = 'info') {
  const c = document.getElementById('toast-container');
  if (!c) return;
  clearTimeout(_toastTimer);
  c.innerHTML = '';
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.setAttribute('role', 'status');
  t.textContent = msg;
  c.appendChild(t);
  _toastTimer = setTimeout(() => t.remove(), 3800);
}

/* =============================================
   BACKGROUND PARTICLES
============================================= */
function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  const COLORS = ['rgba(212,175,55,', 'rgba(240,192,64,', 'rgba(46,139,90,'];

  function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }

  function init() {
    particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      opacity: Math.random() * 0.35 + 0.08,
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.opacity})`;
      ctx.fill();
    });
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(212,175,55,${0.09 * (1 - d / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }

  resize(); init(); frame();
  window.addEventListener('resize', () => { resize(); init(); });
}

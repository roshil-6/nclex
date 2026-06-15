/**
 * NursePrep Pro — Quiz Engine
 * Manages quiz state, scoring, filtering, and session tracking.
 */

class QuizEngine {
  constructor() {
    this.allQuestions = QUESTION_BANK;
    this.sessionQuestions = [];
    this.currentIndex = 0;
    this.userAnswers = [];
    this.score = 0;
    this.startTime = null;
    this.elapsed = 0;
    this.timerInterval = null;

    // Session filters
    this.filters = {
      examType: 'RN',
      format: 'ALL',
      category: 'ALL',
      difficulty: 'ALL',
    };
  }

  /* ---- Configuration ---- */
  setFilters(filters) {
    this.filters = { ...this.filters, ...filters };
  }

  /* ---- Build question set ---- */
  buildSession(limit = 10) {
    let pool = this.allQuestions.filter(q => {
      if (this.filters.examType !== 'ALL' && !q.examType.includes(this.filters.examType)) return false;
      if (this.filters.format !== 'ALL' && q.format !== this.filters.format) return false;
      if (this.filters.category !== 'ALL' && q.category !== this.filters.category) return false;
      if (this.filters.difficulty !== 'ALL' && q.difficulty !== this.filters.difficulty) return false;
      return true;
    });

    // Shuffle pool
    pool = this._shuffle(pool);
    this.sessionQuestions = pool.slice(0, Math.min(limit, pool.length));
    this.currentIndex = 0;
    this.userAnswers = new Array(this.sessionQuestions.length).fill(null);
    this.score = 0;
    this.startTime = Date.now();
    this.elapsed = 0;

    return this.sessionQuestions.length;
  }

  /* ---- Current question ---- */
  getCurrentQuestion() {
    return this.sessionQuestions[this.currentIndex] || null;
  }

  isLastQuestion() {
    return this.currentIndex === this.sessionQuestions.length - 1;
  }

  getProgress() {
    return {
      current: this.currentIndex + 1,
      total: this.sessionQuestions.length,
      pct: ((this.currentIndex) / this.sessionQuestions.length) * 100,
    };
  }

  /* ---- Answer Submission ---- */
  submitAnswer(selectedIds) {
    const question = this.getCurrentQuestion();
    if (!question) return null;

    const correct = question.correctAnswers;
    const isCorrect = this._arraysEqual(selectedIds.sort(), correct.sort());

    const result = {
      questionId: question.id,
      selectedIds,
      correctIds: correct,
      isCorrect,
      question,
    };

    this.userAnswers[this.currentIndex] = result;
    if (isCorrect) this.score++;

    return result;
  }

  /* ---- Navigation ---- */
  nextQuestion() {
    if (this.currentIndex < this.sessionQuestions.length - 1) {
      this.currentIndex++;
      return true;
    }
    return false;
  }

  /* ---- Results ---- */
  getResults() {
    const total = this.sessionQuestions.length;
    const correct = this.score;
    const incorrect = total - correct;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);

    const byCategory = {};
    this.userAnswers.forEach((ans) => {
      if (!ans) return;
      const cat = ans.question.category;
      if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0 };
      byCategory[cat].total++;
      if (ans.isCorrect) byCategory[cat].correct++;
    });

    return { total, correct, incorrect, pct, elapsed, byCategory, answers: this.userAnswers };
  }

  getVerdictMessage(pct) {
    if (pct >= 90) return { title: '🏆 Exceptional Performance!', sub: 'You\'re ready to ace the NCLEX.' };
    if (pct >= 75) return { title: '✅ Passing Standard Met!', sub: 'Solid performance — keep practicing weak areas.' };
    if (pct >= 60) return { title: '📈 Making Progress!', sub: 'Below passing — review your rationales carefully.' };
    return { title: '📚 Keep Studying!', sub: 'Focus on understanding the "why" behind each answer.' };
  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  /* ---- Timer ---- */
  startTimer(onTick) {
    this.startTime = this.startTime || Date.now();
    this.timerInterval = setInterval(() => {
      this.elapsed = Math.round((Date.now() - this.startTime) / 1000);
      onTick(this.elapsed);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
  }

  /* ---- Utils ---- */
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => v === b[i]);
  }
}

// Global instance
const quizEngine = new QuizEngine();

/**
 * Plain-language copy analysis. Heuristic, deterministic and dependency-free.
 */

/** Approximate English syllable count. */
export function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = stripped.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}

export function words(text: string): string[] {
  return text.match(/[A-Za-z0-9’']+(?:[-'][A-Za-z0-9]+)*/g) ?? [];
}

export function sentences(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => words(s).length > 0);
}

export interface Readability {
  words: number;
  sentences: number;
  avgSentence: number;
  fleschEase: number;
  grade: number;
  longSentences: string[];
  passive: string[];
  readingTimeSec: number;
}

export function readability(text: string): Readability {
  const w = words(text);
  const s = sentences(text);
  const syl = w.reduce((n, x) => n + syllables(x), 0);
  const wc = Math.max(1, w.length);
  const sc = Math.max(1, s.length);
  const fleschEase = 206.835 - 1.015 * (wc / sc) - 84.6 * (syl / wc);
  const grade = 0.39 * (wc / sc) + 11.8 * (syl / wc) - 15.59;
  const passiveRe = /\b(?:is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/i;
  return {
    words: w.length,
    sentences: s.length,
    avgSentence: w.length / sc,
    fleschEase: Math.max(0, Math.min(100, fleschEase)),
    grade: Math.max(0, grade),
    longSentences: s.filter((x) => words(x).length > 25),
    passive: s.filter((x) => passiveRe.test(x)),
    readingTimeSec: Math.round((w.length / 238) * 60),
  };
}

export function easeLabel(score: number): string {
  if (score >= 80) return 'Very easy';
  if (score >= 60) return 'Plain English';
  if (score >= 50) return 'Fairly difficult';
  if (score >= 30) return 'Difficult';
  return 'Very difficult';
}

/** Words that sound impressive but carry little meaning in marketing copy. */
export const VAGUE_WORDS = [
  'innovative', 'cutting-edge', 'revolutionary', 'world-class', 'best-in-class', 'next-gen', 'next-generation', 'synergy',
  'seamless', 'seamlessly', 'robust', 'leverage', 'empower', 'unlock', 'game-changing', 'game-changer', 'disruptive',
  'holistic', 'paradigm', 'solutions', 'solution', 'cutting edge', 'state-of-the-art', 'supercharge', 'elevate',
  'transform', 'reimagine', 'unparalleled', 'unleash', 'effortless', 'effortlessly', 'magic', 'magical', 'ultimate',
];

export interface HeadlineReport {
  words: number;
  characters: number;
  grade: number;
  vague: string[];
  hasNumber: boolean;
  hasYou: boolean;
  startsWithVerb: boolean;
  issues: Array<{ level: 'good' | 'warn' | 'bad'; message: string }>;
  score: number;
}

const COMMON_VERBS = ['build', 'ship', 'launch', 'get', 'start', 'grow', 'plan', 'create', 'design', 'make', 'save', 'cut', 'find', 'turn', 'stop', 'run', 'sell', 'hire', 'learn', 'track', 'manage', 'automate', 'reduce', 'win', 'close', 'scale', 'see', 'know'];

export function analyzeHeadline(text: string): HeadlineReport {
  const w = words(text);
  const lower = text.toLowerCase();
  const vague = VAGUE_WORDS.filter((v) => new RegExp(`\\b${v.replace('-', '[- ]')}\\b`, 'i').test(lower));
  const r = readability(text);
  const hasNumber = /\d/.test(text);
  const hasYou = /\b(you|your|you're)\b/i.test(text);
  const startsWithVerb = COMMON_VERBS.includes((w[0] ?? '').toLowerCase());
  const issues: HeadlineReport['issues'] = [];
  let score = 100;

  if (w.length === 0) return { words: 0, characters: 0, grade: 0, vague: [], hasNumber, hasYou, startsWithVerb, issues: [{ level: 'warn', message: 'Enter a headline to analyze.' }], score: 0 };
  if (w.length < 4) { issues.push({ level: 'warn', message: 'Very short — make sure it still says what you do.' }); score -= 10; }
  else if (w.length > 12) { issues.push({ level: 'bad', message: `${w.length} words — headlines over 12 words are skimmed, not read.` }); score -= 20; }
  else issues.push({ level: 'good', message: `${w.length} words — within the 6–12 word range that scans well.` });
  if (text.length > 70) { issues.push({ level: 'warn', message: `${text.length} characters — will wrap to 3+ lines at large hero sizes.` }); score -= 10; }
  if (vague.length) { issues.push({ level: 'bad', message: `Vague words: ${vague.join(', ')}. Replace with a concrete outcome.` }); score -= 15 * Math.min(vague.length, 3); }
  else issues.push({ level: 'good', message: 'No vague marketing words.' });
  if (r.grade > 9) { issues.push({ level: 'warn', message: `Reading grade ${r.grade.toFixed(1)} — aim for grade 8 or below.` }); score -= 10; }
  if (hasNumber) issues.push({ level: 'good', message: 'Includes a number — specificity increases credibility.' });
  else issues.push({ level: 'warn', message: 'Consider a specific number (time saved, customers, results).' });
  if (hasYou || startsWithVerb) issues.push({ level: 'good', message: hasYou ? 'Speaks to the reader directly.' : 'Leads with an action verb.' });
  if (/!/.test(text)) { issues.push({ level: 'warn', message: 'Exclamation marks reduce perceived credibility.' }); score -= 5; }
  if (text === text.toUpperCase() && /[A-Z]/.test(text)) { issues.push({ level: 'warn', message: 'All caps is harder to read — let typography carry emphasis.' }); score -= 5; }

  return { words: w.length, characters: text.length, grade: r.grade, vague, hasNumber, hasYou, startsWithVerb, issues, score: Math.max(0, Math.min(100, score)) };
}

export const WEAK_CTAS = ['submit', 'click here', 'learn more', 'read more', 'go', 'continue', 'ok', 'send', 'here', 'more', 'next', 'enter', 'start', 'buy'];

export function analyzeCta(label: string): { level: 'good' | 'warn' | 'bad'; message: string; suggestion?: string } {
  const t = label.trim().toLowerCase();
  if (!t) return { level: 'warn', message: 'Empty label.' };
  const w = words(t).length;
  if (WEAK_CTAS.includes(t)) {
    const suggestions: Record<string, string> = {
      submit: 'Send my request', 'click here': 'Download the guide', 'learn more': 'See how it works', 'read more': 'Read the case study',
      continue: 'Continue to payment', send: 'Send message', start: 'Start free trial', buy: 'Buy now — ships today', go: 'Get my quote',
    };
    return { level: 'bad', message: 'Generic — it does not say what happens next.', suggestion: suggestions[t] ?? 'Name the outcome, e.g. “Get my free audit”' };
  }
  if (w > 5) return { level: 'warn', message: `${w} words — keep calls to action to 2–5 words.` };
  if (/\b(my|your|free|now|today|instant|in \d)/.test(t)) return { level: 'good', message: 'Specific and value-led.' };
  return { level: 'good', message: 'Clear action. Consider adding the value (“free”, “in 2 minutes”).' };
}

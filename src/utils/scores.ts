import type { HighScore } from '../types/tetris';

const KEY = 'tetris_hiscores';
const MAX = 10;

export function getHighScores(): HighScore[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HighScore[]) : [];
  } catch {
    return [];
  }
}

export function saveHighScore(entry: HighScore): HighScore[] {
  const scores = getHighScores();
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const trimmed = scores.slice(0, MAX);
  localStorage.setItem(KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function isHighScore(score: number): boolean {
  const scores = getHighScores();
  return scores.length < MAX || score > (scores[scores.length - 1]?.score ?? 0);
}

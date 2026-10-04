import type { PatternName, SignalDirection } from '@/types/domain';
import { htfClassOf } from './diagnostic-trace';

/**
 * Исследовательский канал «кандидаты ДО confidence-гейта» (флаг
 * `--ungated-diag` в backtest/horizon-audit.ts).
 *
 * Детекторы вызывают ungatedCandidate() непосредственно перед своим
 * confidence-гейтом и продолжают работать как раньше: гейт, возвращаемые
 * результаты и gate-воронка не меняются. Вне трассировки вызов — один
 * `if (buffer !== null)`. Кандидаты копятся в буфере, который
 * buildOccurrences() после каждого бара забирает через
 * drainUngatedCandidates() и снабжает исходами.
 *
 * Результаты НЕ входят в вердикты аудита: только исследование.
 */
export interface UngatedCandidate {
  name: PatternName;
  direction: SignalDirection;
  confidence: number;
  /** Порог confidence-гейта этого детектора (прошёл ли кандидат гейт: confidence >= threshold). */
  threshold: number;
  /** Класс HTF-множителя: '1.00-bos' | '0.75-choch' | '0.40-range' | 'other'. */
  htfClass: string;
}

let buffer: UngatedCandidate[] | null = null;

export function beginUngatedDiag(): void {
  buffer = [];
}

export function endUngatedDiag(): void {
  buffer = null;
}

export function isUngatedDiagActive(): boolean {
  return buffer !== null;
}

export function ungatedCandidate(
  name: PatternName,
  direction: SignalDirection,
  confidence: number,
  threshold: number,
  htfMultiplier: number,
): void {
  if (buffer === null) return;
  buffer.push({ name, direction, confidence, threshold, htfClass: htfClassOf(htfMultiplier) });
}

/** Забирает и очищает накопленных кандидатов (пустой массив вне трассировки). */
export function drainUngatedCandidates(): UngatedCandidate[] {
  if (buffer === null || buffer.length === 0) return [];
  const out = buffer;
  buffer = [];
  return out;
}

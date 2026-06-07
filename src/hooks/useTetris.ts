import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createBoard, randomTetromino, isValidPosition, mergePiece,
  clearLines, calcScore, calcLevel, dropInterval, tryRotate, ghostPosition,
} from '../utils/engine';
import type { GameState, Tetromino } from '../types/tetris';
import { useSound } from './useSound';

const INITIAL_STATE = (): GameState => ({
  board: createBoard(),
  current: null,
  next: null,
  held: null,
  canHold: true,
  score: 0,
  level: 0,
  lines: 0,
  isRunning: false,
  isOver: false,
  isPaused: false,
  lockDelayTick: false,
});

export function useTetris() {
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const dropRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const { play, muted, toggleMute } = useSound();

  const clearDrop = () => { if (dropRef.current) clearTimeout(dropRef.current); };

  const lockPiece = useCallback((st: GameState): GameState => {
    if (!st.current) return st;
    const merged = mergePiece(st.board, st.current);
    const { board, cleared } = clearLines(merged);
    const lines = st.lines + cleared;
    const level = calcLevel(lines);
    const score = st.score + calcScore(cleared, level);
    const next = randomTetromino();
    const newCurrent = st.next ?? randomTetromino();
    const isOver = !isValidPosition(board, newCurrent);
    if (isOver) {
      play('gameover');
    } else if (cleared > 0) {
      play('clear');
    } else {
      play('drop');
    }
    return { ...st, board, current: isOver ? null : newCurrent, next: isOver ? null : next, canHold: true, score, level, lines, isOver, isRunning: !isOver, lockDelayTick: false };
  }, [play]);

  const scheduleDrop = useCallback(() => {
    clearDrop();
    const st = stateRef.current;
    if (!st.isRunning || st.isPaused || st.isOver) return;
    dropRef.current = setTimeout(() => {
      setState(prev => {
        if (!prev.current || !prev.isRunning || prev.isPaused) return prev;
        if (isValidPosition(prev.board, prev.current, 0, 1)) {
          const updated = { ...prev, current: { ...prev.current, y: prev.current.y + 1 }, lockDelayTick: false };
          scheduleDrop();
          return updated;
        }
        if (!prev.lockDelayTick) {
          const delayed = { ...prev, lockDelayTick: true };
          scheduleDrop();
          return delayed;
        }
        const locked = lockPiece(prev);
        scheduleDrop();
        return locked;
      });
    }, dropInterval(st.level));
  }, [lockPiece]);

  useEffect(() => {
    if (state.isRunning && !state.isPaused) scheduleDrop();
    return clearDrop;
  }, [state.isRunning, state.isPaused, state.level, scheduleDrop]);

  const start = useCallback(() => {
    const first = randomTetromino();
    const second = randomTetromino();
    setState({ ...INITIAL_STATE(), current: first, next: second, isRunning: true });
  }, []);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  }, []);

  const move = useCallback((dx: number) => {
    setState(prev => {
      if (!prev.current || !prev.isRunning || prev.isPaused) return prev;
      if (!isValidPosition(prev.board, prev.current, dx, 0)) return prev;
      play('move');
      return { ...prev, current: { ...prev.current, x: prev.current.x + dx }, lockDelayTick: false };
    });
  }, [play]);

  const rotatePiece = useCallback((dir: 1 | -1 = 1) => {
    setState(prev => {
      if (!prev.current || !prev.isRunning || prev.isPaused) return prev;
      const rotated = tryRotate(prev.board, prev.current, dir);
      if (!rotated) return prev;
      play('rotate');
      return { ...prev, current: rotated, lockDelayTick: false };
    });
  }, [play]);

  const softDrop = useCallback(() => {
    setState(prev => {
      if (!prev.current || !prev.isRunning || prev.isPaused) return prev;
      if (isValidPosition(prev.board, prev.current, 0, 1)) {
        clearDrop();
        const updated = { ...prev, current: { ...prev.current, y: prev.current.y + 1 }, score: prev.score + 1, lockDelayTick: false };
        scheduleDrop();
        return updated;
      }
      return lockPiece(prev);
    });
  }, [lockPiece, scheduleDrop]);

  const hardDrop = useCallback(() => {
    setState(prev => {
      if (!prev.current || !prev.isRunning || prev.isPaused) return prev;
      let dy = 0;
      while (isValidPosition(prev.board, prev.current, 0, dy + 1)) dy++;
      const dropped = { ...prev, current: { ...prev.current, y: prev.current.y + dy }, score: prev.score + dy * 2 };
      clearDrop();
      const locked = lockPiece(dropped);
      scheduleDrop();
      play('harddrop');
      window.dispatchEvent(new CustomEvent('tetris:shake'));
      return locked;
    });
  }, [lockPiece, scheduleDrop, play]);

  const hold = useCallback(() => {
    setState(prev => {
      if (!prev.current || !prev.canHold || !prev.isRunning || prev.isPaused) return prev;
      const spawn = (t: Tetromino): Tetromino => ({ ...t, x: 4 - Math.floor(t.shape[0].length / 2), y: 0 });
      if (prev.held) {
        const incoming = spawn(prev.held);
        if (!isValidPosition(prev.board, incoming)) return prev;
        play('hold');
        return { ...prev, current: incoming, held: { ...prev.current, x: 0, y: 0 }, canHold: false };
      }
      const next = prev.next ?? randomTetromino();
      const incoming = spawn(next);
      play('hold');
      return { ...prev, current: incoming, held: { ...prev.current, x: 0, y: 0 }, next: randomTetromino(), canHold: false };
    });
  }, [play]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stateRef.current.isRunning) return;
      switch (e.code) {
        case 'ArrowLeft':  e.preventDefault(); move(-1); break;
        case 'ArrowRight': e.preventDefault(); move(1);  break;
        case 'ArrowDown':  e.preventDefault(); softDrop(); break;
        case 'ArrowUp':    e.preventDefault(); rotatePiece(1); break;
        case 'KeyZ':       e.preventDefault(); rotatePiece(-1); break;
        case 'Space':      e.preventDefault(); hardDrop(); break;
        case 'KeyC':       e.preventDefault(); hold(); break;
        case 'KeyP': case 'Escape': e.preventDefault(); pause(); break;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [move, rotatePiece, softDrop, hardDrop, hold, pause]);

  const ghost = state.current && state.isRunning
    ? ghostPosition(state.board, state.current)
    : null;

  return { state, ghost, start, pause, move, rotatePiece, softDrop, hardDrop, hold, muted, toggleMute };
}

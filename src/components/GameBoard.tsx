import { useMemo, useEffect, useState } from 'react';
import type { Board, CellValue, Tetromino } from '../types/tetris';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../utils/engine';
import { Cell } from './Cell';

interface Props {
  board: Board;
  current: Tetromino | null;
  ghost: number | null;
}

export function GameBoard({ board, current, ghost }: Props) {
  const display = useMemo(() => {
    const grid: (CellValue | 'ghost')[][] = board.map(row => [...row] as (CellValue | 'ghost')[]);
    // ghost
    if (current && ghost !== null) {
      for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[r].length; c++) {
          if (!current.shape[r][c]) continue;
          const ny = ghost + r;
          const nx = current.x + c;
          if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
            if (!grid[ny][nx]) grid[ny][nx] = 'ghost';
          }
        }
      }
    }
    // current piece
    if (current) {
      for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[r].length; c++) {
          if (!current.shape[r][c]) continue;
          const ny = current.y + r;
          const nx = current.x + c;
          if (ny >= 0 && ny < BOARD_HEIGHT && nx >= 0 && nx < BOARD_WIDTH) {
            grid[ny][nx] = current.type as CellValue;
          }
        }
      }
    }
    return grid;
  }, [board, current, ghost]);

  const [shake, setShake] = useState(false);

  useEffect(() => {
    const onShake = () => {
      setShake(true);
      setTimeout(() => setShake(false), 200);
    };
    window.addEventListener('tetris:shake', onShake);
    return () => window.removeEventListener('tetris:shake', onShake);
  }, []);

  return (
    <div
      className={`relative border-2 border-cyan-400/40 shadow-neon bg-void-900/80 ${shake ? 'animate-shake' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
        height: 'min(78vh, 780px)',
        aspectRatio: `${BOARD_WIDTH} / ${BOARD_HEIGHT}`,
      }}
    >
      {display.map((row, r) =>
        row.map((cell, c) => (
          <Cell key={`${r}-${c}`} value={cell} />
        )),
      )}
    </div>
  );
}

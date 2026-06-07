import type { Board, CellValue, Tetromino, TetrominoShape } from '../types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINOES: { shape: TetrominoShape; type: CellValue }[] = [
  { type: 1, shape: [[1,1,1,1]] },                         // I — cyan
  { type: 2, shape: [[2,2],[2,2]] },                       // O — yellow
  { type: 3, shape: [[0,3,0],[3,3,3]] },                   // T — magenta
  { type: 4, shape: [[4,0],[4,0],[4,4]] },                  // L — orange
  { type: 5, shape: [[0,5],[0,5],[5,5]] },                  // J — blue
  { type: 6, shape: [[0,6,6],[6,6,0]] },                   // S — green
  { type: 7, shape: [[7,7,0],[0,7,7]] },                   // Z — red
];

// Tailwind-compatible colour classes per piece type
export const CELL_COLOURS: Record<number, string> = {
  0: '',
  1: 'bg-cyan-400 border-cyan-300',
  2: 'bg-amber-400 border-amber-300',
  3: 'bg-fuchsia-500 border-fuchsia-400',
  4: 'bg-orange-500 border-orange-400',
  5: 'bg-blue-500 border-blue-400',
  6: 'bg-green-500 border-green-400',
  7: 'bg-red-500 border-red-400',
};

export function createBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array(BOARD_WIDTH).fill(0) as CellValue[],
  );
}

export function randomTetromino(): Tetromino {
  const t = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return {
    shape: t.shape,
    type: t.type,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(t.shape[0].length / 2),
    y: 0,
  };
}

export function rotate(shape: TetrominoShape): TetrominoShape {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: TetrominoShape = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

export function isValidPosition(board: Board, piece: Tetromino, dx = 0, dy = 0, shape?: TetrominoShape): boolean {
  const s = shape ?? piece.shape;
  for (let r = 0; r < s.length; r++) {
    for (let c = 0; c < s[r].length; c++) {
      if (!s[r][c]) continue;
      const nx = piece.x + c + dx;
      const ny = piece.y + r + dy;
      if (nx < 0 || nx >= BOARD_WIDTH || ny >= BOARD_HEIGHT) return false;
      if (ny < 0) continue;
      if (board[ny][nx] !== 0) return false;
    }
  }
  return true;
}

export function mergePiece(board: Board, piece: Tetromino): Board {
  const next = board.map(row => [...row] as CellValue[]);
  for (let r = 0; r < piece.shape.length; r++) {
    for (let c = 0; c < piece.shape[r].length; c++) {
      if (!piece.shape[r][c]) continue;
      const ny = piece.y + r;
      const nx = piece.x + c;
      if (ny >= 0) next[ny][nx] = piece.type;
    }
  }
  return next;
}

export function clearLines(board: Board): { board: Board; cleared: number } {
  const kept = board.filter(row => row.some(v => v === 0));
  const cleared = BOARD_HEIGHT - kept.length;
  const empty = Array.from({ length: cleared }, () => Array(BOARD_WIDTH).fill(0) as CellValue[]);
  return { board: [...empty, ...kept], cleared };
}

export function ghostPosition(board: Board, piece: Tetromino): number {
  let dy = 0;
  while (isValidPosition(board, piece, 0, dy + 1)) dy++;
  return piece.y + dy;
}

export function calcScore(lines: number, level: number): number {
  const base = [0, 100, 300, 500, 800];
  return (base[lines] ?? 0) * (level + 1);
}

export function calcLevel(totalLines: number): number {
  return Math.floor(totalLines / 10);
}

export function dropInterval(level: number): number {
  return Math.max(50, Math.floor(800 * Math.pow(0.85, level)));
}

// Wall-kick offsets (SRS-lite)
const KICKS = [
  [[-1, 0], [1, 0], [-1, -1], [1, -1]],
  [[1, 0], [-1, 0], [1, 1], [-1, 1]],
];

export function tryRotate(board: Board, piece: Tetromino, dir: 1 | -1): Tetromino | null {
  let shape = piece.shape;
  const times = dir === 1 ? 1 : 3;
  for (let i = 0; i < times; i++) shape = rotate(shape);
  if (isValidPosition(board, piece, 0, 0, shape)) return { ...piece, shape };
  for (const [dx, dy] of KICKS[dir === 1 ? 0 : 1]) {
    if (isValidPosition(board, piece, dx, dy, shape)) return { ...piece, shape, x: piece.x + dx, y: piece.y + dy };
  }
  return null;
}

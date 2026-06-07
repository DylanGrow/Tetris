export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Board = CellValue[][];
export type TetrominoShape = number[][];

export interface Tetromino {
  shape: TetrominoShape;
  type: CellValue;
  x: number;
  y: number;
}

export interface GameState {
  board: Board;
  current: Tetromino | null;
  next: Tetromino | null;
  held: Tetromino | null;
  canHold: boolean;
  score: number;
  level: number;
  lines: number;
  isRunning: boolean;
  isOver: boolean;
  isPaused: boolean;
  lockDelayTick?: boolean;
}

export interface HighScore {
  name: string;
  score: number;
  level: number;
  lines: number;
  date: string;
}

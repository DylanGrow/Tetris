import type { CellValue } from '../types/tetris';
import { CELL_COLOURS } from '../utils/engine';

interface Props {
  value: CellValue | 'ghost';
}

export function Cell({ value }: Props) {
  if (value === 'ghost') {
    return (
      <div className="w-full h-full border border-white/10 bg-white/5 rounded-[1px]" />
    );
  }
  if (!value) {
    return <div className="w-full h-full border border-white/5 bg-void-900/60 rounded-[1px]" />;
  }
  return (
    <div
      className={`w-full h-full border-2 rounded-[1px] ${CELL_COLOURS[value]} shadow-sm`}
      style={{ boxShadow: 'inset 2px 2px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.4)' }}
    />
  );
}

import type { Tetromino } from '../types/tetris';
import { CELL_COLOURS } from '../utils/engine';

interface Props {
  piece: Tetromino | null;
  label: string;
  dim?: boolean;
}

export function PiecePreview({ piece, label, dim }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-pixel text-[8px] text-cyan-400/60 tracking-widest">{label}</span>
      <div
        className={`border border-white/10 bg-void-900/60 flex items-center justify-center ${dim ? 'opacity-40' : ''}`}
        style={{ width: 90, height: 70 }}
      >
        {piece ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${piece.shape[0].length}, 16px)`,
              gridTemplateRows: `repeat(${piece.shape.length}, 16px)`,
              gap: '1px',
            }}
          >
            {piece.shape.map((row, r) =>
              row.map((v, c) => (
                <div
                  key={`${r}-${c}`}
                  className={`${v ? `${CELL_COLOURS[v]} border rounded-[1px]` : ''}`}
                  style={v ? { boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.25)' } : {}}
                />
              )),
            )}
          </div>
        ) : (
          <span className="font-pixel text-[8px] text-white/20">—</span>
        )}
      </div>
    </div>
  );
}

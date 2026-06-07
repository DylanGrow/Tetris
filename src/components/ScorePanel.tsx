interface Props {
  score: number;
  level: number;
  lines: number;
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-white/10 bg-void-900/60 px-3 py-2 flex flex-col gap-1">
      <span className="font-pixel text-[7px] text-cyan-400/60 tracking-widest">{label}</span>
      <span className="font-mono text-lg text-white font-bold tabular-nums">{value.toString().padStart(6, '0')}</span>
    </div>
  );
}

export function ScorePanel({ score, level, lines }: Props) {
  return (
    <div className="flex flex-col gap-2 w-[110px]">
      <StatBox label="SCORE" value={score} />
      <StatBox label="LEVEL" value={level} />
      <StatBox label="LINES" value={lines} />
    </div>
  );
}

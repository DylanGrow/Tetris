interface Props {
  onLeft: () => void;
  onRight: () => void;
  onRotate: () => void;
  onSoft: () => void;
  onHard: () => void;
  onHold: () => void;
}

function Btn({ label, onClick, wide }: { label: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      onPointerDown={e => { 
        e.preventDefault(); 
        if (navigator.vibrate) navigator.vibrate(15);
        onClick(); 
      }}
      className={`select-none font-pixel text-[9px] text-white border border-white/20 bg-void-800/80
        active:bg-cyan-400/20 active:border-cyan-400/50 active:shadow-neon
        transition-colors touch-none
        ${wide ? 'px-6 py-3' : 'px-4 py-3'}`}
      aria-label={label}
    >
      {label}
    </button>
  );
}

export function MobileControls({ onLeft, onRight, onRotate, onSoft, onHard, onHold }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 mt-4 sm:hidden">
      <div className="flex gap-2 justify-center">
        <Btn label="HOLD" onClick={onHold} />
        <Btn label="↺ ROT" onClick={onRotate} />
        <Btn label="⬇⬇ DROP" onClick={onHard} />
      </div>
      <div className="flex gap-4 justify-center">
        <Btn label="◀" onClick={onLeft} />
        <Btn label="▼" onClick={onSoft} />
        <Btn label="▶" onClick={onRight} />
      </div>
    </div>
  );
}

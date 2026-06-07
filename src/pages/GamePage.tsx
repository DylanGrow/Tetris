import { useState, useEffect } from 'react';
import { useTetris } from '../hooks/useTetris';
import { useGamepad } from '../hooks/useGamepad';
import { GameBoard } from '../components/GameBoard';
import { PiecePreview } from '../components/PiecePreview';
import { ScorePanel } from '../components/ScorePanel';
import { MobileControls } from '../components/MobileControls';
import { saveHighScore, isHighScore } from '../utils/scores';

type View = 'home' | 'game' | 'gameover' | 'scores' | 'howto';

export function GamePage() {
  const [view, setView] = useState<View>('home');
  const [playerName, setPlayerName] = useState('');
  const [savedName, setSavedName] = useState('WINNER');
  const [gamepadConnected, setGamepadConnected] = useState(false);
  const { state, ghost, start, pause, move, rotatePiece, softDrop, hardDrop, hold, muted, toggleMute } = useTetris();

  // Gamepad connection indicator
  useEffect(() => {
    const onConnect    = () => setGamepadConnected(true);
    const onDisconnect = () => setGamepadConnected(!!navigator.getGamepads?.().find(g => g !== null));
    window.addEventListener('gamepadconnected',    onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);
    return () => {
      window.removeEventListener('gamepadconnected',    onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
    };
  }, []);

  // Wire gamepad to all game actions
  useGamepad({
    moveLeft:  () => move(-1),
    moveRight: () => move(1),
    rotateCW:  () => rotatePiece(1),
    rotateCCW: () => rotatePiece(-1),
    softDrop,
    hardDrop,
    hold,
    pause,
    isRunning: state.isRunning && !state.isPaused,
  });

  const handleStart = () => {
    start();
    setView('game');
  };

  const handleGameOver = () => {
    if (isHighScore(state.score)) {
      saveHighScore({ name: savedName, score: state.score, level: state.level, lines: state.lines, date: new Date().toLocaleDateString() });
    }
    setView('gameover');
  };

  if (state.isOver && view === 'game') {
    handleGameOver();
  }

  return (
    <main className="h-[100dvh] bg-void-900 flex flex-col items-center justify-center px-2 py-2 sm:px-4 sm:py-4 relative overflow-hidden">
      {/* scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
      }} />
      {/* CRT vignette */}
      <div className="pointer-events-none fixed inset-0 z-40" style={{
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
      }} />

      {/* Mute button — always visible */}
      <button
        onClick={toggleMute}
        className="fixed top-3 left-3 z-30 flex items-center gap-1.5 border border-white/20 bg-void-900/80 px-2 py-1 hover:border-cyan-400/40 transition-colors"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        <span style={{ fontSize: 14 }}>{muted ? '🔇' : '🔊'}</span>
        <span className="font-pixel text-[7px] text-white/50">{muted ? 'OFF' : 'ON'}</span>
      </button>

      {/* Gamepad indicator — always visible when connected */}
      {gamepadConnected && (
        <div className="fixed top-3 right-3 z-30 flex items-center gap-1.5 border border-cyan-400/30 bg-void-900/80 px-2 py-1">
          <span style={{ fontSize: 12 }}>🎮</span>
          <span className="font-pixel text-[7px] text-cyan-400/70">CTRL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-slow" />
        </div>
      )}

      {/* HOME */}
      {view === 'home' && (
        <div className="relative z-10 flex flex-col items-center gap-8 text-center">
          <div className="animate-glitch">
            <h1 className="font-pixel text-cyan-400 text-3xl sm:text-4xl leading-relaxed" style={{ textShadow: '0 0 20px #00fff9, 0 0 60px #00fff980' }}>
              TETRIS
            </h1>
            <p className="font-pixel text-fuchsia-400 text-xs mt-1 tracking-widest" style={{ textShadow: '0 0 12px #ff00e5' }}>
              ARCADE EDITION
            </p>
          </div>
          <div className="font-pixel text-[9px] text-white/40 leading-loose">
            INSERT COIN TO PLAY
            <span className="animate-blink">_</span>
          </div>

          {/* Input hint badges */}
          <div className="flex gap-2 justify-center flex-wrap">
            {[['⌨', 'KEYBOARD'], ['🎮', 'CONTROLLER'], ['👆', 'TOUCH']].map(([icon, label]) => (
              <span key={label} className="font-pixel text-[7px] text-white/30 border border-white/10 px-2 py-1 flex items-center gap-1">
                <span>{icon}</span>{label}
              </span>
            ))}
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <div className="flex flex-col gap-1 text-left">
              <label className="font-pixel text-[8px] text-cyan-400/60">YOUR NAME</label>
              <input
                type="text"
                maxLength={8}
                value={playerName}
                onChange={e => setPlayerName(e.target.value.toUpperCase())}
                placeholder="WINNER"
                className="bg-void-800/80 border border-white/20 text-white font-pixel text-sm px-3 py-2 focus:outline-none focus:border-cyan-400/50 w-full"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button onClick={() => { setSavedName(playerName || 'WINNER'); handleStart(); }}
              className="font-pixel text-sm text-void-900 bg-cyan-400 px-6 py-3 hover:bg-white transition-colors shadow-neon mt-2">
              ▶ PLAY
            </button>
            <button onClick={() => setView('howto')}
              className="font-pixel text-[10px] text-white/50 border border-white/20 px-6 py-3 hover:text-white hover:border-white/40 transition-colors">
              HOW TO PLAY
            </button>
            <button onClick={() => setView('scores')}
              className="font-pixel text-[10px] text-white/50 border border-white/20 px-6 py-3 hover:text-white hover:border-white/40 transition-colors">
              HIGH SCORES
            </button>
          </div>
        </div>
      )}

      {/* GAME */}
      {view === 'game' && (
        <div className="relative z-10 flex flex-col items-center gap-2 w-full h-full">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[10px] text-cyan-400 animate-glitch" style={{ textShadow: '0 0 10px #00fff9' }}>
              TETRIS ARCADE
            </span>
          </div>
          <div className="flex gap-6 items-start justify-center w-full max-w-4xl mx-auto">
            {/* left panel */}
            <div className="flex flex-col gap-3 items-end shrink-0">
              <PiecePreview piece={state.held} label="HOLD" dim={!state.canHold} />
              <ScorePanel score={state.score} level={state.level} lines={state.lines} />
            </div>

            {/* board */}
            <div className="relative shrink-0">
              <GameBoard board={state.board} current={state.current} ghost={ghost} />
              {state.isPaused && (
                <div className="absolute inset-0 bg-void-900/90 flex items-center justify-center z-20">
                  <span className="font-pixel text-cyan-400 text-sm animate-pulse-slow">PAUSED</span>
                </div>
              )}
            </div>

            {/* right panel */}
            <div className="flex flex-col gap-3">
              <PiecePreview piece={state.next} label="NEXT" />
              <div className="flex flex-col gap-1 mt-2">
                <button onClick={pause}
                  className="font-pixel text-[8px] text-white/50 border border-white/10 px-3 py-2 hover:border-cyan-400/40 hover:text-cyan-400 transition-colors">
                  {state.isPaused ? 'RESUME' : 'PAUSE'}
                </button>
                <button onClick={() => setView('home')}
                  className="font-pixel text-[8px] text-white/50 border border-white/10 px-3 py-2 hover:border-red-400/40 hover:text-red-400 transition-colors">
                  QUIT
                </button>
              </div>
              <div className="border border-white/5 p-2 mt-1">
                {gamepadConnected ? (
                  <p className="font-pixel text-[7px] text-cyan-400/40 leading-loose">
                    🎮 CTRL<br/>
                    ✦ HARD DROP<br/>
                    ○ ROT CCW<br/>
                    △ ROT CW<br/>
                    □ HOLD<br/>
                    D-PAD MOVE<br/>
                    START PAUSE
                  </p>
                ) : (
                  <p className="font-pixel text-[7px] text-white/20 leading-loose">
                    ←→ MOVE<br/>↑ ROT<br/>↓ SOFT<br/>SPC HARD<br/>C HOLD<br/>P PAUSE
                  </p>
                )}
              </div>
            </div>
          </div>
          <MobileControls
            onLeft={() => move(-1)}
            onRight={() => move(1)}
            onRotate={() => rotatePiece(1)}
            onSoft={softDrop}
            onHard={hardDrop}
            onHold={hold}
          />
        </div>
      )}

      {/* GAME OVER */}
      {view === 'gameover' && (
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <h2 className="font-pixel text-red-400 text-2xl" style={{ textShadow: '0 0 20px #f87171' }}>
            GAME OVER
          </h2>
          <div className="border border-white/10 bg-void-800/60 px-8 py-6 flex flex-col gap-3">
            <p className="font-pixel text-[9px] text-white/40">{savedName}</p>
            <p className="font-mono text-3xl text-white font-bold">{state.score.toString().padStart(8, '0')}</p>
            <div className="flex gap-6 justify-center font-pixel text-[8px] text-white/40">
              <span>LVL {state.level}</span>
              <span>{state.lines} LINES</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button onClick={handleStart}
              className="font-pixel text-sm text-void-900 bg-cyan-400 px-6 py-3 hover:bg-white transition-colors shadow-neon">
              ▶ PLAY AGAIN
            </button>
            <button onClick={() => setView('scores')}
              className="font-pixel text-[10px] text-white/50 border border-white/20 px-6 py-3 hover:text-white transition-colors">
              HIGH SCORES
            </button>
            <button onClick={() => setView('home')}
              className="font-pixel text-[10px] text-white/50 border border-white/20 px-6 py-3 hover:text-white transition-colors">
              MAIN MENU
            </button>
          </div>
        </div>
      )}

      {/* HIGH SCORES */}
      {view === 'scores' && (
        <HighScoresView onBack={() => setView('home')} />
      )}

      {/* HOW TO PLAY */}
      {view === 'howto' && (
        <HowToPlay onBack={() => setView('home')} />
      )}
    </main>
  );
}

function HighScoresView({ onBack }: { onBack: () => void }) {
  const scores = (() => { try { const r = localStorage.getItem('tetris_hiscores'); return r ? JSON.parse(r) : []; } catch { return []; } })();
  return (
    <div className="relative z-10 flex flex-col items-center gap-6 text-center w-full max-w-sm">
      <h2 className="font-pixel text-amber-400 text-lg" style={{ textShadow: '0 0 20px #ffcc00' }}>HIGH SCORES</h2>
      <div className="w-full border border-white/10 bg-void-800/60">
        {scores.length === 0 && (
          <p className="font-pixel text-[9px] text-white/30 py-8">NO SCORES YET.<br/>BE THE FIRST!</p>
        )}
        {scores.map((s: {name:string;score:number;level:number;date:string}, i: number) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-2 border-b border-white/5 ${i === 0 ? 'bg-amber-400/10' : ''}`}>
            <span className={`font-pixel text-[8px] w-6 ${i === 0 ? 'text-amber-400' : 'text-white/30'}`}>{i+1}.</span>
            <span className="font-pixel text-[9px] text-white flex-1 text-left">{s.name}</span>
            <span className="font-mono text-sm text-white">{s.score.toString().padStart(8,'0')}</span>
            <span className="font-pixel text-[7px] text-white/30">L{s.level}</span>
          </div>
        ))}
      </div>
      <button onClick={onBack} className="font-pixel text-[10px] text-white/50 border border-white/20 px-6 py-3 hover:text-white transition-colors">
        ← BACK
      </button>
    </div>
  );
}

function HowToPlay({ onBack }: { onBack: () => void }) {
  const controls = [
    ['← →',    'Move left / right'],
    ['↑',       'Rotate clockwise'],
    ['Z',       'Rotate counter-CW'],
    ['↓',       'Soft drop'],
    ['SPACE',   'Hard drop'],
    ['C',       'Hold piece'],
    ['P / ESC', 'Pause'],
  ];
  const padControls = [
    ['D-Pad ← →', 'Move (with DAS)'],
    ['D-Pad ↓',   'Soft drop'],
    ['L-Stick',   'Move + drop up'],
    ['✦ (A)',     'Hard drop'],
    ['△ / ○ (Y/B)', 'Rotate'],
    ['□ / LB (X)', 'Hold piece'],
    ['START',     'Pause'],
  ];
  return (
    <div className="relative z-10 flex flex-col items-center gap-6 text-center w-full max-w-sm">
      <h2 className="font-pixel text-fuchsia-400 text-lg" style={{ textShadow: '0 0 20px #ff00e5' }}>HOW TO PLAY</h2>

      <div className="w-full border border-white/10 bg-void-800/60 px-4 py-4 flex flex-col gap-2">
        <p className="font-pixel text-[8px] text-white/40 mb-3 leading-loose">
          Rotate and drop blocks to<br/>fill complete horizontal lines.<br/>Clear lines to score points!
        </p>
        <p className="font-pixel text-[8px] text-cyan-400/60 mb-1">⌨ KEYBOARD</p>
        {controls.map(([key, action]) => (
          <div key={key} className="flex items-center gap-3 border-b border-white/5 pb-2">
            <span className="font-mono text-[10px] text-cyan-400 w-20 text-left">{key}</span>
            <span className="font-pixel text-[8px] text-white/60">{action}</span>
          </div>
        ))}
      </div>

      <div className="w-full border border-white/10 bg-void-800/60 px-4 py-4 flex flex-col gap-2">
        <p className="font-pixel text-[8px] text-cyan-400/60 mb-1">🎮 CONTROLLER</p>
        {padControls.map(([key, action]) => (
          <div key={key} className="flex items-center gap-3 border-b border-white/5 pb-2">
            <span className="font-mono text-[10px] text-cyan-400 w-28 text-left">{key}</span>
            <span className="font-pixel text-[8px] text-white/60">{action}</span>
          </div>
        ))}
        <p className="font-pixel text-[7px] text-white/20 mt-2 leading-loose">
          Plug in any USB/Bluetooth controller.<br/>Xbox, PlayStation, Switch Pro all work.
        </p>
      </div>

      <div className="w-full border border-white/10 bg-void-800/60 px-4 py-4">
        <p className="font-pixel text-[8px] text-amber-400 mb-2">SCORING</p>
        <div className="flex flex-col gap-1 font-pixel text-[7px] text-white/40 leading-loose">
          <span>1 LINE — 100 × LEVEL</span>
          <span>2 LINES — 300 × LEVEL</span>
          <span>3 LINES — 500 × LEVEL</span>
          <span>4 LINES (TETRIS!) — 800 × LEVEL</span>
        </div>
      </div>

      <button onClick={onBack} className="font-pixel text-[10px] text-white/50 border border-white/20 px-6 py-3 hover:text-white transition-colors">
        ← BACK
      </button>
    </div>
  );
}

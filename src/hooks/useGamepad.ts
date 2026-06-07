import { useEffect, useRef, useCallback } from 'react';

// Standard gamepad button indices (Xbox / PS layout)
const BTN = {
  A:      0,  // hard drop
  B:      1,  // rotate CCW
  X:      2,  // hold
  Y:      3,  // rotate CW
  LB:     4,  // hold (alt)
  RB:     5,  // rotate CW (alt)
  SELECT: 8,
  START:  9,  // pause
  UP:    12,  // rotate CW (d-pad)
  DOWN:  13,  // soft drop (d-pad)
  LEFT:  14,  // move left (d-pad)
  RIGHT: 15,  // move right (d-pad)
};

// DAS timings (ms) — feel like a real Tetris cabinet
const DAS_DELAY  = 150; // delay before auto-repeat starts
const DAS_REPEAT =  50; // interval between repeats once started

interface GamepadActions {
  moveLeft:   () => void;
  moveRight:  () => void;
  rotateCW:   () => void;
  rotateCCW:  () => void;
  softDrop:   () => void;
  hardDrop:   () => void;
  hold:       () => void;
  pause:      () => void;
  isRunning:  boolean;
}

export function useGamepad(actions: GamepadActions) {
  const actionsRef  = useRef(actions);
  actionsRef.current = actions;

  // Track which buttons were pressed last frame (for edge detection)
  const prevButtons = useRef<boolean[]>([]);

  // DAS state per axis direction: 'left' | 'right' | 'down'
  const dasTimer  = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});
  const dasRepeat = useRef<Record<string, ReturnType<typeof setInterval> | null>>({});

  const cancelDas = useCallback((key: string) => {
    if (dasTimer.current[key])  { clearTimeout(dasTimer.current[key]!);  dasTimer.current[key]  = null; }
    if (dasRepeat.current[key]) { clearInterval(dasRepeat.current[key]!); dasRepeat.current[key] = null; }
  }, []);

  const startDas = useCallback((key: string, action: () => void) => {
    action(); // fire immediately
    cancelDas(key);
    dasTimer.current[key] = setTimeout(() => {
      dasRepeat.current[key] = setInterval(action, DAS_REPEAT);
    }, DAS_DELAY);
  }, [cancelDas]);

  useEffect(() => {
    let rafId: number;
    let connected = false;

    const onConnect = () => { connected = true; };
    const onDisconnect = () => {
      connected = false;
      ['left','right','down'].forEach(cancelDas);
    };

    window.addEventListener('gamepadconnected', onConnect);
    window.addEventListener('gamepaddisconnected', onDisconnect);

    const poll = () => {
      rafId = requestAnimationFrame(poll);

      const gamepads = navigator.getGamepads?.();
      if (!gamepads) return;

      const gp = Array.from(gamepads).find(g => g !== null);
      if (!gp) return;
      connected = true;

      const { moveLeft, moveRight, rotateCW, rotateCCW, softDrop, hardDrop, hold, pause, isRunning } = actionsRef.current;
      const btns = gp.buttons.map(b => b.pressed);

      const pressed  = (i: number) =>  btns[i] && !prevButtons.current[i]; // rising edge
      const released = (i: number) => !btns[i] &&  prevButtons.current[i]; // falling edge
      const held     = (i: number) =>  btns[i];

      // ── one-shot buttons ──────────────────────────────────────────
      if (pressed(BTN.START) || pressed(BTN.SELECT)) pause();

      if (isRunning) {
        if (pressed(BTN.A))   hardDrop();
        if (pressed(BTN.B))   rotateCCW();
        if (pressed(BTN.Y) || pressed(BTN.UP)  || pressed(BTN.RB)) rotateCW();
        if (pressed(BTN.X) || pressed(BTN.LB)) hold();

        // ── DAS for left / right / down ───────────────────────────
        if (pressed(BTN.LEFT))  startDas('left',  moveLeft);
        if (released(BTN.LEFT)) cancelDas('left');

        if (pressed(BTN.RIGHT))  startDas('right', moveRight);
        if (released(BTN.RIGHT)) cancelDas('right');

        if (pressed(BTN.DOWN))  startDas('down',  softDrop);
        if (released(BTN.DOWN)) cancelDas('down');

        // ── Analog left stick (axis 0 = LX, axis 1 = LY) ─────────
        const lx = gp.axes[0] ?? 0;
        const ly = gp.axes[1] ?? 0;
        const DEAD = 0.5;

        if (lx < -DEAD && !held(BTN.LEFT))  startDas('left',  moveLeft);
        if (lx >  DEAD && !held(BTN.RIGHT)) startDas('right', moveRight);
        if (lx >= -DEAD && lx <= DEAD) {
          if (!held(BTN.LEFT))  cancelDas('left');
          if (!held(BTN.RIGHT)) cancelDas('right');
        }

        if (ly >  DEAD && !held(BTN.DOWN)) startDas('down', softDrop);
        if (ly <= DEAD && !held(BTN.DOWN)) cancelDas('down');

        // Hard drop: stick up
        if (ly < -DEAD && !prevButtons.current[99]) {
          hardDrop();
          prevButtons.current[99] = true; // synthetic "stick-up" latch
        }
        if (ly >= -DEAD) prevButtons.current[99] = false;
      }

      prevButtons.current = btns;
    };

    rafId = requestAnimationFrame(poll);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('gamepadconnected', onConnect);
      window.removeEventListener('gamepaddisconnected', onDisconnect);
      ['left','right','down'].forEach(cancelDas);
      void connected; // suppress lint
    };
  }, [startDas, cancelDas]);
}

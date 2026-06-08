<p align="center">
  <img src="./public/og-image.png" alt="Tetris Arcade Banner" width="100%" style="border-radius: 8px;"/>
</p>

<h1 align="center">🕹️ Tetris Arcade 🕹️</h1>

<p align="center">
  <strong>A high-fidelity, retro-styled Tetris arcade experience built with modern web technologies.</strong>
</p>

<p align="center">
  <a href="https://dylangrow.github.io/Tetris/"><img src="https://img.shields.io/badge/Play_Now-Online-00fff9?style=for-the-badge&logo=youtube-gaming&logoColor=black" alt="Play Now" /></a>
  <br/>
  <br/>
  <img src="https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=flat&logo=pwa&logoColor=white" alt="PWA" />
</p>

---

## ✨ Features

- **Modern Responsive Layout**: Full-screen arcade cabinet style designed to dynamically adjust to any screen size (desktop, tablet, or mobile).
- **Audio Sound Effects**: Handcrafted retro sound effects using the Web Audio API synthesizer. Complete with a built-in mute control.
- **Vibrant Aesthetics**: High-fidelity dark mode with neon accents, smooth gradients, and satisfying micro-animations (like screen shake on hard drops).
- **Progressive Web App (PWA)**: Installable on your device for offline play, complete with custom pixel-art icons.
- **Classic Mechanics**: True-to-classic speed curves, lock delay (coyote time), and strict hold rules.

## 🎮 Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Move Left/Right** | `Left Arrow` / `Right Arrow` | On-screen ⬅️ / ➡️ |
| **Soft Drop** | `Down Arrow` | On-screen ⬇️ |
| **Hard Drop** | `Spacebar` | On-screen ✦ button |
| **Rotate** | `Up Arrow` | On-screen ↻ button |
| **Hold Piece** | `C` or `Shift` | On-screen `HOLD` |
| **Pause/Resume** | `P` or `Esc` | Top right `⏸` button |

*(Mobile controls include haptic vibration feedback on supported devices!)*

## 🚀 Local Development

Want to run the arcade locally or tweak the code?

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DylanGrow/Tetris.git
   cd Tetris
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## 🛠️ Build for Production

To create an optimized production build:
```bash
npm run build
```
This generates the bundled files and the PWA service workers in the `dist/` directory.

---

<p align="center">
  <i>Built with ❤️ for the retro gaming community.</i>
</p>

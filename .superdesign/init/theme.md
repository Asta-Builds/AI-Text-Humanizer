# Design System / Theme

## CSS (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;650;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.25); border-radius: 9999px; }
::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.45); }

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.5; }
  50% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(0.95); opacity: 0.5; }
}
.pulse-ring { animation: pulse-ring 2s infinite ease-in-out; }
```

## Font System
- **Body / sans**: Inter (weights 300, 400, 500, 600, 700)
- **Display / headings**: Space Grotesk (weights 400, 500, 650, 700)
- **Monospace / code**: JetBrains Mono (weights 400, 500)

## Color Palette (Tailwind defaults + custom usage)
- **Primary**: indigo-600 (buttons, links, active states), indigo-50 (soft backgrounds)
- **Accent**: violet-600 (gradients)
- **Success**: emerald-50/100/500/600/700 (positive metrics, safeguards)
- **Warning**: amber-50/100/500/600/800 (warnings, clichés)
- **Error**: rose-50/100/500/600/700 (errors, high scores)
- **Neutral**: slate-50/100/200/300/400/500/600/700/800/900 (backgrounds, text, borders)
- **White backgrounds**: bg-white (cards, modals), bg-slate-50 (page background)

## Spacing / Sizing
- Uses Tailwind default spacing scale via `p-*`, `m-*`, `gap-*`, `rounded-*`
- Common border radius: `rounded-xl` (buttons/cards), `rounded-2xl` (cards/panels), `rounded-3xl` (large containers)
- Shadows: `shadow-xs` (default for cards), `shadow-xl` (hero demo)
- Max widths: `max-w-7xl` (content), `max-w-4xl` (hero), `max-w-md` (auth forms), `max-w-2xl` (text)

## Key Layout Constants
- Navbar: `h-16`
- Page background: `bg-slate-50`
- Full height: `min-h-[calc(100vh-4rem)]` (auth forms)
- Container padding: `px-4 sm:px-6 lg:px-8`

## Build Config (`vite.config.ts`)
```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
```

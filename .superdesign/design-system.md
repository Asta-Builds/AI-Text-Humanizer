# HumanFlow Architect — Design System

## Product Context
HumanFlow Architect is an academic text humanization SaaS. It transforms AI-generated academic prose into natural, human-sounding writing while preserving citations, technical terms, and data. Target users: professors, researchers, graduate students.

## Brand
- **Name**: HumanFlow Architect
- **Tagline**: Moteur de Texte Éducatif
- **Voice**: Professional, academic, French language
- **Logo**: Gradient indigo-to-violet rounded square with sparkle icon

## Color Palette
- **Primary**: indigo-600 (#4F46E5) — buttons, links, active states
- **Primary bg**: indigo-50 (#EEF2FF) — soft backgrounds
- **Gradient**: from-indigo-500 to-violet-600 — logo, hero text
- **Success**: emerald-500/50/100/600/700 — positive metrics, safeguards badges
- **Warning**: amber-50/100/500/600/800 — cliché warnings
- **Error**: rose-50/100/500/600/700 — errors, high scores
- **Neutral**: slate-50/100/200/300/400/500/600/700/800/900 — page bg, borders, text
- **White**: bg-white — cards, modals, navbar
- **Page bg**: bg-slate-50 — main page background
- **Navbar**: bg-white/85 backdrop-blur-md

## Typography
- **Body / Sans**: Inter 300/400/500/600/700 — all body text, labels, buttons
- **Display / Headings**: Space Grotesk 400/500/650/700 — titles, h1-h3
- **Monospace / Code**: JetBrains Mono 400/500 — metrics, code, timestamps

## Spacing & Layout
- **Border radius**: rounded-xl (buttons), rounded-2xl (cards/panels), rounded-3xl (large containers)
- **Shadows**: shadow-xs (default cards), shadow-xl (hero demo)
- **Max widths**: max-w-7xl (content), max-w-4xl (hero), max-w-md (auth), max-w-2xl (text)
- **Navbar height**: h-16 (64px), sticky top-0 z-50
- **Page padding**: px-4 sm:px-6 lg:px-8

## Component Patterns

### Buttons
- **Primary**: bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs/ sm font-bold shadow-xs
- **Secondary**: bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold
- **Danger**: text-rose-600 hover:bg-rose-50 rounded-lg

### Cards
- bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs

### Form Inputs
- bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl text-sm
- focus: ring-2 ring-indigo-500/15 focus:border-indigo-500

### Toggle Switches
- Use lucide-react ToggleRight (active, colored) / ToggleLeft (inactive, gray)

### Navigation
- Active link: bg-indigo-50/70 text-indigo-700
- Inactive: text-slate-650 hover:bg-slate-50 hover:text-slate-900
- Mobile: hamburger → full-width drawer menu

## Design Principles
- Clean, minimal, academic aesthetic
- Ample whitespace
- Subtle micro-interactions (hover states, transitions)
- French language UI
- Accessible color contrast
- Consistent rounded corners (xl-3xl scale)
- No serif fonts — maintain modern feel

## Layout
- Single-page app (no router) controlled via React state
- Persistent top navbar
- Page background: bg-slate-50
- App workspace: single column with panels (text input → options → results → history)

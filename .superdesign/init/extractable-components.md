# Extractable Components

## Layout Components

### NavBar
- **Source**: `src/components/Navbar.tsx`
- **Category**: layout
- **Description**: Responsive top navbar with logo, desktop/mobile nav links, user auth controls, admin badge
- **Extractable props**: `activePage` (string), `activeTab` (string), `currentUser` (object|null), `isAdminAuthenticated` (boolean)
- **Extractable events**: `setActivePage`, `setActiveTab`, `handleLogout`, `onAdminClick`, `onLockAdmin`
- **Hardcoded**: Logo text ("HumanFlow Architect"), nav item labels (Accueil, Outil Humaniseur, Guide), all styling/CSS, icon names

## Basic Components

### OptionSelector (Profile & Options Panel)
- **Source**: `src/components/OptionSelector.tsx`
- **Category**: basic
- **Description**: Selection panel with academic profiles, grade levels, creativity levels, and toggle switches
- **Extractable props**: `options` (HumanizeOptions), `setOptions` (setter)
- **Hardcoded**: Profile names and descriptions, grade level names, creativity level names, toggle labels, all styling

### MetricDisplay (Results Panel)
- **Source**: `src/components/MetricDisplay.tsx`
- **Category**: basic
- **Description**: Shows AI footprint gauges, word counts, perplexity/burstiness indices, detected clichés
- **Extractable props**: `metrics` (object with scores, counts, indices)
- **Hardcoded**: Label text, classification thresholds, all styling

### HistoryPanel (History List)
- **Source**: `src/components/HistoryPanel.tsx`
- **Category**: basic
- **Description**: Searchable, filterable history list with markdown/LaTeX export
- **Extractable props**: `history` (array), `onSelectItem` (callback), `onClearHistory` (callback)
- **Hardcoded**: Filter labels, export button styling, profile name mapping

## Page Components (not extractable as reusable DraftComponents)

### LandingPage
- **Source**: `src/components/LandingPage.tsx`
- **Category**: page (full marketing page)
- **Description**: Full landing page with hero, sandbox demo, feature cards, testimonial, CTA
- **Not suitable for extraction** — it's a full page, not a reusable component

### LoginView
- **Source**: `src/components/LoginView.tsx`
- **Category**: page (auth form)
- **Not suitable for extraction** — page-level auth form

### RegisterView
- **Source**: `src/components/RegisterView.tsx`
- **Category**: page (auth form)
- **Not suitable for extraction** — page-level auth form

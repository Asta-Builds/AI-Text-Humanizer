# Layout Components

## Navbar (shared layout component)
- **File**: `src/components/Navbar.tsx`
- **Description**: Responsive top navigation bar with:
  - Logo: "HumanFlow Architect" with gradient icon
  - Desktop nav links: Accueil, Outil Humaniseur, Guide et Rubrique (plus admin-only Traces Système, Clés d'API)
  - User auth: login/signup buttons when logged out, avatar + name + logout when logged in
  - Admin badge indicator
  - Mobile hamburger drawer menu with full nav + auth controls
- **Sticky**: `position: sticky top-0 z-50`
- **Full source**: See `components.md`

## App Shell (in `App.tsx`)
- No dedicated layout wrapper component
- The page system uses conditional rendering:
  - `activePage === "landing"` → `<LandingPage />`
  - `activePage === "login"` → `<LoginView />`
  - `activePage === "register"` → `<RegisterView />`
  - `activePage === "app"` → tabbed interface (visualizer, logs, apikey, docs)
- `<Navbar />` is rendered above all pages, always visible
- The app is single-page (no router), all page state managed via `activePage` and `activeTab` in `App.tsx`

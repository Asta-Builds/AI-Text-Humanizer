# Page Dependency Trees

## `/` — Landing Page (`activePage === "landing"`)
- **Entry**: `src/components/LandingPage.tsx`
- **State**: `activePage`, `activeTab`, `currentUser` (from App.tsx)
- **Dependencies**:
  - `lucide-react` (icons)
  - No local component imports — self-contained page component

## `/app` — Main Application Workspace (`activePage === "app"`)
- **Entry**: Rendered inline in `src/App.tsx`
- **Dependencies**:
  - `src/components/OptionSelector.tsx`
  - `src/components/MetricDisplay.tsx`
  - `src/components/HistoryPanel.tsx`
  - `src/data.ts` (PRESET_EXAMPLES)
  - `src/types.ts` (HumanizeOptions, HumanizeHistoryItem)
  - `src/utils/wordExporter.ts`
  - `src/utils/googleDocsExporter.ts`
  - `src/utils/supabase.ts`
  - `lucide-react` (icons)

## `/login` — Login Page (`activePage === "login"`)
- **Entry**: `src/components/LoginView.tsx`
- **Dependencies**:
  - `src/utils/supabase.ts` (signInWithEmail, signInWithGoogle)
  - `lucide-react` (icons)

## `/register` — Registration Page (`activePage === "register"`)
- **Entry**: `src/components/RegisterView.tsx`
- **Dependencies**:
  - `src/utils/supabase.ts` (signUpWithEmail)
  - `lucide-react` (icons)

## Root App Shell (`src/App.tsx`)
- **Renders always**: `<Navbar />`
- **Route state**: `activePage` + `activeTab` (useState in App.tsx)
- **Layout**: Simple conditional rendering, no React Router
- **Dependencies**:
  - `src/components/Navbar.tsx`
  - `src/components/LandingPage.tsx`
  - `src/components/LoginView.tsx`
  - `src/components/RegisterView.tsx`
  - `src/components/OptionSelector.tsx`
  - `src/components/MetricDisplay.tsx`
  - `src/components/HistoryPanel.tsx`
  - `src/data.ts`
  - `src/types.ts`
  - `src/utils/wordExporter.ts`
  - `src/utils/googleDocsExporter.ts`
  - `src/utils/supabase.ts`

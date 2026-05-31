# Routes / Pages

This is a single-page app with **no router**. Navigation is controlled via React state in `App.tsx`:

```tsx
const [activePage, setActivePage] = useState<"landing" | "app" | "login" | "register">("landing");
const [activeTab, setActiveTab] = useState<"visualizer" | "logs" | "apikey" | "docs">("visualizer");
```

## Page Map

| URL | activePage | Route Component | Description |
|-----|-----------|----------------|-------------|
| `/` (default) | `landing` | `LandingPage` | Marketing landing page with hero, sandbox demo, features, testimonial, CTA |
| `/app` | `app` + `tab` | Rendered inline in `App.tsx` | Main application workspace |
| `/login` | `login` | `LoginView` | Email/password login + Google OAuth |
| `/register` | `register` | `RegisterView` | Registration with name, email, password, role |

## App Tabs (when `activePage === "app"`)

| activeTab | Content |
|-----------|---------|
| `visualizer` | Main humanizer — text input area, OptionSelector, transform button, history panel, MetricDisplay, sentence diff view |
| `logs` | System logs panel (admin only) — shows API calls, errors, health status |
| `apikey` | Credentials setup guide (admin only) — shows API key status and instructions |
| `docs` | Guide / help documentation page |

# HashVault

Application [Next.js 16](https://nextjs.org) (App Router, React 19, Tailwind v4, TypeScript).
Dashboard fintech « institutional yield vaults » avec espace client + admin.
Stockage en mémoire (mock DB) — pas de blockchain dans cette branche.

## Pages

### Espace client (`app/(client)/`)

| Route | Rôle | Données |
|---|---|---|
| `/` | Dashboard portfolio : KPIs hero, courbe valeur, donut allocation, table vaults | Mock DB |
| `/vaults` | Détail position par position : KPIs, progress, chart yield, scenarios, transactions | Mock DB |
| `/invest` | Stepper 4 étapes : sélection vault → produit → dépôt simulé → confirmation | Mock DB + `POST /api/positions` |

### Espace admin (`app/admin/`)

| Route | Rôle |
|---|---|
| `/admin` | Vue d'ensemble : TVL, dépôts, yield, fees, produits, transactions récentes |
| `/admin/products` | Liste produits + édition (`/admin/products/[slug]`) |
| `/admin/positions` | Toutes positions (TVL, gains, progress) |
| `/admin/users` | Liste investisseurs |

### API

- `GET  /api/health` — healthcheck
- `POST /api/positions` — création de position simulée

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir **`http://127.0.0.1:8000`** — le serveur de dev est fixé sur le port **8000** et l'hôte **127.0.0.1** uniquement (voir `package.json`).

Production locale après build :

```bash
npm run build
npm start
```

## Architecture

```
app/
  (client)/          → espace investisseur (Topbar partagée)
    page.tsx + DashboardClient.tsx
    vaults/         → My Vaults
    invest/         → flow d'investissement (4 étapes)
  admin/            → console admin (sidebar sombre)
    page.tsx
    products/, positions/, users/
  api/              → routes API (health, positions)
  layout.tsx        → root (Geist Sans + Mono, viewport, metadata)
  globals.css       → design system v2 (tokens, surfaces, motion)

components/
  Topbar.tsx          → glass sticky, tabs, ⌘K trigger, ThemeToggle, burger mobile
  MobileDrawer.tsx    → drawer navigation mobile (slide-in)
  ThemeToggle.tsx     → bouton soleil/lune (useTheme)
  Sparkline.tsx       → mini SVG sparkline (canvas-like, gradient fill)
  ViewTransitionLink  → <a> avec View Transitions API natif
  ui.tsx              → Card, StatCard (+sparkline), Kpi, Pill, Badge, ProgressBar,
                         StratBar, LegendItem, SumRow, TxRow, EmptyState,
                         Skeleton, Divider, PageHeader, SectionTitle, Label
  charts/             → PortfolioLineChart · AllocationDonut · YieldBarChart
                         (chart.js partagé via ChartRegistry)

providers/
  ThemeProvider.tsx         → context light/dark, localStorage, NO_FLASH_SCRIPT
  ToastProvider.tsx         → file de toasts (success/error/info, auto-dismiss)
  CommandPaletteProvider    → ⌘K palette avec fuzzy search, navigation, actions

hooks/
  useNowMs.ts       → horloge partagée (useSyncExternalStore, SSR-safe)

lib/
  db/store.ts       → adapter mock DB (in-memory, lit/écrit `lib/db/seed.ts`)
  db/types.ts       → Product · User · Position · Transaction · PortfolioPoint
  format.ts         → formatUsd, formatNumber, shortenAddress, formatDate, …
```

## Design system v2

Tokens dans `app/globals.css` :

- **Palette** : neutrals Apple (`#0F1115` → `#FBFBFD`) + scale mint Hearst (50→900)
- **Radii** : `--radius-card` (18px), `--radius-pill`, `--radius-input` (12px)
- **Shadows** : `subtle`, `soft`, `lift`, `glow`, `mint`, `ring`, `focus`
- **Motion** : `--ease-out` (Apple cubic-bezier), `--ease-spring`, durées `fast/base/slow`
- **Typography** : Geist Sans + Mono, scale `display / h1 / h2 / h3 / kpi-xl…sm`, `font-feature-settings: cv11 ss01 ss03 tnum`
- **Background** : gradient mint très subtil en arrière-plan (`body::before`)

Composants réutilisables clés (`components/ui.tsx`) :

- `<StatCard>` — KPI carte avec accent latéral, delta optionnel, sparkline intégrée
- `<PageHeader>` — h1 + subtitle + actions à droite
- `<EmptyState>` — icône + titre + description + CTA
- `<Skeleton>` — pulse loading
- `<Sparkline>` — mini courbe SVG avec gradient

**Dark mode** : tokens `:root[data-theme="dark"]` dans `globals.css`, toggle persisté en `localStorage`, anti-flash inline script.

**⌘K Command Palette** : fuzzy search, navigation + actions (dark mode toggle), keyboard nav (↑↓ + Enter + Esc).

**Toasts** : provider avec file FIFO, 3 variants (success/error/info), auto-dismiss 4s, animation entrée/sortie.

**View Transitions** : `::view-transition-old/new` CSS + `ViewTransitionLink` component pour transitions cinématiques.

**Mobile** : burger menu → `MobileDrawer` slide-in, topbar responsive (`hidden sm:`), table scroll wrapper.

Animations : `.anim-fade-up`, `.anim-fade-in`, `.stagger > *` (délai cascade).
Respecte `prefers-reduced-motion`.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Dev server Turbopack sur `127.0.0.1:8000` |
| `npm run build` | Build production |
| `npm start` | Serveur production (port `$PORT` ou 8000) |
| `npm run lint` | ESLint |

## Notes

- Pas de blockchain dans cette branche : la mock DB simule positions et transactions.
- Le wallet affiché en topbar est un placeholder (`0x7Ab…a3F2`).
- Pour brancher du Web3 réel, voir l'historique git : une version précédente intégrait
  wagmi v2 + AppKit + ABI EpochVault/VaultFactory.

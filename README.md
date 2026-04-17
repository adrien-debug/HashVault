# HashVault

Application [Next.js 16](https://nextjs.org) (App Router, React 19, Tailwind v4, TypeScript).
Frontend dans `app/`, mini backend via routes API (`app/api/`), couche Web3 dans
`lib/web3/`, `lib/abi/`, `hooks/` et `providers/`.

## Pages

| Route | Rôle | Données |
|---|---|---|
| `/` | Landing publique : hero + section produits + section "Why HashVault" + CTA "Launch App" + footer | Statique |
| `/dashboard` | Dashboard demo (KPI, portfolio chart, allocation, liste vaults) | **Mocks** — preview design |
| `/platform` | Liste des deux vaults (Prime + Growth) avec carte par vault | **On-chain** via `useVaultInfo` (fallback APR statique si vault non déployé) |
| `/vault/[id]` | Page d'un vault : métriques, formulaire dépôt (Approve → Deposit), position user (Claim / Compound / Withdraw) | **On-chain** via `useVaultInfo`, `useUserVaultInfo`, `useUsdcAllowance/Approve`, `useDeposit`, `useClaimRewards`, `useRedepositRewards`, `useWithdraw` |
| `/api/health` | Healthcheck JSON | — |

Toutes les pages applicatives partagent `app/(app)/layout.tsx` (sidebar + bannière "wrong network" si chainId non supportée).

## Démarrage

```bash
npm install
cp .env.example .env.local   # puis remplir au minimum NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
npm run dev
```

Ouvrir **`http://127.0.0.1:8000`** — le serveur de dev est fixé sur le port **8000**
et sur l’hôte **127.0.0.1** uniquement (voir `package.json`).

Production locale après build :

```bash
npm run build
npm start
```

Même port et même hôte : **8000** / **127.0.0.1**.

## Architecture Web3

| Dossier | Rôle |
|---|---|
| `lib/web3/env.ts` | Lecture des variables `NEXT_PUBLIC_*`, fallbacks, validation |
| `lib/web3/contracts.ts` | Adresses USDC / VaultFactory / vaults Prime & Growth par chaîne |
| `lib/web3/wagmi.ts` | Adapter `@reown/appkit-adapter-wagmi`, networks supportées |
| `lib/abi/EpochVault.json` | ABI du contrat `EpochVault.sol` (vault USDC, epochs 30j) |
| `lib/abi/VaultFactory.json` | ABI du contrat `VaultFactory.sol` |
| `lib/abi/erc20.ts` | ABI ERC-20 minimal (allowance / approve / balance) |
| `providers/Web3Provider.tsx` | `WagmiProvider` + `QueryClientProvider` + AppKit init |
| `hooks/useVault.ts` | `useVaultInfo`, `useUserVaultInfo`, `useDeposit`, `useWithdraw`, `useClaimRewards`, `useRedepositRewards`, `useUsdcAllowance`, `useUsdcApprove`, `useExpectedRewards`, `useEmergencyWithdraw` |
| `hooks/useFactory.ts` | `useDeployedVaults` |
| `hooks/useNowSeconds.ts` | Horloge partagée (via `useSyncExternalStore`) pour countdowns / progress |
| `lib/format.ts` | Helpers d'affichage (`formatUsd`, `formatNumber`, `formatDuration`, `shortenAddress`) |
| `components/ConnectWalletButton.tsx` | CTA wallet (ouvre AppKit) |
| `components/shared/NetworkBanner.tsx` | Bandeau d'avertissement "wrong network" |
| `components/landing/*` | `Hero`, `Highlights`, `Footer`, `LandingNav` |
| `components/platform/VaultCard.tsx` | Carte vault avec APR / total deposits / CTA |
| `components/vault/VaultMetrics.tsx` | Métriques on-chain (APR, total, epoch courant, countdown) |
| `components/vault/DepositCard.tsx` | Flow Approve → Deposit (input USDC, balance, est. reward) |
| `components/vault/UserPositionCard.tsx` | Position user + Claim / Compound / Withdraw |

### Networks supportées

- **Base mainnet** (chainId `8453`) — cible production
- **Base Sepolia** (chainId `84532`) — testnet par défaut
- **Sepolia** (chainId `11155111`) — fallback dev (déploiement legacy)

### Variables d'environnement

Voir `.env.example`. Au minimum :

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — sans cette clé l'AppKit n'est pas initialisé.
- `NEXT_PUBLIC_BASE_VAULT_PRIME_ADDRESS` / `NEXT_PUBLIC_BASE_VAULT_GROWTH_ADDRESS` — à
  renseigner après déploiement des vaults sur Base. Les adresses USDC sont
  pré-remplies (Circle USDC officiel).

## API

- `GET /api/health` → `{ "ok": true, "app": "HashVault" }`

## Référence

Le code Solidity et le front legacy se trouvent dans `external/` (cloné depuis les
repos `SingularityDAO-dev/Meeneo-dapp` et `SingularityDAO-dev/meeneo-epoch-vault`).
Ces dossiers sont en lecture seule — ils ne servent qu'à comprendre le contrat et
sont ignorés par git.

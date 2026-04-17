export type ProductSlug = "prime" | "growth";
export type ProductStatus = "live" | "paused" | "draft";
export type RiskLabel = "Moderate" | "Growth" | "Conservative";

export type Pocket = {
  label: string;
  pct: number;
  color: string;
};

export type ScenarioType = "bull" | "flat" | "bear";

export type Scenario = {
  type: ScenarioType;
  title: string;
  description: string;
  mix: { color: string; weight: number }[];
};

export type Product = {
  id: string;
  slug: ProductSlug;
  name: string;
  status: ProductStatus;
  apy: number;
  minDeposit: number;
  lockMonths: number;
  cumulativeTargetPct: number;
  risk: RiskLabel;
  feesMgmtPct: number;
  feesPerfPct: number;
  network: string;
  depositToken: string;
  description: string;
  lead: string;
  pockets: Pocket[];
  scenarios: Scenario[];
  activeRegime: ScenarioType;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  walletAddress: string;
  label?: string;
  createdAt: string;
};

export type Position = {
  id: string;
  userId: string;
  productSlug: ProductSlug;
  index: number;
  amountUsd: number;
  currentValueUsd: number;
  yieldPaidUsd: number;
  startedAt: string;
  maturesAt: string;
  cumulativeProgressPct: number;
};

export type TransactionType =
  | "deposit"
  | "yield"
  | "fee"
  | "withdraw"
  | "claim";

export type Transaction = {
  id: string;
  positionId: string;
  type: TransactionType;
  amountUsd: number;
  txHash: string;
  createdAt: string;
  frequency?: "daily" | "monthly" | "one-off";
  note?: string;
};

export type PortfolioPoint = {
  month: string;
  valueUsd: number;
};

export type DB = {
  products: Product[];
  users: User[];
  positions: Position[];
  transactions: Transaction[];
  portfolioHistory: PortfolioPoint[];
};

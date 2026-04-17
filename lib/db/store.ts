import { promises as fs } from "node:fs";
import path from "node:path";
import { SEED_DB } from "./seed";
import type {
  DB,
  Position,
  Product,
  Transaction,
  TransactionType,
  User,
} from "./types";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

let cache: DB | null = null;
let writeChain: Promise<unknown> = Promise.resolve();

async function ensureFile(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as DB;
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(SEED_DB, null, 2), "utf-8");
    return structuredClone(SEED_DB);
  }
}

async function readDb(): Promise<DB> {
  if (cache) return cache;
  cache = await ensureFile();
  return cache;
}

async function writeDb(next: DB): Promise<void> {
  cache = next;
  writeChain = writeChain
    .catch(() => undefined)
    .then(async () => {
      try {
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
        await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf-8");
      } catch (err) {
        // Serverless filesystems (e.g. Vercel) are read-only at runtime; mutations are kept in-memory only.
        console.warn("[db] write failed (in-memory only):", (err as Error).message);
      }
    });
  await writeChain;
}

function uid(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function now(): string {
  return new Date().toISOString();
}

export const db = {
  async snapshot(): Promise<DB> {
    return structuredClone(await readDb());
  },

  // ---------- Products ----------
  async listProducts(): Promise<Product[]> {
    const d = await readDb();
    return d.products.slice();
  },

  async getProduct(id: string): Promise<Product | null> {
    const d = await readDb();
    return d.products.find((p) => p.id === id || p.slug === id) ?? null;
  },

  async updateProduct(id: string, patch: Partial<Product>): Promise<Product | null> {
    const d = await readDb();
    const i = d.products.findIndex((p) => p.id === id || p.slug === id);
    if (i === -1) return null;
    const updated: Product = { ...d.products[i], ...patch, updatedAt: now() };
    d.products[i] = updated;
    await writeDb(d);
    return updated;
  },

  // ---------- Users ----------
  async listUsers(): Promise<User[]> {
    const d = await readDb();
    return d.users.slice();
  },

  async getUser(id: string): Promise<User | null> {
    const d = await readDb();
    return d.users.find((u) => u.id === id || u.walletAddress === id) ?? null;
  },

  // ---------- Positions ----------
  async listPositions(filter?: { userId?: string; productSlug?: string }): Promise<Position[]> {
    const d = await readDb();
    return d.positions.filter((p) => {
      if (filter?.userId && p.userId !== filter.userId) return false;
      if (filter?.productSlug && p.productSlug !== filter.productSlug) return false;
      return true;
    });
  },

  async getPosition(id: string): Promise<Position | null> {
    const d = await readDb();
    return d.positions.find((p) => p.id === id) ?? null;
  },

  async createPosition(input: {
    userId: string;
    productSlug: Position["productSlug"];
    amountUsd: number;
  }): Promise<Position> {
    const d = await readDb();
    const product = d.products.find((p) => p.slug === input.productSlug);
    if (!product) throw new Error(`Unknown product: ${input.productSlug}`);

    const sameProduct = d.positions.filter(
      (p) => p.userId === input.userId && p.productSlug === input.productSlug,
    );
    const index = sameProduct.length + 1;

    const startedAt = new Date();
    const maturesAt = new Date(startedAt);
    maturesAt.setMonth(maturesAt.getMonth() + product.lockMonths);

    const pos: Position = {
      id: uid("pos"),
      userId: input.userId,
      productSlug: input.productSlug,
      index,
      amountUsd: input.amountUsd,
      currentValueUsd: input.amountUsd,
      yieldPaidUsd: 0,
      startedAt: startedAt.toISOString(),
      maturesAt: maturesAt.toISOString(),
      cumulativeProgressPct: 0,
    };
    d.positions.push(pos);

    const tx: Transaction = {
      id: uid("tx"),
      positionId: pos.id,
      type: "deposit",
      amountUsd: input.amountUsd,
      txHash: `0x${Math.random().toString(16).slice(2).padEnd(40, "0").slice(0, 40)}`,
      createdAt: startedAt.toISOString(),
      frequency: "one-off",
      note: "Initial deposit",
    };
    d.transactions.push(tx);

    await writeDb(d);
    return pos;
  },

  // ---------- Transactions ----------
  async listTransactions(filter?: {
    positionId?: string;
    userId?: string;
    type?: TransactionType;
    limit?: number;
  }): Promise<Transaction[]> {
    const d = await readDb();
    let txs = d.transactions.slice();
    if (filter?.positionId) txs = txs.filter((t) => t.positionId === filter.positionId);
    if (filter?.type) txs = txs.filter((t) => t.type === filter.type);
    if (filter?.userId) {
      const userPositions = new Set(
        d.positions.filter((p) => p.userId === filter.userId).map((p) => p.id),
      );
      txs = txs.filter((t) => userPositions.has(t.positionId));
    }
    txs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    if (filter?.limit) txs = txs.slice(0, filter.limit);
    return txs;
  },

  // ---------- Aggregates ----------
  async portfolioHistory() {
    const d = await readDb();
    return d.portfolioHistory.slice();
  },
};

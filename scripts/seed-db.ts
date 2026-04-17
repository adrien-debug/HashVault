import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { SEED_DB } from "../lib/db/seed";

const out = join(process.cwd(), "data", "db.json");
mkdirSync(join(process.cwd(), "data"), { recursive: true });
writeFileSync(out, JSON.stringify(SEED_DB, null, 2), "utf-8");
console.log("Wrote", out, `(${Object.keys(SEED_DB).join(", ")})`);

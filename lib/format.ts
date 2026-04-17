export function formatUsd(value: string | number | undefined, opts?: Intl.NumberFormatOptions) {
  if (value === undefined || value === null || value === "") return "$0";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "$0";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
    ...opts,
  });
}

export function formatNumber(value: string | number | undefined, fractionDigits = 2) {
  if (value === undefined || value === null || value === "") return "0";
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString("en-US", {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  });
}

export function shortenAddress(address: string | undefined, chars = 4) {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function formatDuration(seconds: number) {
  if (!seconds || seconds <= 0) return "0s";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatCountdown(targetSeconds: number) {
  const now = Math.floor(Date.now() / 1000);
  return formatDuration(Math.max(0, targetSeconds - now));
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatShortHash(hash: string) {
  if (!hash) return "";
  return `${hash.slice(0, 4)}…${hash.slice(-2)}`;
}


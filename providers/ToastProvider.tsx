"use client";

import { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  leaving?: boolean;
};

type Ctx = {
  toast: (opts: Omit<ToastItem, "id">) => string;
  dismiss: (id: string) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

let counter = 0;

function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const Icon = item.variant === "error" ? XCircle : item.variant === "success" ? CheckCircle : Info;

  return (
    <div className={`toast toast-${item.variant ?? "info"}${item.leaving ? " toast-leaving" : ""}`} role="alert">
      <div className="toast-icon"><Icon size={15} strokeWidth={2.25} /></div>
      <div className="flex-1 min-w-0">
        <div className="toast-title">{item.title}</div>
        {item.description && <div className="toast-desc">{item.description}</div>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        className="flex-shrink-0 opacity-40 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const dismiss = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 220);
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const toast = useCallback(
    (opts: Omit<ToastItem, "id">): string => {
      const id = `t-${++counter}`;
      const duration = opts.duration ?? 4000;
      setItems((prev) => [...prev.slice(-4), { ...opts, id }]);
      timers.current[id] = setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  useEffect(() => {
    const t = timers.current;
    return () => { Object.values(t).forEach(clearTimeout); };
  }, []);

  return (
    <ToastCtx.Provider value={{ toast, dismiss }}>
      {children}
      <div className="toast-region" aria-live="polite" aria-label="Notifications">
        {items.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

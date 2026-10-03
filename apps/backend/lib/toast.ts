"use client";

export type ToastKind = "success" | "error" | "info";
export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

let items: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function push(kind: ToastKind, message: string) {
  const item = { id: nextId++, kind, message };
  items = [...items, item].slice(-4);
  emit();
  return item.id;
}

export function dismissToast(id: number) {
  items = items.filter((t) => t.id !== id);
  emit();
}

export function subscribeToasts(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export function getToasts() {
  return items;
}

const EMPTY: ToastItem[] = [];
export function getServerToasts() {
  return EMPTY;
}

/** Drop-in replacement for the react-toastify / sonner calls used before. */
export const toast = {
  success: (message: string) => push("success", message),
  error: (message: string) => push("error", message),
  info: (message: string) => push("info", message),
};

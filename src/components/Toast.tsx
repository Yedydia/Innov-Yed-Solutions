"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

type ToastType = "success" | "error";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const borderColor = toast.type === "success" ? "border-l-green" : "border-l-red";
  const Icon = toast.type === "success" ? CheckCircle : AlertCircle;
  const iconColor = toast.type === "success" ? "text-green" : "text-red";

  return (
    <div className={`pointer-events-auto glass rounded-xl border-l-4 ${borderColor} p-4 shadow-xl flex items-start gap-3 min-w-[300px] max-w-sm animate-fadeIn`}>
      <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
      <p className="text-sm text-[var(--foreground)] flex-1">{toast.message}</p>
      <button onClick={() => onDismiss(toast.id)} className="text-gray-400 hover:text-[var(--foreground)] transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

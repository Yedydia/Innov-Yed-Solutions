"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const btnColor = variant === "danger" ? "bg-red hover:bg-red/90" : "bg-amber hover:bg-amber/90";

  return (
    <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={onCancel}>
      <div className="glass rounded-2xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-red/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red" />
          </div>
          <button onClick={onCancel} className="p-1 rounded-lg hover:bg-[var(--card-border)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-[var(--card-border)] hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 ${btnColor}`}
          >
            {loading ? "..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

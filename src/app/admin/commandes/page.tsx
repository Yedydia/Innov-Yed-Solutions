"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { Search, Eye, Loader2, ShoppingCart, User, Calendar, Package, ChevronDown, LayoutGrid, List, Rows3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { authHeaders } from "@/lib/auth-helpers";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { id: string; name: string; image: string; price: number };
}

interface Order {
  id: string;
  reference: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  total: number;
  status: string;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  en_attente: "text-amber bg-amber/10",
  confirmee: "text-cyan bg-cyan/10",
  livree: "text-green bg-green/10",
  annulee: "text-red bg-red/10",
};

const statusTransitions: Record<string, string[]> = {
  en_attente: ["confirmee", "annulee"],
  confirmee: ["livree", "annulee"],
  livree: [],
  annulee: [],
};

export default function CommandesAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/orders", { headers: authHeaders() });
      setOrders(await res.json());
    } catch {
      addToast("Erreur de chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      addToast(`Commande passée à "${newStatus}"`, "success");
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch {
      addToast("Erreur lors de la mise à jour", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/orders?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      addToast("Commande supprimée", "success");
      setOrders((prev) => prev.filter((o) => o.id !== deleteId));
      if (selected?.id === deleteId) setSelected(null);
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filtered = orders.filter((o) =>
    o.reference.toLowerCase().includes(search.toLowerCase()) ||
    o.firstName.toLowerCase().includes(search.toLowerCase()) ||
    o.lastName.toLowerCase().includes(search.toLowerCase()) ||
    o.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Commandes" subtitle={`${orders.length} commandes`} image="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=1920&q=80" />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une commande..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light"
          />
        </div>
        <div className="flex items-center gap-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1">
          <button onClick={() => setLayout("table")} className={`p-2 rounded-lg transition-colors ${layout === "table" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Tableau"><List className="w-4 h-4" /></button>
          <button onClick={() => setLayout("grid")} className={`p-2 rounded-lg transition-colors ${layout === "grid" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Grille"><LayoutGrid className="w-4 h-4" /></button>
          <button onClick={() => setLayout("compact")} className={`p-2 rounded-lg transition-colors ${layout === "compact" ? "bg-violet text-white" : "text-gray-400 hover:text-white"}`} title="Compact"><Rows3 className="w-4 h-4" /></button>
        </div>
      </div>

      {layout === "table" && (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Référence</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Client</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden md:table-cell">Date</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-medium">{order.reference}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                          {order.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm">{order.firstName} {order.lastName}</p>
                          <p className="text-xs text-gray-400">{order.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-sm text-violet-light">{formatPrice(order.total)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative group">
                        <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${statusColors[order.status] || ""}`}>
                          {order.status.replace("_", " ")}
                          {statusTransitions[order.status]?.length > 0 && <ChevronDown className="w-3 h-3 inline ml-1" />}
                        </span>
                        {statusTransitions[order.status]?.length > 0 && (
                          <div className="absolute top-full left-0 mt-1 glass rounded-xl p-1 min-w-[120px] hidden group-hover:block z-10">
                            {statusTransitions[order.status].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleStatusUpdate(order.id, s)}
                                disabled={updatingId === order.id}
                                className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50"
                              >
                                {s === "confirmee" ? "Confirmer" : s === "livree" ? "Marquer livrée" : "Annuler"}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelected(selected?.id === order.id ? null : order)} className="p-2 rounded-lg hover:bg-[var(--card-border)]">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button onClick={() => setDeleteId(order.id)} className="p-2 rounded-lg hover:bg-red/10">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {layout === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((order) => (
            <div key={order.id} className="glass rounded-2xl p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-medium">{order.reference}</span>
                <div className="relative group">
                  <span className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${statusColors[order.status] || ""}`}>
                    {order.status.replace("_", " ")}
                    {statusTransitions[order.status]?.length > 0 && <ChevronDown className="w-3 h-3 inline ml-1" />}
                  </span>
                  {statusTransitions[order.status]?.length > 0 && (
                    <div className="absolute top-full right-0 mt-1 glass rounded-xl p-1 min-w-[120px] hidden group-hover:block z-10">
                      {statusTransitions[order.status].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(order.id, s)}
                          disabled={updatingId === order.id}
                          className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50"
                        >
                          {s === "confirmee" ? "Confirmer" : s === "livree" ? "Marquer livrée" : "Annuler"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-cyan flex items-center justify-center text-white font-bold text-xs shrink-0">
                  {order.firstName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{order.firstName} {order.lastName}</p>
                  <p className="text-xs text-gray-400">{order.email}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-violet-light">{formatPrice(order.total)}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Package className="w-3 h-3" /> {order.items.length} article{order.items.length > 1 ? "s" : ""}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-[var(--card-border)]">
                <button onClick={() => setSelected(selected?.id === order.id ? null : order)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-[var(--card-border)] transition-colors">
                  <Eye className="w-4 h-4 text-gray-400" /> <span className="text-xs text-gray-400">Voir</span>
                </button>
                <button onClick={() => setDeleteId(order.id)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg hover:bg-red/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  <span className="text-xs text-gray-400">Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((order) => (
            <div key={order.id} className="glass rounded-xl p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium truncate">{order.reference}</span>
                <div className="relative group">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full cursor-pointer ${statusColors[order.status] || ""}`}>
                    {order.status.replace("_", " ")}
                    {statusTransitions[order.status]?.length > 0 && <ChevronDown className="w-2.5 h-2.5 inline ml-0.5" />}
                  </span>
                  {statusTransitions[order.status]?.length > 0 && (
                    <div className="absolute top-full right-0 mt-1 glass rounded-xl p-1 min-w-[120px] hidden group-hover:block z-10">
                      {statusTransitions[order.status].map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(order.id, s)}
                          disabled={updatingId === order.id}
                          className="w-full text-left px-3 py-1.5 text-xs rounded-lg hover:bg-[var(--card-bg)] transition-colors disabled:opacity-50"
                        >
                          {s === "confirmee" ? "Confirmer" : s === "livree" ? "Marquer livrée" : "Annuler"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-400 truncate">{order.firstName} {order.lastName}</p>
              <span className="font-bold text-sm text-violet-light">{formatPrice(order.total)}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setSelected(selected?.id === order.id ? null : order)} className="p-1.5 rounded-lg hover:bg-[var(--card-border)]">
                  <Eye className="w-3.5 h-3.5 text-gray-400" />
                </button>
                <button onClick={() => setDeleteId(order.id)} className="p-1.5 rounded-lg hover:bg-red/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-lg">Commande {selected.reference}</h2>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400"><User className="w-4 h-4" /> {selected.firstName} {selected.lastName} — {selected.email}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400"><Package className="w-4 h-4" /> {selected.address}, {selected.city}</div>
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${statusColors[selected.status] || ""}`}>{selected.status.replace("_", " ")}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Articles</p>
              <div className="space-y-2">
                {selected.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)]">
                    <div><p className="text-sm font-medium">{item.product.name}</p><p className="text-xs text-gray-400">x{item.quantity}</p></div>
                    <span className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex items-center justify-between">
              <span className="text-sm text-gray-400">Total</span>
              <span className="font-bold text-lg text-violet-light">{formatPrice(selected.total)}</span>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Supprimer la commande"
        message="Cette action est irréversible."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
}

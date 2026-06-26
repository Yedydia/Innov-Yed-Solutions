"use client";

import { useEffect, useState } from "react";
import AdminPageHeader from "@/components/AdminPageHeader";
import { ShoppingBag, Search, Plus, Edit, Trash2, Eye, Loader2, X, Save, Image as ImageIcon, LayoutGrid, List, Rows3 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { authHeaders } from "@/lib/auth-helpers";
import { useToast } from "@/components/Toast";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  image: string;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  createdAt: string;
}

const emptyProduct = { name: "", slug: "", category: "", price: 0, originalPrice: null as number | null, image: "/images/placeholder.jpg", stock: 0, rating: 0, reviews: 0, description: "" };

export default function BoutiqueAdminPage() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [layout, setLayout] = useState<"table" | "grid" | "compact">("grid");
  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products", { headers: authHeaders() });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      addToast("Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${deleteId}`, { method: "DELETE", headers: authHeaders() });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      addToast("Produit supprimé", "success");
    } catch {
      addToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price) {
      addToast("Remplissez les champs obligatoires", "error");
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (editId) {
        const res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ productId: editId, ...form, slug }),
        });
        if (!res.ok) throw new Error();
        addToast("Produit mis à jour", "success");
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({ ...form, slug }),
        });
        if (!res.ok) throw new Error();
        addToast("Produit créé", "success");
      }
      await fetchProducts();
      setModal(null);
      setForm(emptyProduct);
      setEditId(null);
    } catch {
      addToast("Erreur lors de la sauvegarde", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEdit = (p: Product) => {
    setForm({ name: p.name, slug: p.slug, category: p.category, price: p.price, originalPrice: p.originalPrice, image: p.image, stock: p.stock, rating: p.rating, reviews: p.reviews, description: p.description || "" });
    setEditId(p.id);
    setModal("edit");
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-violet" /></div>;
  }

  return (
    <div>
      <AdminPageHeader title="Gestion de la Boutique" subtitle={`${products.length} produits`} image="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80" />

      <div className="flex items-center justify-between mb-8">
        <button onClick={() => { setForm(emptyProduct); setEditId(null); setModal("add"); }} className="flex items-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90">
          <Plus className="w-4 h-4" /> Ajouter un produit
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="w-full pl-10 pr-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
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
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Produit</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Catégorie</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3">Prix</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden md:table-cell">Stock</th>
                  <th className="text-left text-xs font-semibold text-gray-400 px-5 py-3 hidden lg:table-cell">Note</th>
                  <th className="text-right text-xs font-semibold text-gray-400 px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--card-bg)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center shrink-0 overflow-hidden">
                          {product.image && product.image !== "/images/placeholder.jpg" ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-violet/40" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{product.name}</p>
                          <p className="text-xs text-gray-400 truncate">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1 rounded-full bg-violet/10 text-violet-light">{product.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="font-semibold text-sm">{formatPrice(product.price)}</span>
                        {product.originalPrice && <span className="text-xs text-gray-500 line-through ml-2">{formatPrice(product.originalPrice)}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className={`text-xs ${product.stock > 0 ? "text-green" : "text-red"}`}>
                        {product.stock > 0 ? `${product.stock} en stock` : "Rupture"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">{product.rating}/5 ({product.reviews})</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(product)} className="p-2 rounded-lg hover:bg-[var(--card-border)]" title="Modifier"><Edit className="w-4 h-4 text-gray-400" /></button>
                        <button onClick={() => setDeleteId(product.id)} className="p-2 rounded-lg hover:bg-red/10" title="Supprimer"><Trash2 className="w-4 h-4 text-gray-400" /></button>
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
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="glass rounded-2xl overflow-hidden group">
              <div className="h-40 bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center overflow-hidden">
                {product.image && product.image !== "/images/placeholder.jpg" ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingBag className="w-10 h-10 text-violet/40" />
                )}
              </div>
              <div className="p-4">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet-light">{product.category}</span>
                <h3 className="font-semibold text-sm mt-2 mb-1 line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-sm text-violet-light">{formatPrice(product.price)}</span>
                  {product.originalPrice && <span className="text-xs text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                  <span className={product.stock > 0 ? "text-green" : "text-red"}>{product.stock > 0 ? `${product.stock} en stock` : "Rupture"}</span>
                  <span>{product.rating}/5 ({product.reviews})</span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-[var(--card-border)]">
                  <button onClick={() => openEdit(product)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-xs text-gray-400 transition-colors"><Edit className="w-3 h-3" /> Modifier</button>
                  <button onClick={() => setDeleteId(product.id)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-red/10 hover:bg-red/20 text-xs text-red transition-colors"><Trash2 className="w-3 h-3" /> Supprimer</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {layout === "compact" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((product) => (
            <div key={product.id} className="glass rounded-xl p-3 group hover:border-violet/30 transition-colors">
              <div className="aspect-square rounded-lg bg-gradient-to-br from-violet/20 to-cyan/20 flex items-center justify-center overflow-hidden mb-3">
                {product.image && product.image !== "/images/placeholder.jpg" ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ShoppingBag className="w-6 h-6 text-violet/40" />
                )}
              </div>
              <h4 className="font-medium text-xs line-clamp-1 mb-1">{product.name}</h4>
              <p className="text-[10px] text-gray-400 mb-2">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-violet-light">{formatPrice(product.price)}</span>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(product)} className="p-1 rounded hover:bg-[var(--card-border)]"><Edit className="w-3 h-3 text-gray-400" /></button>
                  <button onClick={() => setDeleteId(product.id)} className="p-1 rounded hover:bg-red/10"><Trash2 className="w-3 h-3 text-gray-400" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="glass rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg">{editId ? "Modifier" : "Ajouter"} un produit</h2>
              <button onClick={() => setModal(null)} className="p-1 rounded-lg hover:bg-[var(--card-border)]"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-xs text-gray-400 mb-1">Nom *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div><label className="block text-xs text-gray-400 mb-1">Catégorie *</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs text-gray-400 mb-1">Prix (FCFA) *</label><input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
                <div><label className="block text-xs text-gray-400 mb-1">Prix original</label><input type="number" value={form.originalPrice || ""} onChange={(e) => setForm({ ...form, originalPrice: e.target.value ? parseInt(e.target.value) : null })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Stock</label><input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" /></div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Image du produit (URL)</label>
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light" />
                {form.image && form.image !== "/images/placeholder.jpg" && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-[var(--card-border)] h-32">
                    <img key={form.image} src={form.image} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              <div><label className="block text-xs text-gray-400 mb-1">Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-violet-light resize-none" /></div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-violet text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-violet/90 disabled:opacity-50">
                <Save className="w-4 h-4" /> {saving ? "..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Supprimer le produit" message="Cette action est irréversible." confirmLabel="Supprimer" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} loading={deleting} />
    </div>
  );
}

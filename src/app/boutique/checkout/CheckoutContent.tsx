"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/components/CartContext";
import { useAuth } from "@/components/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  ShoppingCart, CreditCard, Truck, Check, ChevronRight,
  Minus, Plus, Trash2, ArrowLeft, Shield, Lock,
  MapPin, Phone, Mail, User,
} from "lucide-react";

const steps = [
  { id: 1, label: "Panier", icon: ShoppingCart },
  { id: 2, label: "Livraison", icon: Truck },
  { id: 3, label: "Paiement", icon: CreditCard },
];

type ShippingForm = {
  firstName: string; lastName: string; email: string; phone: string;
  address: string; city: string; zip: string; notes: string;
  paymentMethod: string;
};

type FormErrors = Partial<Record<keyof ShippingForm | "cardNumber" | "cardExpiry" | "cardCvv" | "cardName", string>>;

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, total: subtotal, clearCart } = useCart();
  const { user, token } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [productMap, setProductMap] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: { slug: string; category: string }[]) => {
        const map: Record<string, string> = {};
        data.forEach((p) => { map[p.slug] = p.category || ""; });
        setProductMap(map);
      })
      .catch(() => {});
  }, []);
  const [shippingForm, setShippingForm] = useState<ShippingForm>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "Cotonou", zip: "", notes: "",
    paymentMethod: "mobile",
  });
  const [ordering, setOrdering] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Credit card fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const shipping = subtotal > 100000 ? 0 : 5000;
  const total = subtotal + shipping;

  const cartItems = items;

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const validateStep2 = (): boolean => {
    const errs: FormErrors = {};
    if (!shippingForm.firstName.trim()) errs.firstName = "Prénom requis";
    if (!shippingForm.lastName.trim()) errs.lastName = "Nom requis";
    if (!shippingForm.email.trim()) errs.email = "Email requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingForm.email)) errs.email = "Email invalide";
    if (!shippingForm.phone.trim()) errs.phone = "Téléphone requis";
    if (!shippingForm.address.trim()) errs.address = "Adresse requise";
    if (!shippingForm.city.trim()) errs.city = "Ville requise";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errs: FormErrors = {};
    if (shippingForm.paymentMethod === "card") {
      const digits = cardNumber.replace(/\D/g, "");
      if (digits.length !== 16) errs.cardNumber = "16 chiffres requis";
      if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) errs.cardExpiry = "Format MM/AA";
      else {
        const [mm, yy] = cardExpiry.split("/").map(Number);
        const now = new Date();
        const exp = new Date(2000 + yy, mm);
        if (mm < 1 || mm > 12 || exp <= now) errs.cardExpiry = "Date invalide ou expirée";
      }
      const cvvDigits = cardCvv.replace(/\D/g, "");
      if (cvvDigits.length !== 3) errs.cardCvv = "3 chiffres requis";
      if (!cardName.trim()) errs.cardName = "Nom du titulaire requis";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  if (orderDone) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 rounded-full bg-green/20 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green" />
          </div>
          <h1 className="font-display text-3xl font-bold mb-4">Commande Confirmée !</h1>
          <p className="text-gray-400 mb-6">Merci pour votre commande. Vous recevrez un email de confirmation avec les détails de livraison.</p>
          <Link href="/boutique" className="inline-flex items-center gap-2 bg-cyan text-navy px-8 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} title="Connectez-vous pour finaliser votre commande" />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link href="/boutique" className="text-gray-400 hover:text-cyan flex items-center gap-2 text-sm">
            <ArrowLeft className="w-4 h-4" /> Boutique
          </Link>
          <h1 className="font-display text-3xl font-bold">Commande</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-12">
          {steps.map((s, idx) => (
            <div key={s.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                step >= s.id ? "bg-cyan text-navy" : "bg-[var(--card-bg)] border border-[var(--card-border)] text-gray-400"
              }`}>
                {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                <span className="text-sm font-medium">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-16 h-0.5 ${step > s.id ? "bg-cyan" : "bg-[var(--card-border)]"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="font-display text-xl font-semibold mb-2">Votre panier est vide</h2>
                    <p className="text-gray-400 mb-6">Découvrez nos produits dans la boutique.</p>
                    <Link href="/boutique" className="inline-flex items-center gap-2 bg-cyan text-navy px-6 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Retour à la boutique
                    </Link>
                  </div>
                ) : (
                  <>
                    <h2 className="font-display text-xl font-semibold mb-4">Votre Panier ({cartItems.reduce((s, i) => s + i.quantity, 0)} articles)</h2>
                    {cartItems.map((item) => (
                      <div key={item.slug} className="glass rounded-xl p-4 flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 relative">
                          <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                          <p className="text-xs text-gray-400">
                            {productMap[item.slug] || ""}
                          </p>
                          <p className="font-bold text-cyan mt-2">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex flex-col items-end justify-between">
                          <button onClick={() => removeItem(item.slug)} className="text-gray-400 hover:text-red transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center border border-[var(--card-border)] rounded-lg overflow-hidden">
                            <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="px-2 py-1 hover:bg-[var(--card-border)]"><Minus className="w-3 h-3" /></button>
                            <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="px-2 py-1 hover:bg-[var(--card-border)]"><Plus className="w-3 h-3" /></button>
                          </div>
                        </div>
                      </div>
                    ))}

                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-6">Informations de Livraison</h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        required
                        value={shippingForm.firstName}
                        onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                        placeholder="Prénom"
                        className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                      />
                      {formErrors.firstName && <p className="text-xs text-red mt-1">{formErrors.firstName}</p>}
                    </div>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <input
                        required
                        value={shippingForm.lastName}
                        onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                        placeholder="Nom"
                        className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                      />
                      {formErrors.lastName && <p className="text-xs text-red mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      required type="email"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                      placeholder="Email"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                    {formErrors.email && <p className="text-xs text-red mt-1">{formErrors.email}</p>}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      required type="tel"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                      placeholder="+229 XX XX XX XX"
                      title="Veuillez remplir ce champ"
                      onInvalid={(e) => { e.preventDefault(); (e.target as HTMLInputElement).setCustomValidity("Veuillez remplir ce champ"); }}
                      onInput={(e) => { (e.target as HTMLInputElement).setCustomValidity(""); }}
                      className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                    {formErrors.phone && <p className="text-xs text-red mt-1">{formErrors.phone}</p>}
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      required
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      placeholder="Adresse complète"
                      className="w-full pl-10 pr-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                    {formErrors.address && <p className="text-xs text-red mt-1">{formErrors.address}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        required
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        placeholder="Ville"
                        className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                      />
                      {formErrors.city && <p className="text-xs text-red mt-1">{formErrors.city}</p>}
                    </div>
                    <input
                      value={shippingForm.zip}
                      onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                      placeholder="Code postal"
                      className="px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                    />
                  </div>
                  <textarea
                    value={shippingForm.notes}
                    onChange={(e) => setShippingForm({ ...shippingForm, notes: e.target.value })}
                    placeholder="Instructions de livraison (optionnel)"
                    rows={3}
                    className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan resize-none"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-display text-xl font-semibold mb-6">Mode de Paiement</h2>
                <div className="space-y-4">
                  {[
                    { id: "mobile", label: "Mobile Money (MTN / Moov)", desc: "Paiement via MTN Mobile Money ou Moov Money", icon: Phone },
                    { id: "card", label: "Carte Bancaire", desc: "Visa, Mastercard via CinetPay", icon: CreditCard },
                    { id: "bank", label: "Virement Bancaire", desc: "Transfert direct vers notre compte", icon: Shield },
                  ].map((method) => (
                    <label key={method.id} className="glass rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:border-cyan/30 transition-all">
                      <input type="radio" name="payment" value={method.id} checked={shippingForm.paymentMethod === method.id} onChange={(e) => setShippingForm({ ...shippingForm, paymentMethod: e.target.value })} className="accent-cyan" />
                      <method.icon className="w-6 h-6 text-cyan" />
                      <div>
                        <p className="font-semibold text-sm">{method.label}</p>
                        <p className="text-xs text-gray-400">{method.desc}</p>
                      </div>
                    </label>
                  ))}

                  {shippingForm.paymentMethod === "card" && (
                    <div className="glass rounded-xl p-5 mt-4 space-y-4">
                      <h3 className="font-semibold text-sm flex items-center gap-2"><CreditCard className="w-4 h-4 text-cyan" /> Coordonnées bancaires</h3>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Numéro de carte</label>
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan tracking-widest"
                        />
                        {formErrors.cardNumber && <p className="text-xs text-red mt-1">{formErrors.cardNumber}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Date d&apos;expiration</label>
                          <input
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/AA"
                            maxLength={5}
                            className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                          />
                          {formErrors.cardExpiry && <p className="text-xs text-red mt-1">{formErrors.cardExpiry}</p>}
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">CVV</label>
                          <input
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            placeholder="123"
                            maxLength={3}
                            type="password"
                            className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                          />
                          {formErrors.cardCvv && <p className="text-xs text-red mt-1">{formErrors.cardCvv}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Nom du titulaire</label>
                        <input
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Comme sur la carte"
                          className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm focus:outline-none focus:border-cyan"
                        />
                        {formErrors.cardName && <p className="text-xs text-red mt-1">{formErrors.cardName}</p>}
                      </div>
                    </div>
                  )}

                  <div className="glass rounded-xl p-5 mt-6">
                    <div className="flex items-center gap-2 text-sm text-green mb-3">
                      <Lock className="w-4 h-4" /> Paiement 100% sécurisé
                    </div>
                    <p className="text-xs text-gray-400">Vos données sont chiffrées et protégées par SSL 256-bit. Nous ne stockons jamais vos informations bancaires.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)} className="flex items-center gap-2 text-gray-400 hover:text-cyan text-sm">
                  <ArrowLeft className="w-4 h-4" /> Étape précédente
                </button>
              )}
              {error && <p className="text-sm text-red">{error}</p>}
              <button
                onClick={async () => {
                  setError("");
                  setFormErrors({});
                  if (step === 1 && cartItems.length === 0) return;
                  if (step === 2 && !validateStep2()) return;
                  if (step === 3 && !validateStep3()) return;
                  if (step < 3) { setStep(step + 1); return; }
                  if (!token) { setShowAuth(true); return; }
                  setOrdering(true);
                  try {
                    const res = await fetch("/api/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                      body: JSON.stringify({
                        userId: user?.id,
                        items: cartItems.map((i) => ({ name: i.name, slug: i.slug, price: i.price, quantity: i.quantity })),
                        total, shipping,
                        ...shippingForm,
                      }),
                    });
                    if (!res.ok) {
                      const data = await res.json();
                      throw new Error(data.error || "Erreur lors de la commande");
                    }
                    clearCart();
                    setOrderDone(true);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Une erreur est survenue");
                  }
                  setOrdering(false);
                }}
                disabled={ordering || (step === 1 && cartItems.length === 0)}
                className="ml-auto flex items-center gap-2 bg-cyan text-navy px-8 py-3 rounded-xl font-semibold hover:bg-cyan/90 transition-colors disabled:opacity-50"
              >
                {step === 3 ? (ordering ? "Confirmation..." : "Confirmer la commande") : "Continuer"} <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 sticky top-24">
              <h3 className="font-display font-semibold text-lg mb-4">Récapitulatif</h3>
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.slug} className="flex items-center justify-between text-sm">
                    <span className="text-gray-400 truncate mr-2">{item.name} x{item.quantity}</span>
                    <span className="font-medium shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--card-border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Sous-total</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Livraison</span>
                  <span>{shipping === 0 ? <span className="text-green">Gratuite</span> : formatPrice(shipping)}</span>
                </div>
              </div>
              <div className="border-t border-[var(--card-border)] pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-display font-bold text-lg">Total</span>
                  <span className="font-display font-bold text-lg text-cyan">{formatPrice(total)}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-3 h-3" /> Paiement sécurisé SSL 256-bit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

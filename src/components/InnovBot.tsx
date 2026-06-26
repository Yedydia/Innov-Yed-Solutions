"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles, ThumbsUp, ThumbsDown, RotateCcw } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string; id: number };

const SYSTEM_PROMPT = `Tu es Innov'Bot, l'assistant IA intelligent d'Innov'Yed Solutions, une entreprise tech basée au Bénin. Tu es serviable, professionnel et amical. Tu parles toujours en français.

## CONNAISSANCES SUR INNOV'YED SOLUTIONS

### Services (10 domaines)
1. Service de Bureau - Gestion administrative, secrétariat, organisation
2. Support Technique - Dépannage informatique, support à distance et sur site
3. Réseaux et Sécurité - Installation réseaux, cybersécurité, pare-feu, audit sécurité
4. Optimisation et Récupération - Récupération de données, optimisation systèmes
5. Maintenance et Réparation - Réparation ordinateurs, maintenance préventive
6. Énergie et Accessoires - Ondules, batteries, accessoires informatiques
7. Création Web et Graphisme - Sites web, applications, identité visuelle, UI/UX
8. Formations et Mises à Jour - Formations certifiantes en informatique
9. Gaming, Logiciels & Multimédia - Développement de jeux, production vidéo
10. Systèmes Automatisés - Domotique, systèmes IoT, automatisation

### Formations (Académie)
- JavaScript de Zéro à Héros - 75 000 FCFA - 8 semaines
- Cybersécurité Essentielle - 95 000 FCFA - 10 semaines
- React & Next.js Maîtrise - 150 000 FCFA - 12 semaines
- Python pour Data Science - 85 000 FCFA - 8 semaines
- DevOps & Cloud Computing - 120 000 FCFA - 10 semaines

### Contact
- Téléphone : +229 01 92 72 83 64
- Email : innovyedsolutions@gmail.com
- WhatsApp : +229 92 72 83 64
- Adresse : Cotonou, Bénin
- Site : innovyed-solutions.com

### Prix indicatifs
- Devis gratuit pour tous les projets
- Formations : 75 000 - 150 000 FCFA
- Support technique : à partir de 15 000 FCFA/intervention
- Création site web : à partir de 150 000 FCFA

### Liens utiles
- Devis : /devis
- Contact : /contact
- Services : /services
- Académie : /academie
- Portfolio : /portfolio
- Espace client : /portail/auth

## COMPORTEMENT
- Sois concis mais complet (3-5 lignes max par réponse)
- Utilise des emojis avec modération
- Propose toujours une action concrète après avoir répondu
- Si tu ne sais pas, oriente vers un humain
- Détecte les émotions et adapter ton ton
- En cas de plainte, sois empathique et propose des solutions
- Tu peux poser des questions pour mieux comprendre le besoin
- Termine par une question ou une suggestion pour continuer la conversation`;

function getAIResponse(userMsg: string, history: { role: string; content: string }[]): string {
  const lower = userMsg.toLowerCase().trim();

  // Salutations
  if (/^(bonjour|salut|hello|hey|bonsoir|coucou|yo|bjr|bsr)/i.test(lower)) {
    const hour = new Date().getHours();
    const greeting = hour < 18 ? "Bonjour" : "Bonsoir";
    return `${greeting} ! 👋 Comment puis-je vous aider aujourd'hui ?\n\nJe peux vous renseigner sur nos services, formations, ou vous aider à obtenir un devis.`;
  }

  // Au revoir
  if (/^(au revoir|bye|à bientôt|merci|ciao|tchao)/i.test(lower)) {
    return "Merci pour votre visite ! 😊 N'hésitez pas à revenir si vous avez des questions. Bonne journée !";
  }

  // Services
  if (/service|offre|propose|que fait|domaine|expertise|spéciali/i.test(lower)) {
    if (/web|site|application|développement|création/i.test(lower)) {
      return "🚀 **Création Web & Graphisme**\n\nNous créons :\n• Sites vitrines et e-commerce\n• Applications web et mobiles\n• Identité visuelle et logo\n• UI/UX design\n\n💰 À partir de 150 000 FCFA\n\n👉 Voulez-vous un [devis gratuit](/devis) ?";
    }
    if (/sécurité|réseau|cyber|pare-feu|audit/i.test(lower)) {
      return "🛡️ **Réseaux & Sécurité**\n\nNous protégeons vos systèmes :\n• Audit de sécurité complet\n• Installation pare-feu et VPN\n• Cybersécurité et conformité\n• Monitoring 24/7\n\n💰 Devis personnalisé\n\n👉 [Contactez-nous](/contact) pour un audit gratuit.";
    }
    if (/formation|cours|académie|apprendre|certif/i.test(lower)) {
      return "🎓 **Académie Innov'Yed**\n\nNos formations phares :\n• JavaScript Zéro à Héros — 75 000 FCFA\n• Cybersécurité Essentielle — 95 000 FCFA\n• React & Next.js — 150 000 FCFA\n• Python Data Science — 85 000 FCFA\n\n👉 [Voir le catalogue](/academie)";
    }
    if (/maintenance|réparation|ordinateur|pc|fixe|portable/i.test(lower)) {
      return "🔧 **Maintenance & Réparation**\n\nNous réparons :\n• Ordinateurs fixes et portables\n• Écrans, claviers, composants\n• Maintenance préventive\n• Nettoyage et optimisation\n\n💰 À partir de 15 000 FCFA\n\n👉 [Créez un ticket](/portail/tickets) ou appelez le +229 01 92 72 83 64";
    }
    if (/énergie|ondule|batterie|alimentation/i.test(lower)) {
      return "🔋 **Énergie & Accessoires**\n\n• Onduleurs et batteries\n• Alimentations informatiques\n• Multiprises sécurisées\n• Conseils en autonomie électrique\n\n👉 [Découvrez nos produits](/boutique)";
    }
    if (/gaming|jeu|multimédia|vidéo|streaming/i.test(lower)) {
      return "🎮 **Gaming, Logiciels & Multimédia**\n\n• Configuration gaming sur mesure\n• Montage vidéo et production\n• Développement de jeux\n• Logiciels et licences\n\n👉 [Parlez-nous de votre projet](/devis)";
    }
    if (/automati|domotique|iot|système intelligent/i.test(lower)) {
      return "🤖 **Systèmes Automatisés**\n\n• Domotique et maison connectée\n• Systèmes IoT industriels\n• Automatisation de processus\n• Capteurs et contrôleurs\n\n👉 [Discutons de votre projet](/devis)";
    }
    if (/bureau|secrétariat|admin|organisation|gestion/i.test(lower)) {
      return "📋 **Service de Bureau**\n\n• Gestion administrative\n• Secrétariat délégué\n• Organisation d'événements\n• Support de direction\n\n👉 [Contactez-nous](/contact) pour en savoir plus.";
    }
    if (/support|aide|dépannage|assistance/i.test(lower)) {
      return "🎧 **Support Technique**\n\n• Assistance à distance\n• Intervention sur site\n• Dépannage urgent\n• Maintenance contractuelle\n\n📞 +229 01 92 72 83 64\n📧 innovyedsolutions@gmail.com\n\n👉 [Créez un ticket](/portail/tickets)";
    }
    if (/donnée|récupération|optimisation|sauvegarde/i.test(lower)) {
      return "⚡ **Optimisation & Récupération**\n\n• Récupération de données perdues\n• Optimisation de performance\n• Sauvegarde et restauration\n• Nettoyage système\n\n💰 Devis gratuit\n👉 [Demandez un devis](/devis)";
    }
    return "🚀 **Nos 10 services** :\n\n1. 📋 Bureau & Admin\n2. 🎧 Support Technique\n3. 🛡️ Réseaux & Sécurité\n4. ⚡ Optimisation & Récupération\n5. 🔧 Maintenance & Réparation\n6. 🔋 Énergie & Accessoires\n7. 🎨 Web & Graphisme\n8. 🎓 Formations\n9. 🎮 Gaming & Multimédia\n10. 🤖 Systèmes Automatisés\n\nQuel service vous intéresse ?";
  }

  // Devis
  if (/devis|prix|tarif|coût|combien|budget|estimation/i.test(lower)) {
    return "📋 **Demander un devis gratuit**\n\nC'est simple et rapide :\n1. Rendez-vous sur notre page devis\n2. Décrivez votre besoin\n3. Recevez une réponse sous 24h\n\n👉 [Formulaire de devis](/devis)\n\nOu décrivez-moi votre projet ici, je vous oriente vers la bonne solution !";
  }

  // Formations
  if (/formation|cours|académie|apprendre|certif|diplôme|écoler|study/i.test(lower)) {
    return "🎓 **Académie Innov'Yed**\n\nFormations disponibles :\n• **JavaScript** — 75 000 FCFA (8 sem)\n• **Cybersécurité** — 95 000 FCFA (10 sem)\n• **React & Next.js** — 150 000 FCFA (12 sem)\n• **Python Data** — 85 000 FCFA (8 sem)\n• **DevOps** — 120 000 FCFA (10 sem)\n\n✅ Certificat délivré\n✅ Projet pratique\n✅ Suivi personnalisé\n\n👉 [Voir le catalogue](/academie)";
  }

  // Support / problème
  if (/problème|bug|erreur|panne|ne fonctionne|cassé|planté|bloqué/i.test(lower)) {
    return "🛠️ **Je suis là pour vous aider !**\n\nPour résoudre votre problème :\n\n1. **Créez un ticket** — un technicien vous répond sous 4h\n2. **Appelez-nous** — +229 01 92 72 83 64 (urgence)\n3. **Email** — innovyedsolutions@gmail.com\n\n👉 [Créer un ticket](/portail/tickets)\n\nDécrivez-moi votre problème et je vous guide !";
  }

  // Contact
  if (/contact|téléphone|email|adresse|appeler|écrire|joindre/i.test(lower)) {
    return "📞 **Contactez-nous**\n\n• 📱 +229 01 92 72 83 64\n• 📧 innovyedsolutions@gmail.com\n• 📍 Cotonou, Bénin\n• 🌐 innovyed-solutions.com\n\n⏰ Lun-Sam : 8h-18h\n\n👉 [Formulaire de contact](/contact)";
  }

  // Portfolio / réalisations
  if (/portfolio|réalisation|projet|exemple|client|avis/i.test(lower)) {
    return "📂 **Nos Réalisations**\n\nDécouvrez les projets que nous avons réalisés pour nos clients :\n• Sites web et applications\n• Systèmes de sécurité\n• Formations sur mesure\n\n👉 [Voir le portfolio](/portfolio)";
  }

  // Boutique
  if (/boutique|acheter|produit|magasin|commander|shop/i.test(lower)) {
    return "🛒 **Boutique Innov'Yed**\n\nRetrouvez nos produits et accessoires :\n• Onduleurs et batteries\n• Accessoires informatiques\n• Logiciels et licences\n\n👉 [Visiter la boutique](/boutique)";
  }

  // Espace client
  if (/espace client|portail|compte|connexion|login|inscription/i.test(lower)) {
    return "👤 **Espace Client**\n\nAccédez à votre tableau de bord pour :\n• Suivre vos projets\n• Gérer vos tickets\n• Consulter vos factures\n• Accéder aux formations\n\n👉 [Se connecter](/portail/auth)\n👉 [Créer un compte](/portail/auth)";
  }

  // Remerciement
  if (/merci|thanks|remerci|parfait|génial|super|excellent|bravo/i.test(lower)) {
    return "Avec plaisir ! 😊 N'hésitez pas si vous avez d'autres questions. Je suis toujours là pour vous aider !";
  }

  // Plainte / mécontentement
  if (/mécontent|insatisfait|plainte|mauvais|nul|arnaque|furieux|énervé|problème de service/i.test(lower)) {
    return "😔 Je comprends votre frustration et je m'en excuse.\n\nNous prenons très au sérieux votre retour. Pour une résolution rapide :\n\n1. 📞 Appelez le +229 01 92 72 83 64\n2. 📧 Email : innovyedsolutions@gmail.com\n3. 💬 [Créez un ticket prioritaire](/portail/tickets)\n\nUn responsable vous contactera sous 2h.";
  }

  // Qui es-tu
  if (/qui es-tu|tu es|ton nom|tu fais quoi|présentation/i.test(lower)) {
    return "Je suis **Innov'Bot** 🤖, l'assistant virtuel d'Innov'Yed Solutions.\n\nJe peux vous aider avec :\n• Nos services et prestations\n• Nos formations certifiantes\n• L'obtention d'un devis\n• Le support technique\n• Toute question sur notre entreprise\n\nComment puis-je vous aider ?";
  }

  // Merci / fin
  if (/ok|d'accord|noté|compris|entendu/i.test(lower)) {
    return "Parfait ! 👍 N'hésitez pas si vous avez d'autres questions.";
  }

  // Date/heure
  if (/heure|date|jour|aujourd'hui|temps/i.test(lower)) {
    const now = new Date();
    return `Nous sommes le ${now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} et il est ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.\n\nComment puis-je vous aider ?`;
  }

  // Budget / conseil
  if (/conseil|recommand|quel choix|que choisir|meilleur|idee/i.test(lower)) {
    return "💡 **Je peux vous conseiller !**\n\nPour vous orienter au mieux, dites-moi :\n1. Quel est votre besoin principal ?\n2. Quel est votre budget indicatif ?\n3. Quel est votre délai souhaité ?\n\nJe vous recommanderai la meilleure solution !";
  }

  // Default intelligent
  const contextHint = history.length > 2 ? "\n\nVous pouvez me demander des informations sur nos services, formations, ou demander un devis." : "";
  return `Merci pour votre message ! 😊\n\nJe suis Innov'Bot et je peux vous aider avec :\n• 🚀 Nos **services** (10 domaines)\n• 🎓 Nos **formations** certifiantes\n• 📋 Demander un **devis** gratuit\n• 🛠️ **Support** technique\n• 📞 **Contact** et coordonnées\n\nQue souhaitez-vous savoir ?${contextHint}`;
}

let msgId = 0;

export default function InnovBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Bonjour ! 👋 Je suis **Innov'Bot**, votre assistant Innov'Yed Solutions.\n\nComment puis-je vous aider ?", id: 0 },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const pendingReply = useRef("");

  const send = useCallback((text: string) => {
    if (!text.trim()) return;
    pendingReply.current = text;
    const userMsg: Msg = { role: "user", text, id: ++msgId };
    setMessages((m) => [...m, userMsg]);
    setHistory((h) => [...h, { role: "user", content: text }]);
    setInput("");
    setTyping(true);
  }, []);

  useEffect(() => {
    if (!typing) return;
    const t = pendingReply.current;
    const delay = 600 + Math.random() * 800;
    const timer = setTimeout(() => {
      const response = getAIResponse(t, history);
      const botMsg: Msg = { role: "bot", text: response, id: ++msgId };
      setMessages((m) => [...m, botMsg]);
      setHistory((h) => [...h, { role: "assistant", content: response }]);
      setTyping(false);
    }, delay);
    return () => clearTimeout(timer);
  }, [typing]);

  const resetChat = () => {
    setMessages([{ role: "bot", text: "Nouvelle conversation ! 👋\n\nComment puis-je vous aider ?", id: ++msgId }]);
    setHistory([]);
  };

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 group">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 ${open ? "bg-white/[0.08] rotate-0" : "bg-gradient-to-br from-cyan to-violet shadow-lg shadow-cyan/30 hover:shadow-cyan/50 hover:scale-110 animate-pulse-glow"}`}>
          {open ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
        </div>
        {!open && (
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green border-2 border-[#0B1120]">
            <div className="absolute inset-0 rounded-full bg-green animate-ping opacity-50" />
          </div>
        )}
      </button>

      {/* Tooltip */}
      {!open && (
        <div className="fixed bottom-24 right-6 z-50 glass rounded-2xl px-4 py-3 shadow-xl border border-white/[0.08] max-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan" />
            <span className="text-xs font-semibold text-white">Innov'Bot</span>
          </div>
          <p className="text-[11px] text-white/50 leading-relaxed">Besoin d&apos;aide ? Posez-moi une question !</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 rotate-45 glass border-r border-b border-white/[0.08]" />
        </div>
      )}

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[75vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col bg-[#0B1120] border border-white/[0.08]">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-cyan/[0.08] via-violet/[0.05] to-blue-500/[0.08] border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan to-violet flex items-center justify-center shadow-lg shadow-cyan/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green border-2 border-[#0B1120]" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Innov&apos;Bot</h3>
                <p className="text-[11px] text-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" /> En ligne
                </p>
              </div>
            </div>
            <button onClick={resetChat} className="p-2 rounded-xl hover:bg-white/[0.06] transition-colors" title="Nouvelle conversation">
              <RotateCcw className="w-4 h-4 text-white/40 hover:text-white/70 transition-colors" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan to-violet flex-shrink-0 flex items-center justify-center mt-1 shadow-md shadow-cyan/10">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-cyan to-violet text-white rounded-br-md"
                    : "bg-white/[0.05] text-white/80 rounded-bl-md border border-white/[0.04]"
                }`}>
                  {msg.text.split("\n").map((line, j) => (
                    <p key={j} className={j > 0 ? "mt-1" : ""}>{line}</p>
                  ))}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-xl bg-white/[0.06] flex-shrink-0 flex items-center justify-center mt-1">
                    <User className="w-3.5 h-3.5 text-white/50" />
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan to-violet flex-shrink-0 flex items-center justify-center shadow-md shadow-cyan/10">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/[0.05] border border-white/[0.04]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-cyan/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 rounded-full bg-violet/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 rounded-full bg-blue-500/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {["🚀 Services", "📋 Devis", "🎓 Formations", "🛠️ Support"].map((q) => (
                <button key={q} onClick={() => send(q)}
                  className="text-[11px] px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-cyan/30 transition-all">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-white/[0.06] flex gap-2 items-center">
            <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Posez votre question..."
              className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 text-[13px] outline-none placeholder:text-white/25 text-white focus:border-cyan/30 transition-colors" />
            <button onClick={() => send(input)}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan to-violet text-white hover:shadow-lg hover:shadow-cyan/20 transition-all disabled:opacity-30 disabled:hover:shadow-none active:scale-95"
              disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

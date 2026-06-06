"use client"

type User = {
  id: string
  email?: string
}

type Shop = {
  id: number
  nom: string
  categorie: string
  ville: string
  description: string
  tags: string
}

type Props = {
  user: User | null
  shops: Shop[]
  onConnexion: () => void
  onDeconnexion: () => void
}

export default function Profil({ user, shops, onConnexion, onDeconnexion }: Props) {
  const emojis: { [key: string]: string } = {
    "Maroquinerie": "👜", "Menuiserie": "🪵", "Céramique": "🏺",
    "Alimentaire": "🍞", "Bijouterie": "💎", "Bien-être": "🕯️",
    "Textile": "🧵"
  }

  // Boutiques de l'utilisateur connecté — pour l'instant toutes les boutiques
  // Plus tard on filtrera par user_id
  const mesBoutiques = shops.slice(0, 3)

  if (!user) {
    return (
      <div style={{ paddingBottom: "80px" }}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "40px 20px",
          textAlign: "center", border: "0.5px solid #E8E0D8", marginBottom: "16px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>👤</div>
          <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
            Rejoins Artisphère
          </h2>
          <p style={{ fontSize: "14px", color: "#888", marginBottom: "24px", lineHeight: "1.5" }}>
            Connecte-toi pour gérer ta boutique, publier tes produits et booster ta visibilité.
          </p>
          <button
            onClick={onConnexion}
            style={{
              padding: "12px 32px", borderRadius: "20px", border: "none",
              background: "#B5540A", color: "white", fontSize: "15px",
              fontWeight: "500", cursor: "pointer", width: "100%"
            }}
          >
            Se connecter / S'inscrire
          </button>
        </div>

        <div style={{
          background: "white", borderRadius: "16px", padding: "16px",
          border: "0.5px solid #E8E0D8"
        }}>
          <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
            Pourquoi rejoindre ?
          </h3>
          {[
            { emoji: "🏪", texte: "Crée ta vitrine en ligne gratuitement" },
            { emoji: "🔍", texte: "Sois trouvé par des clients locaux" },
            { emoji: "⚡", texte: "Booste tes publications pour plus de visibilité" },
            { emoji: "💬", texte: "Échange directement avec tes clients" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "8px 0", borderBottom: i < 3 ? "0.5px solid #F0EAE2" : "none"
            }}>
              <span style={{ fontSize: "20px" }}>{item.emoji}</span>
              <span style={{ fontSize: "13px", color: "#555" }}>{item.texte}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: "80px" }}>

      {/* Header profil */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "20px",
        border: "0.5px solid #E8E0D8", marginBottom: "12px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "50%",
            background: "#FEF3E8", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "28px",
            border: "2px solid #E8A058", flexShrink: 0
          }}>
            🏪
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "16px", fontWeight: "600", color: "#1a1a1a" }}>
              Mon compte
            </div>
            <div style={{ fontSize: "13px", color: "#B5540A", marginTop: "2px" }}>
              {user.email}
            </div>
            <div style={{ fontSize: "12px", color: "#aaa", marginTop: "2px" }}>
              Artisan · Membre depuis 2026
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", justifyContent: "space-around", paddingTop: "16px", borderTop: "0.5px solid #F0EAE2" }}>
          {[
            { val: shops.length, lbl: "Boutiques" },
            { val: "0", lbl: "Abonnés" },
            { val: "★ 4.9", lbl: "Note" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "18px", fontWeight: "600", color: "#1a1a1a" }}>{s.val}</div>
              <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px" }}>{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mes boutiques */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "16px",
        border: "0.5px solid #E8E0D8", marginBottom: "12px"
      }}>
        <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
          Mes boutiques
        </h3>
        {mesBoutiques.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#aaa", textAlign: "center", padding: "16px 0" }}>
            Aucune boutique — crée la tienne !
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {mesBoutiques.map(shop => (
              <div key={shop.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "8px", background: "#F8F5F2", borderRadius: "10px"
              }}>
                <div style={{
                  width: "36px", height: "36px", borderRadius: "50%",
                  background: "#FEF3E8", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "18px", flexShrink: 0
                }}>
                  {emojis[shop.categorie] || "🏪"}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500" }}>{shop.nom}</div>
                  <div style={{ fontSize: "11px", color: "#B5540A" }}>{shop.categorie} · {shop.ville}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paramètres */}
      <div style={{
        background: "white", borderRadius: "16px",
        border: "0.5px solid #E8E0D8", overflow: "hidden"
      }}>
        {[
          { emoji: "⚡", label: "Booster une boutique" },
          { emoji: "🔔", label: "Notifications" },
          { emoji: "🔒", label: "Confidentialité" },
          { emoji: "❓", label: "Aide" },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "14px 16px",
            borderBottom: i < arr.length - 1 ? "0.5px solid #F0EAE2" : "none",
            cursor: "pointer"
          }}>
            <span style={{ fontSize: "18px" }}>{item.emoji}</span>
            <span style={{ fontSize: "14px", color: "#333", flex: 1 }}>{item.label}</span>
            <span style={{ color: "#ccc" }}>→</span>
          </div>
        ))}

        {/* Déconnexion */}
        <div
          onClick={onDeconnexion}
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "14px 16px", cursor: "pointer",
            borderTop: "0.5px solid #F0EAE2"
          }}
        >
          <span style={{ fontSize: "18px" }}>🚪</span>
          <span style={{ fontSize: "14px", color: "#E24B4A", flex: 1 }}>Se déconnecter</span>
        </div>
      </div>

    </div>
  )
}
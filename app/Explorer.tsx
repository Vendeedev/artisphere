"use client"
import { useState } from "react"

type Shop = {
  id: number
  nom: string
  categorie: string
  ville: string
  description: string
  tags: string
}

type Props = {
  onFiltreHashtag: (tag: string) => void
  shops: Shop[]
}

export default function Explorer({ onFiltreHashtag, shops }: Props) {
  const [recherche, setRecherche] = useState("")

  const categories = [
    { emoji: "🧵", nom: "Maroquinerie", tag: "maroquinerie" },
    { emoji: "🪵", nom: "Menuiserie", tag: "menuiserie" },
    { emoji: "🏺", nom: "Céramique", tag: "poterie" },
    { emoji: "🍞", nom: "Alimentaire", tag: "painBio" },
    { emoji: "💎", nom: "Bijouterie", tag: "bijouterie" },
    { emoji: "🕯️", nom: "Bien-être", tag: "bougieNaturelle" },
    { emoji: "🧶", nom: "Textile", tag: "tissage" },
    { emoji: "🖼️", nom: "Art", tag: "art" },
    { emoji: "🌿", nom: "Plantes", tag: "plantes" },
    { emoji: "🪴", nom: "Déco", tag: "deco" },
  ]

  const tendances = [
    { tag: "maroquinerie", count: "12 400" },
    { tag: "MadeInFrance", count: "9 800" },
    { tag: "bougieNaturelle", count: "7 200" },
    { tag: "menuiserie", count: "4 100" },
    { tag: "poterie", count: "3 600" },
  ]

  // Résultats de recherche — filtre sur nom, categorie, ville, tags
  const resultats = recherche.length > 1
    ? shops.filter(s =>
        s.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        s.categorie.toLowerCase().includes(recherche.toLowerCase()) ||
        s.ville.toLowerCase().includes(recherche.toLowerCase()) ||
        (s.tags && s.tags.toLowerCase().includes(recherche.toLowerCase()))
      )
    : []

  return (
    <div style={{ paddingBottom: "80px" }}>

      {/* Barre de recherche */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "white", border: "0.5px solid #E8E0D8",
        borderRadius: "12px", padding: "10px 14px", marginBottom: "20px"
      }}>
        <span style={{ fontSize: "16px" }}>🔍</span>
        <input
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="Artisans, produits, ville…"
          style={{
            border: "none", outline: "none", fontSize: "14px",
            color: "#333", background: "transparent", width: "100%"
          }}
        />
        {recherche && (
          <span
            onClick={() => setRecherche("")}
            style={{ fontSize: "16px", color: "#aaa", cursor: "pointer" }}
          >
            ✕
          </span>
        )}
      </div>

      {/* Résultats de recherche */}
      {recherche.length > 1 && (
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "10px", color: "#888" }}>
            {resultats.length} résultat{resultats.length > 1 ? "s" : ""} pour "{recherche}"
          </h2>
          {resultats.length === 0 ? (
            <div style={{
              background: "white", borderRadius: "12px", padding: "20px",
              textAlign: "center", color: "#aaa", fontSize: "14px",
              border: "0.5px solid #E8E0D8"
            }}>
              Aucune boutique trouvée 😕
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {resultats.map(shop => (
                <div
                  key={shop.id}
                  onClick={() => onFiltreHashtag(shop.categorie.toLowerCase())}
                  style={{
                    background: "white", borderRadius: "12px", padding: "12px 16px",
                    border: "0.5px solid #E8E0D8", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "12px"
                  }}
                >
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "50%",
                    background: "#FEF3E8", display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "20px", flexShrink: 0
                  }}>
                    🏪
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "500", color: "#1a1a1a" }}>{shop.nom}</div>
                    <div style={{ fontSize: "12px", color: "#B5540A" }}>{shop.categorie} · {shop.ville}</div>
                  </div>
                  <span style={{ fontSize: "16px", color: "#ccc" }}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Catégories — cachées pendant la recherche */}
      {!recherche && (
        <>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a1a" }}>
              Catégories
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {categories.map(cat => (
                <div
                  key={cat.tag}
                  onClick={() => onFiltreHashtag(cat.tag)}
                  style={{
                    background: "white", border: "0.5px solid #E8E0D8",
                    borderRadius: "12px", padding: "16px",
                    display: "flex", alignItems: "center", gap: "12px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{ fontSize: "28px" }}>{cat.emoji}</span>
                  <span style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>{cat.nom}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "15px", fontWeight: "600", marginBottom: "12px", color: "#1a1a1a" }}>
              Tendances du moment
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {tendances.map((t, i) => (
                <div
                  key={t.tag}
                  onClick={() => onFiltreHashtag(t.tag)}
                  style={{
                    background: "white", border: "0.5px solid #E8E0D8",
                    borderRadius: "12px", padding: "12px 16px",
                    display: "flex", alignItems: "center", gap: "12px",
                    cursor: "pointer"
                  }}
                >
                  <span style={{
                    width: "24px", height: "24px", borderRadius: "50%",
                    background: i === 0 ? "#B5540A" : "#F0EAE2",
                    color: i === 0 ? "white" : "#888",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: "600", flexShrink: 0
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "#333" }}>#{t.tag}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{t.count} publications</div>
                  </div>
                  <span style={{ fontSize: "16px", color: "#B5540A" }}>→</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  )
}
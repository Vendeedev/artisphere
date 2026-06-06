"use client"

type Shop = {
  id: number
  nom: string
  categorie: string
}

type Props = {
  shops: Shop[]
}

export default function Stories({ shops }: Props) {
  const emojis: { [key: string]: string } = {
    "Maroquinerie": "👜", "Menuiserie": "🪵", "Céramique": "🏺",
    "Alimentaire": "🍞", "Bijouterie": "💎", "Bien-être": "🕯️",
    "Textile": "🧵"
  }

  return (
    <div style={{
      display: "flex",
      gap: "12px",
      overflowX: "auto",
      paddingBottom: "12px",
      marginBottom: "16px",
      scrollbarWidth: "none",
    }}>
      {/* Bouton ajouter story */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", flexShrink: 0 }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "#F0EAE2", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "24px",
          border: "2px dashed #B5540A", cursor: "pointer", color: "#B5540A", fontWeight: "300"
        }}>
          +
        </div>
        <span style={{ fontSize: "10px", color: "#888", width: "60px", textAlign: "center" }}>
          Ma story
        </span>
      </div>

      {/* Stories des boutiques */}
      {shops.slice(0, 10).map(shop => (
        <div key={shop.id} style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", gap: "5px", flexShrink: 0, cursor: "pointer"
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%", padding: "2px",
            background: "linear-gradient(45deg, #B5540A, #E8A058)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              width: "50px", height: "50px", borderRadius: "50%",
              background: "#FEF3E8", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "22px", border: "2px solid white"
            }}>
              {emojis[shop.categorie] || "🏪"}
            </div>
          </div>
          <span style={{
            fontSize: "10px", color: "#555", width: "60px", textAlign: "center",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
          }}>
            {shop.nom.split(" ")[0]}
          </span>
        </div>
      ))}
    </div>
  )
}
type Props = {
  vue: string
  onNavigate: (vue: "feed" | "explorer" | "ajouter" | "profil") => void
  connecte: boolean
}

export default function Navbar({ vue, onNavigate, connecte }: Props) {
  const boutons = [
    { id: "feed", emoji: "🏠", label: "Accueil" },
    { id: "explorer", emoji: "🔍", label: "Explorer" },
    { id: "ajouter", emoji: "➕", label: "Publier" },
    { id: "profil", emoji: "👤", label: "Profil" },
  ]

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "white", borderTop: "0.5px solid #E8E0D8",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "10px 0 20px", zIndex: 100,
      maxWidth: "480px", margin: "0 auto"
    }}>
      {boutons.map(btn => (
        <button
          key={btn.id}
          onClick={() => {
            if (btn.id === "ajouter" && !connecte) {
              onNavigate("profil")
            } else {
              onNavigate(btn.id as "feed" | "explorer" | "ajouter" | "profil")
            }
          }}
          style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "3px", background: "none", border: "none", cursor: "pointer",
            padding: "4px 16px"
          }}
        >
          <span style={{ fontSize: "22px", opacity: vue === btn.id ? 1 : 0.4 }}>
            {btn.emoji}
          </span>
          <span style={{
            fontSize: "10px", fontWeight: vue === btn.id ? "600" : "400",
            color: vue === btn.id ? "#B5540A" : "#888"
          }}>
            {btn.label}
          </span>
          {vue === btn.id && (
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#B5540A", marginTop: "1px"
            }} />
          )}
        </button>
      ))}
    </div>
  )
}
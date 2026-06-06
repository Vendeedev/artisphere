type Props = {
  boutique_nom: string
  description: string
}

export default function Annonce({ boutique_nom, description }: Props) {
  return (
    <div style={{
      background: "#FEF3E8",
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid #E8A058",
      padding: "14px 16px",
      position: "relative"
    }}>
      <span style={{
        position: "absolute", top: "12px", right: "12px",
        fontSize: "10px", fontWeight: "600", color: "#854F0B",
        background: "#FAEEDA", padding: "3px 8px", borderRadius: "20px",
        border: "0.5px solid #EF9F27", letterSpacing: "0.03em"
      }}>
        ✦ Mis en avant
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "#FAEEDA", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "18px",
          border: "1.5px solid #EF9F27"
        }}>
          🏪
        </div>
        <div>
          <div style={{ fontSize: "14px", fontWeight: "600", color: "#633806" }}>{boutique_nom}</div>
          <div style={{ fontSize: "11px", color: "#854F0B" }}>Boutique sponsorisée</div>
        </div>
      </div>

      <p style={{ fontSize: "13px", color: "#633806", lineHeight: "1.5" }}>
        {description}
      </p>

      <button style={{
        marginTop: "10px", padding: "7px 16px", borderRadius: "20px",
        border: "none", background: "#B5540A", color: "white",
        fontSize: "12px", fontWeight: "500", cursor: "pointer"
      }}>
        Voir la boutique →
      </button>
    </div>
  )
}
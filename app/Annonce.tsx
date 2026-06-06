type Props = {
  boutique_nom: string
  description: string
}

export default function Annonce({ boutique_nom, description }: Props) {
  return (
    <div style={{
      border: "1px solid #E8A058",
      borderRadius: "12px",
      padding: "16px",
      background: "#FEF3E8",
      position: "relative"
    }}>
      <span style={{
        position: "absolute", top: "10px", right: "12px",
        fontSize: "10px", fontWeight: "500", color: "#854F0B",
        background: "#FAEEDA", padding: "2px 8px", borderRadius: "20px",
        border: "1px solid #EF9F27"
      }}>
        Mis en avant
      </span>
      <div style={{ fontSize: "15px", fontWeight: "500", color: "#333", marginBottom: "4px" }}>
        {boutique_nom}
      </div>
      <div style={{ fontSize: "13px", color: "#666" }}>
        {description}
      </div>
    </div>
  )
}
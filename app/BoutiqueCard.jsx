"use client"
import { useState } from "react"

export default function BoutiqueCard({ nom, categorie, ville, description }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)
  const [suivi, setSuivi] = useState(false)

  const emojis = {
    "Maroquinerie": "👜", "Menuiserie": "🪵", "Céramique": "🏺",
    "Alimentaire": "🍞", "Bijouterie": "💎", "Bien-être": "🕯️",
    "Textile": "🧵"
  }
  const emoji = emojis[categorie] || "🏪"

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      overflow: "hidden",
      border: "0.5px solid #E8E0D8",
    }}>
      {/* Image placeholder */}
      <div style={{
        height: "180px",
        background: "#F0EAE2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "64px"
      }}>
        {emoji}
      </div>

      {/* Contenu */}
      <div style={{ padding: "14px 16px" }}>

        {/* Header boutique */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "#FEF3E8", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "18px", flexShrink: 0,
            border: "1.5px solid #E8A058"
          }}>
            {emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#1a1a1a" }}>{nom}</div>
            <div style={{ fontSize: "12px", color: "#B5540A" }}>{categorie} · {ville}</div>
          </div>
          <button
            onClick={() => setSuivi(!suivi)}
            style={{
              padding: "5px 14px", borderRadius: "20px", fontSize: "12px",
              fontWeight: "500", cursor: "pointer",
              border: suivi ? "1px solid #E8E0D8" : "1px solid #B5540A",
              background: suivi ? "#F8F5F2" : "#B5540A",
              color: suivi ? "#888" : "white"
            }}
          >
            {suivi ? "Suivi ✓" : "+ Suivre"}
          </button>
        </div>

        {/* Description */}
        <p style={{ fontSize: "13px", color: "#555", lineHeight: "1.5", marginBottom: "12px" }}>
          {description}
        </p>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", paddingTop: "10px", borderTop: "0.5px solid #F0EAE2" }}>
          <button
            onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1) }}
            style={{ background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "5px",
              fontSize: "13px", color: liked ? "#E24B4A" : "#888" }}
          >
            <span style={{ fontSize: "18px" }}>{liked ? "❤️" : "🤍"}</span>
            {likes > 0 && likes}
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", color: "#888", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "18px" }}>💬</span>
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer",
            fontSize: "13px", color: "#888", display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "18px" }}>📤</span>
          </button>
          <button style={{ marginLeft: "auto", background: "none", border: "none",
            cursor: "pointer", fontSize: "18px" }}>
            🔖
          </button>
        </div>

      </div>
    </div>
  )
}
"use client"
import { useState } from "react"

type Props = {
  boutique_nom: string
  categorie: string
  description: string
  photo_url: string
  type_media?: string
  tags?: string
}

export default function PostCard({ boutique_nom, categorie, description, photo_url, type_media, tags }: Props) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(0)
  const [suivi, setSuivi] = useState(false)

  const emojis: { [key: string]: string } = {
    "Maroquinerie": "👜", "Menuiserie": "🪵", "Céramique": "🏺",
    "Alimentaire": "🍞", "Bijouterie": "💎", "Bien-être": "🕯️",
    "Textile": "🧶"
  }

  return (
    <div style={{
      background: "white", borderRadius: "16px",
      overflow: "hidden", border: "0.5px solid #E8E0D8"
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 14px" }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "50%",
          background: "#FEF3E8", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "18px", flexShrink: 0,
          border: "1.5px solid #E8A058"
        }}>
          {emojis[categorie] || "🏪"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "14px", fontWeight: "600" }}>{boutique_nom}</div>
          <div style={{ fontSize: "12px", color: "#B5540A" }}>{categorie}</div>
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

      {/* Media */}
      {type_media === "video" ? (
        <video
          src={photo_url}
          controls
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
      ) : (
        <img
          src={photo_url}
          alt={description}
          style={{ width: "100%", maxHeight: "400px", objectFit: "cover" }}
        />
      )}

      {/* Actions */}
      <div style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px",
          paddingBottom: "10px", borderBottom: "0.5px solid #F0EAE2" }}>
          <button
            onClick={() => { setLiked(!liked); setLikes(liked ? likes - 1 : likes + 1) }}
            style={{ background: "none", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", gap: "5px",
              fontSize: "13px", color: liked ? "#E24B4A" : "#888" }}
          >
            <span style={{ fontSize: "20px" }}>{liked ? "❤️" : "🤍"}</span>
            {likes > 0 && likes}
          </button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>💬</button>
          <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>📤</button>
          <button style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: "20px" }}>🔖</button>
        </div>

        {/* Description */}
        <p style={{ fontSize: "13px", color: "#333", lineHeight: "1.5", margin: "8px 0" }}>
          <strong style={{ fontWeight: "600" }}>{boutique_nom}</strong> {description}
        </p>

        {/* Hashtags */}
        {tags && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "6px" }}>
            {tags.split(",").map((tag, i) => tag.trim() && (
              <span key={i} style={{
                fontSize: "12px", color: "#B5540A", cursor: "pointer"
              }}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
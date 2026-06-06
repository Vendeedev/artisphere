"use client"
import { useState } from "react"

function BoutiqueCard({ nom, categorie, ville, description }) {
  const [likes, setLikes] = useState(0)
  const [liked, setLiked] = useState(false)

  function handleLike() {
    if (liked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setLiked(!liked)
  }

  return (
    <div style={{ border: "1px solid #eee", padding: "16px", borderRadius: "12px" }}>
      <h2>{nom}</h2>
      <p style={{ color: "#B5540A" }}>{categorie} · {ville}</p>
      <p>{description}</p>
      <button onClick={handleLike} style={{ fontSize: "20px", background: "none", border: "none", cursor: "pointer" }}>
        {liked ? "❤️" : "🤍"}
      </button>
      <span style={{ fontSize: "13px", color: "#888" }}>{likes} j'aime</span>
    </div>
  )
}

export default BoutiqueCard
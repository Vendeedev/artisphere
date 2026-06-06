"use client"
import { useState } from "react"
import { supabase } from "./supabase"
import Upload from "./Upload"

type Props = {
  userId: string
  boutique_nom: string
  onStoryPubliee: () => void
}

export default function NouvelleStory({ userId, boutique_nom, onStoryPubliee }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [chargement, setChargement] = useState(false)

  async function publier() {
    if (!photoUrl) { setMessage("Ajoute une photo ou vidéo !"); return }

    setChargement(true)

    // Expire dans 24h
    const expireAt = new Date()
    expireAt.setHours(expireAt.getHours() + 24)

    const { error } = await supabase
      .from("stories")
      .insert([{
        user_id: userId,
        boutique_nom,
        photo_url: photoUrl,
        expire_at: expireAt.toISOString()
      }])

    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setMessage("Story publiée ! Visible 24h ✓")
      setTimeout(() => onStoryPubliee(), 1000)
    }
    setChargement(false)
  }

  return (
    <div style={{ paddingBottom: "80px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "6px" }}>
        Nouvelle story
      </h2>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
        Visible pendant 24h · Photo ou vidéo max 30s
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <Upload
          onUploadTermine={(url) => setPhotoUrl(url)}
          label="Ajouter une photo ou vidéo courte"
        />

        <button
          onClick={publier}
          disabled={chargement || !photoUrl}
          style={{
            padding: "14px", borderRadius: "12px", border: "none",
            background: chargement || !photoUrl ? "#ccc" : "#B5540A",
            color: "white", fontSize: "15px", fontWeight: "600",
            cursor: chargement || !photoUrl ? "not-allowed" : "pointer"
          }}
        >
          {chargement ? "Publication..." : "Publier la story 🎬"}
        </button>

        {message && (
          <p style={{ textAlign: "center", fontSize: "14px",
            color: message.includes("publiée") ? "#085041" : "#A32D2D" }}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
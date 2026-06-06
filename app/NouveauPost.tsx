"use client"
import { useState } from "react"
import { supabase } from "./supabase"
import Upload from "./Upload"

type Props = {
  userId: string
  userEmail: string
  onPostPublie: () => void
}

export default function NouveauPost({ userId, userEmail, onPostPublie }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [typeMedia, setTypeMedia] = useState<"image" | "video" | null>(null)
  const [boutique_nom, setBoutiqueNom] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [categorie, setCategorie] = useState("")
  const [message, setMessage] = useState("")
  const [chargement, setChargement] = useState(false)

  async function publier() {
    if (!photoUrl) { setMessage("Ajoute une photo ou vidéo !"); return }
    if (!boutique_nom) { setMessage("Indique le nom de ta boutique !"); return }
    if (!description) { setMessage("Ajoute une description !"); return }

    setChargement(true)

    const { error } = await supabase
      .from("posts")
      .insert([{
        user_id: userId,
        boutique_nom,
        description,
        tags,
        photo_url: photoUrl,
        categorie,
        type_media: typeMedia
      }])

    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setMessage("Post publié !")
      setPhotoUrl(null)
      setBoutiqueNom("")
      setDescription("")
      setTags("")
      setCategorie("")
      setTimeout(() => onPostPublie(), 1000)
    }
    setChargement(false)
  }

  return (
    <div style={{ paddingBottom: "80px" }}>
      <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
        Nouveau post
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Upload photo/vidéo */}
        <Upload
          onUploadTermine={(url, type) => { setPhotoUrl(url); setTypeMedia(type) }}
          label="Ajouter une photo ou vidéo produit"
        />

        {/* Nom boutique */}
        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>
            Nom de ta boutique
          </label>
          <input
            value={boutique_nom}
            onChange={e => setBoutiqueNom(e.target.value)}
            placeholder="Ex : Marie Couture"
            style={{ width: "100%", padding: "10px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        {/* Catégorie */}
        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>
            Catégorie
          </label>
          <select
            value={categorie}
            onChange={e => setCategorie(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "14px",
              background: "#f9f9f9", color: "#333" }}
          >
            <option value="">-- Choisir --</option>
            <option value="Maroquinerie">🧵 Maroquinerie</option>
            <option value="Menuiserie">🪵 Menuiserie</option>
            <option value="Céramique">🏺 Céramique</option>
            <option value="Alimentaire">🍞 Alimentaire</option>
            <option value="Bijouterie">💎 Bijouterie</option>
            <option value="Bien-être">🕯️ Bien-être</option>
            <option value="Textile">🧶 Textile</option>
            <option value="Autre">✏️ Autre</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Décris ton produit, son histoire, son prix..."
            rows={4}
            style={{ width: "100%", padding: "10px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "14px", resize: "vertical" }}
          />
          <div style={{ fontSize: "11px", color: "#aaa", textAlign: "right", marginTop: "2px" }}>
            {description.length} caractères
          </div>
        </div>

        {/* Hashtags */}
        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>
            Hashtags <span style={{ color: "#bbb" }}>(séparés par des virgules)</span>
          </label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Ex : maroquinerie,cuir,Lyon,faitMain"
            style={{ width: "100%", padding: "10px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "14px" }}
          />
          {/* Aperçu des tags */}
          {tags && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "8px" }}>
              {tags.split(",").map((tag, i) => tag.trim() && (
                <span key={i} style={{
                  padding: "3px 8px", borderRadius: "20px",
                  background: "#EEEDFE", color: "#3C3489", fontSize: "11px"
                }}>
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bouton publier */}
        <button
          onClick={publier}
          disabled={chargement}
          style={{
            padding: "14px", borderRadius: "12px", border: "none",
            background: chargement ? "#ccc" : "#B5540A",
            color: "white", fontSize: "15px", fontWeight: "600",
            cursor: chargement ? "not-allowed" : "pointer", marginTop: "4px"
          }}
        >
          {chargement ? "Publication..." : "Publier le post 🚀"}
        </button>

        {message && (
          <p style={{ textAlign: "center", fontSize: "14px",
            color: message.includes("publié") ? "#085041" : "#A32D2D" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  )
}
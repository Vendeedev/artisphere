"use client"
import { useState } from "react"
import { supabase } from "./supabase"

type Props = {
  onUploadTermine: (url: string, type: "image" | "video") => void
  label?: string
}

export default function Upload({ onUploadTermine, label = "Ajouter une photo ou vidéo" }: Props) {
  const [chargement, setChargement] = useState(false)
  const [apercu, setApercu] = useState<string | null>(null)
  const [typeMedia, setTypeMedia] = useState<"image" | "video" | null>(null)

  async function handleFichier(e: React.ChangeEvent<HTMLInputElement>) {
    const fichier = e.target.files?.[0]
    if (!fichier) return

    // Vérification taille max 50MB
    if (fichier.size > 50 * 1024 * 1024) {
      alert("Fichier trop lourd — maximum 50MB")
      return
    }

    // Vérification durée vidéo (max 30s)
    const estVideo = fichier.type.startsWith("video/")
    const estImage = fichier.type.startsWith("image/")

    if (!estVideo && !estImage) {
      alert("Format non supporté — utilise une image ou une vidéo")
      return
    }

    // Aperçu local immédiat
    const urlLocale = URL.createObjectURL(fichier)
    setApercu(urlLocale)
    setTypeMedia(estVideo ? "video" : "image")

    if (estVideo) {
      // Vérification durée max 30s pour les stories
      const video = document.createElement("video")
      video.src = urlLocale
      video.onloadedmetadata = async () => {
        if (video.duration > 30) {
          alert("Vidéo trop longue — maximum 30 secondes pour une story")
          setApercu(null)
          return
        }
        await uploadFichier(fichier, "video")
      }
    } else {
      await uploadFichier(fichier, "image")
    }
  }

  async function uploadFichier(fichier: File, type: "image" | "video") {
    setChargement(true)

    // Nom unique pour éviter les conflits
    const extension = fichier.name.split(".").pop()
    const nomFichier = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const chemin = `public/${nomFichier}`

    const { error } = await supabase.storage
      .from("medias")
      .upload(chemin, fichier, { contentType: fichier.type })

    if (error) {
      alert("Erreur upload : " + error.message)
      setChargement(false)
      return
    }

    // Récupère l'URL publique
    const { data } = supabase.storage
      .from("medias")
      .getPublicUrl(chemin)

    onUploadTermine(data.publicUrl, type)
    setChargement(false)
  }

  return (
    <div>
      {/* Zone de dépôt */}
      {!apercu ? (
        <label style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: "10px",
          border: "2px dashed #E8A058", borderRadius: "12px",
          padding: "32px 16px", cursor: "pointer",
          background: "#FEF9F5", transition: "background .15s"
        }}>
          <span style={{ fontSize: "36px" }}>📷</span>
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#B5540A" }}>{label}</span>
          <span style={{ fontSize: "12px", color: "#aaa" }}>Photo ou vidéo · Max 50MB · Vidéo max 30s</span>
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFichier}
            style={{ display: "none" }}
          />
        </label>
      ) : (
        <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden" }}>
          {typeMedia === "video" ? (
            <video
              src={apercu}
              controls
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "12px" }}
            />
          ) : (
            <img
              src={apercu}
              style={{ width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "12px" }}
            />
          )}

          {chargement && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "12px"
            }}>
              <div style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
                Upload en cours...
              </div>
            </div>
          )}

          {!chargement && (
            <button
              onClick={() => { setApercu(null); setTypeMedia(null) }}
              style={{
                position: "absolute", top: "8px", right: "8px",
                background: "rgba(0,0,0,0.5)", border: "none",
                borderRadius: "50%", width: "28px", height: "28px",
                color: "white", cursor: "pointer", fontSize: "14px"
              }}
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  )
}
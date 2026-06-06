"use client"
import { useState } from "react"
import { supabase } from "./supabase"

type Props = {
  userId: string
}

export default function DashboardAnnonces({ userId }: Props) {
  const [boutique_nom, setBoutiquNom] = useState("")
  const [description, setDescription] = useState("")
  const [tags_cibles, setTagsCibles] = useState("")
  const [message, setMessage] = useState("")
  const [chargement, setChargement] = useState(false)

  async function handleSubmit() {
    if (!boutique_nom || !description) {
      setMessage("Remplis tous les champs !")
      return
    }
    setChargement(true)

    const { error } = await supabase
      .from("annonces")
      .insert([{ boutique_nom, description, tags_cibles, actif: true, user_id: userId }])

    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setMessage("Annonce publiée ! Elle apparaît dans le feed.")
      setBoutiquNom("")
      setDescription("")
      setTagsCibles("")
    }
    setChargement(false)
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "20px", fontWeight: "500", marginBottom: "6px" }}>
        Booster ma boutique
      </h2>
      <p style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>
        Ton annonce apparaîtra dans le feed toutes les 8 boutiques, ciblée par hashtag.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Nom de ta boutique</label>
          <input
            value={boutique_nom}
            onChange={e => setBoutiquNom(e.target.value)}
            placeholder="Ex : Marie Couture"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Message de l'annonce</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ex : -20% ce mois-ci sur tous nos sacs en cuir !"
            rows={3}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", resize: "vertical" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>
            Hashtags ciblés <span style={{ color: "#bbb" }}>(séparés par des virgules)</span>
          </label>
          <input
            value={tags_cibles}
            onChange={e => setTagsCibles(e.target.value)}
            placeholder="Ex : maroquinerie,Lyon,cuir"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />
          <p style={{ fontSize: "12px", color: "#aaa", marginTop: "4px" }}>
            Ton annonce s'affichera uniquement aux utilisateurs qui consultent ces hashtags.
          </p>
        </div>

        <div style={{ background: "#FAEEDA", border: "1px solid #EF9F27", borderRadius: "8px", padding: "12px" }}>
          <p style={{ fontSize: "13px", color: "#633806", fontWeight: "500", marginBottom: "4px" }}>Aperçu de ton annonce</p>
          <p style={{ fontSize: "13px", color: "#854F0B" }}>
            {boutique_nom || "Nom de ta boutique"} — {description || "Ton message ici"}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={chargement}
          style={{ padding: "12px", borderRadius: "8px", border: "none",
            background: chargement ? "#ccc" : "#B5540A",
            color: "white", fontSize: "15px", fontWeight: "500",
            cursor: chargement ? "not-allowed" : "pointer" }}
        >
          {chargement ? "Publication..." : "Publier l'annonce — 29 €/semaine"}
        </button>

        {message && (
          <p style={{ textAlign: "center", fontSize: "13px",
            color: message.includes("publiée") ? "#085041" : "#A32D2D" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  )
}
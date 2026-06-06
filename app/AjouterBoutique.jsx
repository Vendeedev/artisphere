"use client"
import { useState } from "react"
import { supabase } from "./supabase"

export default function AjouterBoutique() {
  const [nom, setNom] = useState("")
  const [categorie, setCategorie] = useState("")
  const [metierCustom, setMetierCustom] = useState("")
  const [ville, setVille] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [message, setMessage] = useState("")
  const [chargement, setChargement] = useState(false)

  async function handleSubmit() {
    // Si "Autre" est sélectionné on prend le métier custom
    const categorieFinale = categorie === "Autre" ? metierCustom : categorie

    if (!nom || !categorieFinale || !ville || !description) {
      setMessage("Remplis tous les champs !")
      return
    }

    setChargement(true)

    const { error } = await supabase
      .from("shops")
      .insert([{ nom, categorie: categorieFinale, ville, description, tags }])

    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setMessage("Boutique ajoutée avec succès !")
      setNom("")
      setCategorie("")
      setMetierCustom("")
      setVille("")
      setDescription("")
      setTags("")
    }

    setChargement(false)
  }

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Ajouter ma boutique</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Nom de la boutique</label>
          <input
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Ex : Marie Couture"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Catégorie</label>
          <select
  value={categorie}
  onChange={e => {
    setCategorie(e.target.value)
    setMetierCustom("")
  }}
  style={{ 
    width: "100%", 
    padding: "10px", 
    borderRadius: "8px", 
    border: "1px solid #ddd", 
    fontSize: "14px",
    background: "#f9f9f9",
    color: "#333",
    cursor: "pointer"
  }}
>
  <option value="" style={{ color: "#999" }}>-- Choisir votre métier --</option>
  <option value="Maroquinerie" style={{ color: "#333" }}>🧵 Maroquinerie</option>
  <option value="Menuiserie" style={{ color: "#333" }}>🪵 Menuiserie</option>
  <option value="Céramique" style={{ color: "#333" }}>🏺 Céramique</option>
  <option value="Alimentaire" style={{ color: "#333" }}>🍞 Alimentaire</option>
  <option value="Bijouterie" style={{ color: "#333" }}>💎 Bijouterie</option>
  <option value="Bien-être" style={{ color: "#333" }}>🕯️ Bien-être</option>
  <option value="Textile" style={{ color: "#333" }}>🧶 Textile</option>
  <option value="Autre" style={{ color: "#333" }}>✏️ Autre — préciser</option>
</select>

          {categorie === "Autre" && (
            <input
              value={metierCustom}
              onChange={e => setMetierCustom(e.target.value)}
              placeholder="Précise ton métier..."
              style={{ width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid #B5540A", fontSize: "14px", marginTop: "8px" }}
              autoFocus
            />
          )}
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Ville</label>
          <input
            value={ville}
            onChange={e => setVille(e.target.value)}
            placeholder="Ex : Lyon"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Décris ton activité en quelques mots..."
            rows={3}
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px", resize: "vertical" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>
            Hashtags <span style={{ color: "#bbb" }}>(séparés par des virgules)</span>
          </label>
          <input
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="Ex : maroquinerie,Lyon,cuir"
            style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={chargement}
          style={{ padding: "12px", borderRadius: "8px", border: "none",
            background: chargement ? "#ccc" : "#B5540A",
            color: "white", fontSize: "15px", fontWeight: "500",
            cursor: chargement ? "not-allowed" : "pointer" }}
        >
          {chargement ? "Envoi en cours..." : "Publier ma boutique"}
        </button>

        {message && (
          <p style={{ textAlign: "center", fontSize: "14px",
            color: message.includes("succès") ? "#085041" : "#A32D2D" }}>
            {message}
          </p>
        )}

      </div>
    </div>
  )
}
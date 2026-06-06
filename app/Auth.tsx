"use client"
import { useState } from "react"
import { supabase } from "./supabase"

type User = {
  id: string
  email?: string
}

type Props = {
  onConnecte: (user: User) => void
}

export default function Auth({ onConnecte }: Props) {
  const [email, setEmail] = useState("")
  const [motDePasse, setMotDePasse] = useState("")
  const [mode, setMode] = useState("connexion")
  const [message, setMessage] = useState("")
  const [chargement, setChargement] = useState(false)

  async function handleSubmit() {
    if (!email || !motDePasse) {
      setMessage("Remplis tous les champs !")
      return
    }
    setChargement(true)
    setMessage("")

    if (mode === "inscription") {
      const { error } = await supabase.auth.signUp({ email, password: motDePasse })
      if (error) {
        setMessage("Erreur : " + error.message)
      } else {
        setMessage("Compte créé ! Vérifie ton email pour confirmer.")
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: motDePasse })
      if (error) {
        setMessage("Email ou mot de passe incorrect.")
      } else {
        onConnecte(data.user)
      }
    }
    setChargement(false)
  }

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "30px",
      border: "1px solid #eee", borderRadius: "16px" }}>

      <h2 style={{ fontSize: "20px", fontWeight: "500", marginBottom: "6px", textAlign: "center" }}>
        {mode === "connexion" ? "Connexion" : "Créer un compte"}
      </h2>
      <p style={{ fontSize: "13px", color: "#888", textAlign: "center", marginBottom: "24px" }}>
        {mode === "connexion" ? "Accède à ta boutique Artisphère" : "Rejoins la communauté des artisans"}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="ton@email.com"
            style={{ width: "100%", padding: "10px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        <div>
          <label style={{ fontSize: "13px", color: "#888", display: "block", marginBottom: "4px" }}>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            placeholder="6 caractères minimum"
            style={{ width: "100%", padding: "10px", borderRadius: "8px",
              border: "1px solid #ddd", fontSize: "14px" }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={chargement}
          style={{ padding: "12px", borderRadius: "8px", border: "none",
            background: chargement ? "#ccc" : "#B5540A",
            color: "white", fontSize: "15px", fontWeight: "500",
            cursor: chargement ? "not-allowed" : "pointer",
            marginTop: "4px" }}
        >
          {chargement ? "..." : mode === "connexion" ? "Se connecter" : "Créer mon compte"}
        </button>

        {message && (
          <p style={{ textAlign: "center", fontSize: "13px",
            color: message.includes("créé") ? "#085041" : "#A32D2D" }}>
            {message}
          </p>
        )}

        <p style={{ textAlign: "center", fontSize: "13px", color: "#888", marginTop: "8px" }}>
          {mode === "connexion" ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span
            onClick={() => { setMode(mode === "connexion" ? "inscription" : "connexion"); setMessage("") }}
            style={{ color: "#B5540A", cursor: "pointer", fontWeight: "500" }}
          >
            {mode === "connexion" ? "S'inscrire" : "Se connecter"}
          </span>
        </p>

      </div>
    </div>
  )
}
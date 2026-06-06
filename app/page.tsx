"use client"
import { useState, useEffect } from "react"
import BoutiqueCard from "./BoutiqueCard"
import { supabase } from "./supabase"

// On décrit la forme d'une boutique pour TypeScript
type Shop = {
  id: number
  nom: string
  categorie: string
  ville: string
  description: string
  tags: string
}

export default function Page() {
  const [shops, setShops] = useState<Shop[]>([])
  const [filtre, setFiltre] = useState<string | null>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    async function chargerBoutiques() {
      const { data, error } = await supabase
        .from("shops")
        .select("*")

      if (error) {
        console.log("Erreur :", error)
      } else {
        console.log("Données reçues :", data)
        setShops(data)
      }
      setChargement(false)
    }
    chargerBoutiques()
  }, [])

  const shopsFiltres = filtre
    ? shops.filter(s => s.tags && s.tags.includes(filtre))
    : shops

  const tousLesTags = [...new Set(shops.flatMap(s => s.tags ? s.tags.split(",") : []))]

  if (chargement) {
    return <main style={{ padding: "20px" }}>Chargement...</main>
  }

  return (
    <main style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>

      <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>Artisphère</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
        <button
          onClick={() => setFiltre(null)}
          style={{ padding: "5px 12px", borderRadius: "20px", border: "1px solid #ccc",
            background: filtre === null ? "#B5540A" : "white",
            color: filtre === null ? "white" : "#666",
            cursor: "pointer" }}
        >
          Tout
        </button>
        {tousLesTags.map(tag => (
          <button
            key={tag}
            onClick={() => setFiltre(tag === filtre ? null : tag)}
            style={{ padding: "5px 12px", borderRadius: "20px", border: "1px solid #ccc",
              background: filtre === tag ? "#B5540A" : "white",
              color: filtre === tag ? "white" : "#666",
              cursor: "pointer" }}
          >
            #{tag}
          </button>
        ))}
      </div>

      <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
        {shopsFiltres.length} boutique{shopsFiltres.length > 1 ? "s" : ""}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {shopsFiltres.map(shop => (
          <BoutiqueCard
            key={shop.id}
            nom={shop.nom}
            categorie={shop.categorie}
            ville={shop.ville}
            description={shop.description}
          />
        ))}
      </div>

    </main>
  )
}
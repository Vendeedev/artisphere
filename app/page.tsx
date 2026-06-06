"use client"
import { useState, useEffect } from "react"
import BoutiqueCard from "./BoutiqueCard"
import AjouterBoutique from "./AjouterBoutique"
import Auth from "./Auth"
import Annonce from "./Annonce"
import DashboardAnnonces from "./DashboardAnnonces"
import Stories from "./Stories"
import { supabase } from "./supabase"
import Navbar from "./Navbar"
import Explorer from "./Explorer"
import Profil from "./Profil"

type Shop = {
  id: number
  nom: string
  categorie: string
  ville: string
  description: string
  tags: string
}

type AnnonceType = {
  id: number
  boutique_nom: string
  description: string
  tags_cibles: string
  actif: boolean
}

type User = {
  id: string
  email?: string
}

export default function Page() {
  const [shops, setShops] = useState<Shop[]>([])
  const [annonces, setAnnonces] = useState<AnnonceType[]>([])
  const [filtre, setFiltre] = useState<string | null>(null)
  const [chargement, setChargement] = useState(true)
  const [vue, setVue] = useState<"feed" | "explorer" | "ajouter" | "auth" | "booster" | "profil">("feed")
  const [user, setUser] = useState<User | null>(null)

  async function chargerDonnees() {
    const [{ data: shopsData }, { data: annoncesData }] = await Promise.all([
      supabase.from("shops").select("*"),
      supabase.from("annonces").select("*").eq("actif", true)
    ])
    if (shopsData) setShops(shopsData)
    if (annoncesData) setAnnonces(annoncesData)
    setChargement(false)
  }

  useEffect(() => {
    chargerDonnees()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
    })
  }, [])

  async function handleDeconnexion() {
    await supabase.auth.signOut()
    setUser(null)
    setVue("feed")
  }

  function buildFeed() {
    const shopsFiltres = filtre
      ? shops.filter(s => s.tags && s.tags.includes(filtre))
      : shops

    const annoncesActives = filtre
      ? annonces.filter(a => !a.tags_cibles || a.tags_cibles.includes(filtre))
      : annonces

    const feed: (Shop | (AnnonceType & { isAnnonce: true }))[] = []
    let annonceIndex = 0

    shopsFiltres.forEach((shop, i) => {
      feed.push(shop)
      if ((i + 1) % 8 === 0 && annonceIndex < annoncesActives.length) {
        feed.push({ ...annoncesActives[annonceIndex], isAnnonce: true })
        annonceIndex++
      }
    })

    return feed
  }

  const tousLesTags = [...new Set(shops.flatMap(s => s.tags ? s.tags.split(",") : []))]
  const feed = buildFeed()

  if (chargement) {
    return (
      <main style={{ padding: "20px", display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <div style={{ fontSize: "14px", color: "#888" }}>Chargement...</div>
      </main>
    )
  }

  return (
    <main style={{ padding: "16px", maxWidth: "480px", margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", cursor: "pointer", letterSpacing: "-0.5px" }}
          onClick={() => setVue("feed")}>
          Arti<span style={{ color: "#B5540A" }}>sphère</span>
        </h1>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          {user ? (
            <>
              <span style={{ fontSize: "12px", color: "#888" }}>{user.email}</span>
              <button
                onClick={() => setVue(vue === "ajouter" ? "feed" : "ajouter")}
                style={{ padding: "7px 14px", borderRadius: "20px", border: "1px solid #B5540A",
                  background: vue === "ajouter" ? "#B5540A" : "white",
                  color: vue === "ajouter" ? "white" : "#B5540A",
                  cursor: "pointer", fontSize: "13px" }}
              >
                {vue === "ajouter" ? "← Feed" : "+ Ajouter"}
              </button>
              <button
                onClick={() => setVue(vue === "booster" ? "feed" : "booster")}
                style={{ padding: "7px 14px", borderRadius: "20px", border: "1px solid #EF9F27",
                  background: vue === "booster" ? "#EF9F27" : "white",
                  color: vue === "booster" ? "white" : "#854F0B",
                  cursor: "pointer", fontSize: "13px" }}
              >
                {vue === "booster" ? "← Feed" : "⚡ Booster"}
              </button>
              <button
                onClick={handleDeconnexion}
                style={{ padding: "7px 14px", borderRadius: "20px", border: "1px solid #ddd",
                  background: "white", color: "#888", cursor: "pointer", fontSize: "13px" }}
              >
                Déco
              </button>
            </>
          ) : (
            <button
              onClick={() => setVue(vue === "auth" ? "feed" : "auth")}
              style={{ padding: "7px 14px", borderRadius: "20px", border: "1px solid #B5540A",
                background: vue === "auth" ? "#B5540A" : "white",
                color: vue === "auth" ? "white" : "#B5540A",
                cursor: "pointer", fontSize: "13px" }}
            >
              {vue === "auth" ? "← Retour" : "Connexion"}
            </button>
          )}
        </div>
      </div>

      {/* Vue auth */}
      {vue === "auth" && (
        <Auth onConnecte={(u: User) => { setUser(u); setVue("feed") }} />
      )}
      {vue === "explorer" && (
  <Explorer
    shops={shops}
    onFiltreHashtag={(tag: string) => { setFiltre(tag); setVue("feed") }}
  />
        )}
       {vue === "profil" && (
  <Profil
    user={user}
    shops={shops}
    onConnexion={() => setVue("auth")}
    onDeconnexion={handleDeconnexion}
  />
)} 

      {/* Vue formulaire ajout boutique */}
      {vue === "ajouter" && user && <AjouterBoutique />}

      {/* Vue dashboard annonces */}
      {vue === "booster" && user && <DashboardAnnonces userId={user.id} />}

      {/* Vue feed */}
      {vue === "feed" && (
        <>
          {/* Stories */}
          <Stories shops={shops} />

          {/* Hashtags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
            <button
              onClick={() => setFiltre(null)}
              style={{ padding: "5px 12px", borderRadius: "20px", border: "1px solid #ccc",
                background: filtre === null ? "#B5540A" : "white",
                color: filtre === null ? "white" : "#666",
                cursor: "pointer", fontSize: "13px" }}
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
                  cursor: "pointer", fontSize: "13px" }}
              >
                #{tag}
              </button>
            ))}
          </div>

          {/* Compteur */}
          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
            {shops.length} boutique{shops.length > 1 ? "s" : ""}
          </p>

          {/* Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "80px" }}>
            {feed.map((item) => (
              "isAnnonce" in item ? (
                <Annonce
                  key={"annonce-" + item.id}
                  boutique_nom={item.boutique_nom}
                  description={item.description}
                />
              ) : (
                <BoutiqueCard
                  key={item.id}
                  nom={item.nom}
                  categorie={item.categorie}
                  ville={item.ville}
                  description={item.description}
                />
              )
            ))}
          </div>
        </>
      )}
      <Navbar
        vue={vue}
        onNavigate={(v) => setVue(v)}
        connecte={user !== null}
      />
    </main>
  )
}
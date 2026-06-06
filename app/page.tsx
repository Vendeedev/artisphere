"use client"
import { useState, useEffect } from "react"
import BoutiqueCard from "./BoutiqueCard"
import AjouterBoutique from "./AjouterBoutique"
import Auth from "./Auth"
import Annonce from "./Annonce"
import DashboardAnnonces from "./DashboardAnnonces"
import Stories from "./Stories"
import Explorer from "./Explorer"
import Profil from "./Profil"
import Navbar from "./Navbar"
import NouveauPost from "./NouveauPost"
import NouvelleStory from "./NouvelleStory"
import PostCard from "./PostCard"
import { supabase } from "./supabase"

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

type Post = {
  id: number
  boutique_nom: string
  categorie: string
  description: string
  photo_url: string
  type_media: string
  tags: string
  user_id: string
}

type User = {
  id: string
  email?: string
}

export default function Page() {
  const [shops, setShops] = useState<Shop[]>([])
  const [annonces, setAnnonces] = useState<AnnonceType[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [filtre, setFiltre] = useState<string | null>(null)
  const [chargement, setChargement] = useState(true)
  const [vue, setVue] = useState<"feed" | "explorer" | "ajouter" | "auth" | "booster" | "profil" | "post" | "story">("feed")
  const [user, setUser] = useState<User | null>(null)

  async function chargerDonnees() {
    const [{ data: shopsData }, { data: annoncesData }, { data: postsData }] = await Promise.all([
      supabase.from("shops").select("*"),
      supabase.from("annonces").select("*").eq("actif", true),
      supabase.from("posts").select("*").order("created_at", { ascending: false })
    ])
    if (shopsData) setShops(shopsData)
    if (annoncesData) setAnnonces(annoncesData)
    if (postsData) setPosts(postsData)
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
      <main style={{ padding: "20px", display: "flex", alignItems: "center",
        justifyContent: "center", height: "100vh" }}>
        <div style={{ fontSize: "14px", color: "#888" }}>Chargement...</div>
      </main>
    )
  }

  return (
    <main style={{ padding: "16px", maxWidth: "480px", margin: "0 auto", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "20px" }}>
        <h1
          style={{ fontSize: "22px", fontWeight: "700", cursor: "pointer", letterSpacing: "-0.5px" }}
          onClick={() => setVue("feed")}
        >
          Arti<span style={{ color: "#B5540A" }}>sphère</span>
        </h1>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {user ? (
            <>
              <button
                onClick={() => setVue(vue === "post" ? "feed" : "post")}
                style={{ padding: "7px 12px", borderRadius: "20px",
                  border: "1px solid #B5540A",
                  background: vue === "post" ? "#B5540A" : "white",
                  color: vue === "post" ? "white" : "#B5540A",
                  cursor: "pointer", fontSize: "12px", fontWeight: "500" }}
              >
                📷 Post
              </button>
              <button
                onClick={() => setVue(vue === "story" ? "feed" : "story")}
                style={{ padding: "7px 12px", borderRadius: "20px",
                  border: "1px solid #E8A058",
                  background: vue === "story" ? "#E8A058" : "white",
                  color: vue === "story" ? "white" : "#854F0B",
                  cursor: "pointer", fontSize: "12px", fontWeight: "500" }}
              >
                🎬 Story
              </button>
              <button
                onClick={() => setVue(vue === "booster" ? "feed" : "booster")}
                style={{ padding: "7px 12px", borderRadius: "20px",
                  border: "1px solid #EF9F27",
                  background: vue === "booster" ? "#EF9F27" : "white",
                  color: vue === "booster" ? "white" : "#854F0B",
                  cursor: "pointer", fontSize: "12px" }}
              >
                ⚡
              </button>
            </>
          ) : (
            <button
              onClick={() => setVue(vue === "auth" ? "feed" : "auth")}
              style={{ padding: "7px 14px", borderRadius: "20px",
                border: "1px solid #B5540A",
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

      {/* Vue nouveau post */}
      {vue === "post" && user && (
        <NouveauPost
          userId={user.id}
          userEmail={user.email || ""}
          onPostPublie={() => { chargerDonnees(); setVue("feed") }}
        />
      )}

      {/* Vue nouvelle story */}
      {vue === "story" && user && (
        <NouvelleStory
          userId={user.id}
          boutique_nom={user.email || "Ma boutique"}
          onStoryPubliee={() => { chargerDonnees(); setVue("feed") }}
        />
      )}

      {/* Vue dashboard annonces */}
      {vue === "booster" && user && (
        <DashboardAnnonces userId={user.id} />
      )}

      {/* Vue ajouter boutique */}
      {vue === "ajouter" && user && <AjouterBoutique />}

      {/* Vue explorer */}
      {vue === "explorer" && (
        <Explorer
          shops={shops}
          onFiltreHashtag={(tag: string) => { setFiltre(tag); setVue("feed") }}
        />
      )}

      {/* Vue profil */}
      {vue === "profil" && (
        <Profil
          user={user}
          shops={shops}
          onConnexion={() => setVue("auth")}
          onDeconnexion={handleDeconnexion}
        />
      )}

      {/* Vue feed */}
      {vue === "feed" && (
        <>
          <Stories shops={shops} />

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

          <p style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
            {posts.length + shops.length} publication{posts.length + shops.length > 1 ? "s" : ""}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "80px" }}>

            {/* Vrais posts avec photos */}
            {posts.map(post => (
              <PostCard
                key={post.id}
                boutique_nom={post.boutique_nom}
                categorie={post.categorie}
                description={post.description}
                photo_url={post.photo_url}
                type_media={post.type_media}
                tags={post.tags}
              />
            ))}

            {/* Séparateur */}
            {posts.length > 0 && shops.length > 0 && (
              <div style={{ textAlign: "center", fontSize: "12px",
                color: "#aaa", padding: "8px 0" }}>
                — Toutes les boutiques —
              </div>
            )}

            {/* Boutiques + annonces */}
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

      {/* Navbar */}
      <Navbar
        vue={vue}
        onNavigate={(v: "feed" | "explorer" | "ajouter" | "profil") => setVue(v)}
        connecte={user !== null}
      />

    </main>
  )
}
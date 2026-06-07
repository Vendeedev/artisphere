"use client"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"

type Shop = {
  id: number
  nom: string
  categorie: string
}

type Story = {
  id: number
  boutique_nom: string
  photo_url: string
  expire_at: string
}

type Props = {
  shops: Shop[]
  onAjouterStory: () => void
}

export default function Stories({ shops, onAjouterStory }: Props) {
  const [stories, setStories] = useState<Story[]>([])
  const [storyActive, setStoryActive] = useState<Story | null>(null)
  const [progression, setProgression] = useState(0)

  const emojis: { [key: string]: string } = {
    "Maroquinerie": "👜", "Menuiserie": "🪵", "Céramique": "🏺",
    "Alimentaire": "🍞", "Bijouterie": "💎", "Bien-être": "🕯️",
    "Textile": "🧵"
  }

  useEffect(() => {
    chargerStories()
  }, [])

  async function chargerStories() {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .order("created_at", { ascending: false })
    console.log("stories chargées:", data, error)
    if (data) setStories(data)
  }

  // Barre de progression automatique — avance de 2% toutes les 100ms = 5 secondes
  useEffect(() => {
    if (!storyActive) { setProgression(0); return }
    setProgression(0)
    const interval = setInterval(() => {
      setProgression(p => {
        if (p >= 100) {
          setStoryActive(null)
          return 0
        }
        return p + 2
      })
    }, 100)
    return () => clearInterval(interval)
  }, [storyActive])

  return (
    <>
      {/* Carrousel stories */}
      <div style={{
        display: "flex",
        gap: "12px",
        overflowX: "auto",
        paddingBottom: "12px",
        marginBottom: "16px",
        scrollbarWidth: "none"
      }}>

        {/* Bouton + Ma story */}
        <div
          onClick={onAjouterStory}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", gap: "5px",
            flexShrink: 0, cursor: "pointer"
          }}
        >
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "#F0EAE2", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "24px",
            border: "2px dashed #B5540A", color: "#B5540A", fontWeight: "300"
          }}>
            +
          </div>
          <span style={{
            fontSize: "10px", color: "#888",
            width: "60px", textAlign: "center"
          }}>
            Ma story
          </span>
        </div>

        {/* Vraies stories depuis Supabase */}
        {stories.map(story => (
          <div
            key={story.id}
            onClick={() => setStoryActive(story)}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "5px",
              flexShrink: 0, cursor: "pointer"
            }}
          >
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              padding: "2px",
              background: "linear-gradient(45deg, #B5540A, #E8A058)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <img
                src={story.photo_url}
                alt={story.boutique_nom}
                style={{
                  width: "50px", height: "50px", borderRadius: "50%",
                  objectFit: "cover", border: "2px solid white"
                }}
              />
            </div>
            <span style={{
              fontSize: "10px", color: "#555",
              width: "60px", textAlign: "center",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>
              {story.boutique_nom.split("@")[0]}
            </span>
          </div>
        ))}

        {/* Boutiques sans story — affichées en grisé */}
        {shops.slice(0, 5).map(shop => (
          <div
            key={shop.id}
            style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "5px", flexShrink: 0
            }}
          >
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              padding: "2px", background: "#E8E0D8",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <div style={{
                width: "50px", height: "50px", borderRadius: "50%",
                background: "#F8F5F2", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "22px",
                border: "2px solid white"
              }}>
                {emojis[shop.categorie] || "🏪"}
              </div>
            </div>
            <span style={{
              fontSize: "10px", color: "#aaa",
              width: "60px", textAlign: "center",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"
            }}>
              {shop.nom.split(" ")[0]}
            </span>
          </div>
        ))}

      </div>

      {/* Visionneuse plein écran */}
      {storyActive && (
        <div
          onClick={() => setStoryActive(null)}
          style={{
            position: "fixed", inset: 0, background: "black",
            zIndex: 1000, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center"
          }}
        >
          {/* Barre de progression */}
          <div style={{
            position: "absolute", top: "16px", left: "16px", right: "16px",
            height: "3px", background: "rgba(255,255,255,0.3)", borderRadius: "2px"
          }}>
            <div style={{
              height: "100%", background: "white", borderRadius: "2px",
              width: `${progression}%`, transition: "width .1s linear"
            }} />
          </div>

          {/* Header avec nom boutique */}
          <div style={{
            position: "absolute", top: "28px", left: "16px",
            display: "flex", alignItems: "center", gap: "10px"
          }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "#FEF3E8", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "16px",
              border: "1.5px solid #E8A058"
            }}>
              🏪
            </div>
            <span style={{ color: "white", fontSize: "14px", fontWeight: "500" }}>
              {storyActive.boutique_nom.split("@")[0]}
            </span>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={e => { e.stopPropagation(); setStoryActive(null) }}
            style={{
              position: "absolute", top: "28px", right: "16px",
              background: "none", border: "none",
              color: "white", fontSize: "24px", cursor: "pointer"
            }}
          >
            ✕
          </button>

          {/* Media — vidéo ou image */}
          {storyActive.photo_url.includes(".mp4") ||
           storyActive.photo_url.includes(".mov") ? (
            <video
              src={storyActive.photo_url}
              autoPlay
              style={{
                maxWidth: "100%", maxHeight: "100vh",
                objectFit: "contain"
              }}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <img
              src={storyActive.photo_url}
              alt="story"
              style={{
                maxWidth: "100%", maxHeight: "100vh",
                objectFit: "contain"
              }}
              onClick={e => e.stopPropagation()}
            />
          )}

        </div>
      )}
    </>
  )
}
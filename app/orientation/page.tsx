"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, GraduationCap, Briefcase } from "lucide-react"

interface User {
  id: string
  username: string
  name?: string
  email: string
}

export default function OrientationPage() {
  // États pour la gestion des données utilisateur
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Charger les données utilisateur au montage du composant
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Récupérer depuis localStorage en premier (pour la démo)
        const userData = localStorage.getItem("user")
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } else {
          // Rediriger vers login si pas connecté
          window.location.href = "/login"
          return
        }

        // TODO: Remplacer par un appel API réel quand le backend sera prêt
        /*
        try {
          const response = await fetch('/api/auth/user', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            }
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
          } else {
            throw new Error('Erreur récupération utilisateur')
          }
        } catch (apiError) {
          console.error('Erreur API:', apiError)
          // Fallback sur localStorage si API indisponible
        }
        */
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error)
        window.location.href = "/login"
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [])

  // Générer l'URL de l'avatar basé sur le nom d'utilisateur
  const getAvatarUrl = (username: string) => {
    const seed = username || "default"
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=60A5FA&size=40`
  }

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  // Animations Framer Motion
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  }

  // Affichage du loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E3A8A] flex items-center justify-center">
        <div className="text-[#DBEAFE] text-xl font-inter">Chargement...</div>
      </div>
    )
  }

  // Redirection si pas d'utilisateur
  if (!user) {
    return (
      <div className="min-h-screen bg-[#1E3A8A] flex items-center justify-center">
        <div className="text-[#DBEAFE] text-xl font-inter">Redirection...</div>
      </div>
    )
  }

  return (
    <>
      {/* Import Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-[#1E3A8A] font-inter">
        {/* Header sticky */}
        <header className="sticky top-0 z-50 bg-[#172554] shadow-lg border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo et navigation */}
              <div className="flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="flex items-center text-[#60A5FA] hover:text-[#DBEAFE] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Retour</span>
                </Link>

                <Link href="/" className="flex items-center">
                  <h1 className="text-2xl font-bold text-[#60A5FA] hover:text-[#DBEAFE] transition-colors">YVA</h1>
                </Link>
              </div>

              {/* Informations utilisateur */}
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-[#DBEAFE] font-medium">{user.name || user.username}</span>
                  <img
                    src={getAvatarUrl(user.username || user.name || "")}
                    alt={`Avatar de ${user.name || user.username}`}
                    className="w-10 h-10 rounded-full border-2 border-[#60A5FA]"
                  />
                </div>

                <Button
                  onClick={handleLogout}
                  className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white border-0 transition-colors"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Se déconnecter</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="container mx-auto px-4 py-12">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Titre principal */}
            <div className="mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-[#DBEAFE] mb-4">
                Orientation scolaire et professionnelle
              </h1>
              <p className="text-xl text-[#DBEAFE] max-w-2xl mx-auto">
                Découvrez votre voie avec YVA ! Choisissez le type d'orientation qui vous correspond.
              </p>
            </div>

            {/* Cartes de choix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Carte Orientation scolaire */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-[#1E3A8A] rounded-xl p-8 border border-slate-700 shadow-lg cursor-pointer hover:scale-105 hover:bg-[#2563EB] transition-all duration-300"
              >
                <Link href="/orientation/scolaire" className="block">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-[#60A5FA] rounded-full flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#DBEAFE]">Orientation scolaire</h2>
                    <p className="text-[#DBEAFE] text-center leading-relaxed">
                      Découvrez les filières et séries qui correspondent à vos aspirations professionnelles. Évaluez vos
                      compétences et trouvez votre voie académique idéale.
                    </p>
                    <div className="mt-4 px-4 py-2 bg-[#60A5FA]/20 rounded-lg">
                      <span className="text-[#60A5FA] font-medium text-sm">Cliquez pour explorer</span>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Carte Orientation professionnelle */}
              <motion.div
                variants={cardVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-[#1E3A8A] rounded-xl p-8 border border-slate-700 shadow-lg cursor-pointer hover:scale-105 hover:bg-[#2563EB] transition-all duration-300"
              >
                <Link href="/orientation/professionnelle" className="block">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 bg-[#60A5FA] rounded-full flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-[#DBEAFE]">Orientation professionnelle</h2>
                    <p className="text-[#DBEAFE] text-center leading-relaxed">
                      Explorez les métiers et carrières qui correspondent à vos compétences et intérêts. Découvrez les
                      opportunités professionnelles qui s'offrent à vous.
                    </p>
                    <div className="mt-4 px-4 py-2 bg-[#60A5FA]/20 rounded-lg">
                      <span className="text-[#60A5FA] font-medium text-sm">Cliquez pour explorer</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Section informative */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-12 bg-[#172554] rounded-xl p-6 border border-slate-700"
            >
              <h3 className="text-xl font-semibold text-[#DBEAFE] mb-3">Pourquoi choisir YVA ?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-[#DBEAFE]">
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#60A5FA] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <p>Évaluation personnalisée de vos compétences</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#60A5FA] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <p>Recommandations adaptées au contexte togolais</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#60A5FA] rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <p>Accès aux mini-formations pour vous améliorer</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 bg-[#172554] border-t border-slate-700 mt-16">
          <div className="container mx-auto text-center">
            <p className="text-[#DBEAFE]">© 2025 YVA - Votre compagnon pour un avenir meilleur.</p>
          </div>
        </footer>
      </div>
    </>
  )
}

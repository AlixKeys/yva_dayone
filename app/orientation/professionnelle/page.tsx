"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LogOut, Construction, Briefcase, ArrowRight } from "lucide-react"

interface User {
  id: string
  username: string
  name?: string
  email: string
}

export default function OrientationProfessionnellePage() {
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
                  href="/orientation"
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
            {/* Section principale */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-[#172554] rounded-xl p-12 border border-slate-700 shadow-lg"
            >
              {/* Icône et titre */}
              <div className="flex flex-col items-center space-y-6 mb-8">
                <div className="w-20 h-20 bg-[#60A5FA] rounded-full flex items-center justify-center">
                  <Construction className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#DBEAFE]">Orientation professionnelle</h1>
                <p className="text-xl text-[#60A5FA] font-semibold">En cours de développement</p>
              </div>

              {/* Message principal */}
              <div className="mb-8">
                <p className="text-lg text-[#DBEAFE] leading-relaxed mb-6">
                  Nous travaillons activement sur cette fonctionnalité pour vous offrir la meilleure expérience
                  d'orientation professionnelle possible.
                </p>
                <p className="text-[#DBEAFE] mb-6">Cette section vous permettra bientôt de :</p>
              </div>

              {/* Liste des fonctionnalités à venir */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {[
                  "Explorer différents secteurs d'activité",
                  "Découvrir les métiers qui recrutent au Togo",
                  "Évaluer vos compétences professionnelles",
                  "Recevoir des recommandations personnalisées",
                  "Accéder à des témoignages de professionnels",
                  "Planifier votre parcours de carrière",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-left">
                    <div className="w-2 h-2 bg-[#60A5FA] rounded-full flex-shrink-0"></div>
                    <span className="text-[#DBEAFE]">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/orientation/scolaire">
                  <Button className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Essayer l'orientation scolaire
                  </Button>
                </Link>

                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors bg-transparent"
                  >
                    Retour au dashboard
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Section informative */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-8 bg-[#1E3A8A] rounded-xl p-6 border border-slate-700"
            >
              <h3 className="text-lg font-semibold text-[#DBEAFE] mb-3">En attendant...</h3>
              <p className="text-[#DBEAFE] text-sm">
                Profitez de notre orientation scolaire pour découvrir les filières qui correspondent à vos aspirations
                professionnelles, ou explorez nos mini-formations pour développer vos compétences.
              </p>
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

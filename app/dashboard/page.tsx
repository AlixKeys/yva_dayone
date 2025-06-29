"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Compass, BookOpen, FileText, Heart, LogOut } from "lucide-react"

interface FeatureCard {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  href: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Données des fonctionnalités YVA
  const features: FeatureCard[] = [
    {
      id: "orientation",
      title: "Orientation scolaire et professionnelle",
      description:
        "Découvrez les meilleures options pour vos études et votre carrière grâce à des tests intelligents et des recommandations personnalisées.",
      icon: <Compass className="w-12 h-12 text-blue-400" />,
      color: "from-blue-600 to-blue-700",
      href: "/orientation",
    },
    {
      id: "formations",
      title: "Mini-formations",
      description: "Accédez à des cours pratiques adaptés aux besoins locaux pour développer vos compétences.",
      icon: <BookOpen className="w-12 h-12 text-blue-400" />,
      color: "from-indigo-600 to-indigo-700",
      href: "/formations",
    },
    {
      id: "generation",
      title: "Génération",
      description: "Créez des CV, lettres de motivation et pitchs professionnels en quelques clics.",
      icon: <FileText className="w-12 h-12 text-blue-400" />,
      color: "from-purple-600 to-purple-700",
      href: "/generation",
    },
    {
      id: "motivation",
      title: "Motivation",
      description: "Recevez un soutien moral personnalisé pour rester motivé et confiant.",
      icon: <Heart className="w-12 h-12 text-blue-400" />,
      color: "from-pink-600 to-pink-700",
      href: "/motivation",
    },
  ]

  useEffect(() => {
    // Récupérer les informations utilisateur depuis localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Erreur parsing user data:", error)
        // Rediriger vers login si données corrompues
        window.location.href = "/login"
      }
    } else {
      // Rediriger vers login si pas connecté
      window.location.href = "/login"
    }
    setIsLoading(false)

    // TODO: Remplacer par un appel API réel
    /*
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access_token")
        const response = await fetch("http://localhost:8000/api/auth/user", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        })
        
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          throw new Error("Erreur récupération utilisateur")
        }
      } catch (error) {
        console.error("Erreur API:", error)
        window.location.href = "/login"
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUserData()
    */
  }, [])

  const handleLogout = () => {
    // Supprimer les tokens et rediriger
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  // Générer l'avatar basé sur le nom d'utilisateur
  const getAvatarUrl = (username: string) => {
    const seed = username || "default"
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=2563eb&size=40`
  }

  // Animation variants pour Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirection...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Header sticky */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo et Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">YVA</h1>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-blue-400 font-medium border-b-2 border-blue-400 pb-1">
                  Tableau de bord
                </Link>
                <Link href="/profile" className="text-blue-200 hover:text-blue-400 transition-colors">
                  Profil
                </Link>
              </nav>
            </div>

            {/* Informations utilisateur et déconnexion */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3">
                <span className="text-blue-100">
                  Bienvenue, <span className="font-semibold">{user.name || user.username}</span>
                </span>
                <img
                  src={getAvatarUrl(user.username || user.name)}
                  alt={`Avatar de ${user.name || user.username}`}
                  className="w-10 h-10 rounded-full border-2 border-blue-400"
                />
              </div>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white bg-transparent transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Section principale */}
      <main className="container mx-auto px-4 py-12">
        {/* Titre et sous-titre */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-blue-100 mb-4">
            Votre parcours avec <span className="text-blue-400">YVA</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto leading-relaxed">
            Explorez nos outils pour booster votre avenir !
          </p>
        </motion.div>

        {/* Section Vidéos explicatives */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-100 mb-4">
              Découvrez <span className="text-blue-400">YVA</span> en vidéo
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              Explorez nos fonctionnalités à travers ces vidéos explicatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-blue-500 transition-all duration-300 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="aspect-video bg-slate-700 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-white group-hover:text-blue-600 transition-colors duration-300">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p className="text-blue-200 text-sm group-hover:text-white transition-colors duration-300">
                      Vidéo explicative bientôt disponible
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Grille des fonctionnalités */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 hover:border-blue-500 transition-all duration-300 h-full group cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-blue-100 text-lg font-semibold leading-tight">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-blue-200 text-sm leading-relaxed mb-6">
                    {feature.description}
                  </CardDescription>
                  <Link href={feature.href}>
                    <Button
                      className={`w-full bg-gradient-to-r ${feature.color} hover:shadow-lg transition-all duration-300`}
                    >
                      Explorer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Section statistiques ou informations supplémentaires */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <h3 className="text-2xl font-bold text-blue-100 mb-4">Prêt à commencer votre transformation ?</h3>
            <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
              Rejoignez des milliers de jeunes Togolais qui utilisent YVA pour construire leur avenir. Chaque
              fonctionnalité a été conçue spécialement pour vous accompagner dans votre parcours.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">1000+</div>
                <div className="text-blue-200 text-sm">Utilisateurs actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">50+</div>
                <div className="text-blue-200 text-sm">Formations disponibles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">95%</div>
                <div className="text-blue-200 text-sm">Taux de satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">24/7</div>
                <div className="text-blue-200 text-sm">Support disponible</div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-800 border-t border-slate-700 mt-16">
        <div className="container mx-auto text-center">
          <p className="text-blue-200">© 2025 YVA - Votre compagnon pour un avenir meilleur.</p>
        </div>
      </footer>
    </div>
  )
}

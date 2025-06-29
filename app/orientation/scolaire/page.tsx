"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, LogOut, Brain, Zap, Microscope, BookOpen, Heart, Users } from "lucide-react"

// Types pour l'évaluation des compétences
interface CompetenceEvaluation {
  id: string
  nom: string
  description: string
  icon: React.ReactNode
  niveau: number // 0=non évalué, 1=Faible, 2=Moyen, 3=Bon, 4=Excellent
}

interface User {
  id: string
  username: string
  name?: string
  email: string
}

export default function OrientationScolairePage() {
  // États pour la gestion du flux de l'application
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState<"question" | "evaluation" | "feedback">("question")
  const [metierInput, setMetierInput] = useState("")
  const [metierChoisi] = useState("Médecin") // Hardcodé pour la démo

  // États pour l'évaluation des compétences spécifiques au métier de Médecin
  const [competences, setCompetences] = useState<CompetenceEvaluation[]>([
    {
      id: "maths",
      nom: "Maths",
      description: "Maîtrise des concepts mathématiques pour les calculs médicaux.",
      icon: <Brain className="w-6 h-6" />,
      niveau: 0,
    },
    {
      id: "physique",
      nom: "Physique",
      description: "Compréhension des principes physiques pour les technologies médicales.",
      icon: <Zap className="w-6 h-6" />,
      niveau: 0,
    },
    {
      id: "chimie",
      nom: "Chimie",
      description: "Connaissances en chimie pour comprendre les médicaments et réactions.",
      icon: <Microscope className="w-6 h-6" />,
      niveau: 0,
    },
    {
      id: "sciences-naturelles",
      nom: "Sciences naturelles",
      description: "Connaissances en biologie pour comprendre le corps humain.",
      icon: <BookOpen className="w-6 h-6" />,
      niveau: 0,
    },
    {
      id: "empathie",
      nom: "Degré d'empathie",
      description: "Capacité à comprendre et soutenir les patients.",
      icon: <Heart className="w-6 h-6" />,
      niveau: 0,
    },
    {
      id: "travail-equipe",
      nom: "Travail d'équipe",
      description: "Collaboration avec d'autres professionnels de santé.",
      icon: <Users className="w-6 h-6" />,
      niveau: 0,
    },
  ])

  // États pour le feedback
  const [feedbackData, setFeedbackData] = useState<{
    moyenne: number
    competencesFaibles: string[]
    message: string
    encouragement: string
  } | null>(null)

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

  // Valider la saisie du métier et passer à l'évaluation
  const handleValiderMetier = () => {
    if (metierInput.trim()) {
      // Pour la démo, on passe toujours à l'évaluation pour "Médecin"
      setCurrentStep("evaluation")
    }
  }

  // Mettre à jour l'évaluation d'une compétence
  const updateCompetenceNiveau = (competenceId: string, niveau: number) => {
    setCompetences((prev) => prev.map((comp) => (comp.id === competenceId ? { ...comp, niveau } : comp)))
  }

  // Calculer la moyenne des évaluations
  const calculerMoyenne = () => {
    const evaluations = competences.filter((comp) => comp.niveau > 0)
    if (evaluations.length === 0) return 0
    const total = evaluations.reduce((sum, comp) => sum + comp.niveau, 0)
    return total / evaluations.length
  }

  // Obtenir les compétences faibles/moyennes (niveau < 3)
  const getCompetencesFaibles = () => {
    return competences.filter((comp) => comp.niveau > 0 && comp.niveau < 3).map((comp) => comp.nom)
  }

  // Soumettre l'évaluation et générer le feedback
  const handleSoumettreEvaluation = () => {
    // Vérifier que toutes les compétences sont évaluées
    const allEvaluated = competences.every((comp) => comp.niveau > 0)
    if (!allEvaluated) {
      alert("Veuillez évaluer toutes les compétences avant de continuer.")
      return
    }

    const moyenne = calculerMoyenne()
    const competencesFaibles = getCompetencesFaibles()

    let message: string
    let encouragement: string

    if (moyenne >= 3) {
      // Feedback positif pour moyenne ≥ 3
      message =
        "Félicitations ! Vous avez les compétences nécessaires pour envisager la série D (scientifique), idéale pour devenir médecin. Cette série met l'accent sur les sciences (maths, physique, chimie, sciences naturelles), parfait pour les études médicales !"
      encouragement = "Vous pouvez déjà commencer à renforcer vos compétences avec les mini-formations YVA."
    } else {
      // Feedback d'amélioration pour moyenne < 3
      message =
        "Pour devenir médecin, il est recommandé de suivre la série D (scientifique), qui met l'accent sur les sciences (maths, physique, chimie, sciences naturelles). Cependant, vos compétences actuelles nécessitent un renforcement pour atteindre ce niveau."
      encouragement = `Bonne nouvelle ! YVA propose des mini-formations pour développer vos compétences en ${competencesFaibles.join(
        ", ",
      )}.`
    }

    setFeedbackData({
      moyenne,
      competencesFaibles,
      message,
      encouragement,
    })
    setCurrentStep("feedback")
  }

  // Recommencer l'orientation (retour à la question initiale)
  const handleRecommencer = () => {
    setCurrentStep("question")
    setMetierInput("")
    setCompetences((prev) => prev.map((comp) => ({ ...comp, niveau: 0 })))
    setFeedbackData(null)
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
          <AnimatePresence mode="wait">
            {/* Étape 1: Question sur le métier rêvé */}
            {currentStep === "question" && (
              <motion.div
                key="question"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto text-center"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-[#DBEAFE] mb-8">Quel métier rêves-tu de faire ?</h1>

                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-[#172554] rounded-xl p-8 border border-slate-700 shadow-lg"
                >
                  <div className="space-y-6">
                    <Input
                      type="text"
                      placeholder="Entrez votre métier"
                      value={metierInput}
                      onChange={(e) => setMetierInput(e.target.value)}
                      className="w-full bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] placeholder-slate-400 focus:border-[#60A5FA] focus:ring-[#60A5FA] rounded-lg text-lg py-3"
                      onKeyPress={(e) => e.key === "Enter" && handleValiderMetier()}
                    />

                    <Button
                      onClick={handleValiderMetier}
                      disabled={!metierInput.trim()}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      Valider
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Étape 2: Évaluation des compétences pour Médecin */}
            {currentStep === "evaluation" && (
              <motion.div
                key="evaluation"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                {/* Titre de l'évaluation */}
                <div className="text-center mb-12">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#DBEAFE] mb-4">
                    Ah oui ?! <span className="text-[#60A5FA]">{metierChoisi}</span> est un beau métier !
                  </h1>
                  <p className="text-lg text-[#DBEAFE]">Ce métier requiert les compétences suivantes :</p>
                </div>

                {/* Cartes d'évaluation des compétences */}
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-[#172554] rounded-xl p-8 border border-slate-700 shadow-lg"
                >
                  <div className="space-y-8">
                    {competences.map((competence, index) => (
                      <div key={competence.id} className="border-b border-slate-600 pb-6 last:border-b-0">
                        {/* En-tête de la compétence */}
                        <div className="flex items-start mb-4">
                          <div className="text-[#60A5FA] mr-3 mt-1">{competence.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-[#DBEAFE] mb-1">{competence.nom}</h3>
                            <p className="text-sm text-slate-300">{competence.description}</p>
                          </div>
                        </div>

                        {/* Question d'évaluation */}
                        <div className="ml-9">
                          <p className="text-[#DBEAFE] font-medium mb-3">
                            Comment évaluez-vous votre niveau dans cette compétence ?
                          </p>

                          {/* Boutons radio pour les niveaux */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                              { label: "Faible", value: 1 },
                              { label: "Moyen", value: 2 },
                              { label: "Bon", value: 3 },
                              { label: "Excellent", value: 4 },
                            ].map((niveau) => (
                              <label
                                key={niveau.value}
                                className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                  competence.niveau === niveau.value
                                    ? "border-[#60A5FA] bg-[#60A5FA]/20 text-[#60A5FA]"
                                    : "border-slate-600 bg-[#1E3A8A] text-[#DBEAFE] hover:border-[#60A5FA]/50"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`competence-${competence.id}`}
                                  value={niveau.value}
                                  checked={competence.niveau === niveau.value}
                                  onChange={() => updateCompetenceNiveau(competence.id, niveau.value)}
                                  className="sr-only"
                                  aria-label={`${niveau.label} pour ${competence.nom}`}
                                />
                                <span className="text-sm font-medium">{niveau.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Bouton Soumettre */}
                    <div className="text-center pt-6">
                      <Button
                        onClick={handleSoumettreEvaluation}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-8 py-3 rounded-lg transition-colors text-lg"
                        disabled={competences.some((comp) => comp.niveau === 0)}
                      >
                        Soumettre
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Étape 3: Feedback basé sur l'évaluation */}
            {currentStep === "feedback" && feedbackData && (
              <motion.div
                key="feedback"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto"
              >
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className={`rounded-xl p-8 border-2 shadow-lg ${
                    feedbackData.moyenne >= 3
                      ? "bg-green-900/20 border-green-500"
                      : "bg-yellow-900/20 border-yellow-500"
                  }`}
                >
                  {/* En-tête du feedback */}
                  <div className="text-center mb-6">
                    <div
                      className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                        feedbackData.moyenne >= 3 ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {feedbackData.moyenne >= 3 ? (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        </svg>
                      )}
                    </div>

                    <h2 className="text-2xl font-bold text-[#DBEAFE] mb-4">
                      {feedbackData.moyenne >= 3 ? "Excellent travail !" : "Continuez vos efforts !"}
                    </h2>
                  </div>

                  {/* Message principal */}
                  <div className="mb-6">
                    <p className="text-[#DBEAFE] text-lg leading-relaxed mb-4">{feedbackData.message}</p>

                    <p className="text-[#60A5FA] font-semibold text-lg">{feedbackData.encouragement}</p>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/dashboard">
                      <Button className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                        Découvrir les mini-formations
                      </Button>
                    </Link>

                    <Button
                      onClick={handleRecommencer}
                      variant="outline"
                      className="w-full sm:w-auto border-[#60A5FA] text-[#60A5FA] hover:bg-[#60A5FA] hover:text-white font-semibold px-6 py-3 rounded-lg transition-colors bg-transparent"
                    >
                      Refaire une orientation
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
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

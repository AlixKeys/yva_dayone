"use client"
import { useState, useEffect } from "react"
import type React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, LogOut, Loader2, Lightbulb, BookOpen, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"

interface User {
  id: string
  username: string
  name?: string
  email: string
}

interface FormData {
  age: number
  sexe: string
  localite: string
  langues: string[]
  niveauEtude: string
  filiere: string
  matieresScientifiques: string
  matieresLitteraires: string
  statut: string
  matieresPreferees: string[]
  activitesPreferees: string[]
  travailPreference: string
  aimes: string[]
  typeTravail: string
  metierEnTete: string
  metier: string
  objectif: string
  entrepreneuriat: string
  smartphone: string
  internet: string
  activiteParents: string
  apprentissage: string[]
  competenceExistante: string
}

export default function OrientationPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [recommendation, setRecommendation] = useState("")
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<FormData>({
    age: 12,
    sexe: "",
    localite: "Lomé",
    langues: [],
    niveauEtude: "Collège (3e)",
    filiere: "Série D",
    matieresScientifiques: "Faible",
    matieresLitteraires: "Faible",
    statut: "En cours",
    matieresPreferees: [],
    activitesPreferees: [],
    travailPreference: "Seul",
    aimes: [],
    typeTravail: "Fixe",
    metierEnTete: "Non",
    metier: "",
    objectif: "Aider les autres",
    entrepreneuriat: "Non",
    smartphone: "Oui",
    internet: "Fréquent",
    activiteParents: "Agriculture",
    apprentissage: [],
    competenceExistante: "",
  })

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } else {
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

  const getAvatarUrl = (username: string) => {
    const seed = username || "default"
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=60A5FA&size=40`
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCheckboxChange = (field: keyof FormData, value: string, checked: boolean) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      let newArray: string[]

      if (checked) {
        newArray = [...currentArray, value]
      } else {
        newArray = currentArray.filter((item) => item !== value)
      }

      return {
        ...prev,
        [field]: newArray,
      }
    })
  }

  const formatRecommendation = (text: string): string => {
    if (!text) return ""

    // Nettoyer le texte
    let formatted = text.trim()

    // Remplacer les marqueurs de formatage par du HTML
    formatted = formatted
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Gras
      .replace(/\*(.*?)\*/g, "<em>$1</em>") // Italique
      .replace(/###\s*(.*?)(?=\n|$)/g, '<h3 class="text-lg font-semibold text-[#60A5FA] mt-4 mb-2">$1</h3>') // Titres H3
      .replace(/##\s*(.*?)(?=\n|$)/g, '<h2 class="text-xl font-bold text-[#60A5FA] mt-6 mb-3">$1</h2>') // Titres H2
      .replace(/#\s*(.*?)(?=\n|$)/g, '<h1 class="text-2xl font-bold text-[#60A5FA] mt-6 mb-4">$1</h1>') // Titres H1
      .replace(/^\s*[-•]\s*(.*?)(?=\n|$)/gm, '<li class="ml-4 mb-1">• $1</li>') // Listes à puces
      .replace(/^\s*\d+\.\s*(.*?)(?=\n|$)/gm, '<li class="ml-4 mb-1">$1</li>') // Listes numérotées
      .replace(/\n\s*\n/g, '</p><p class="mb-3">') // Paragraphes

    // Envelopper dans des paragraphes si pas déjà fait
    if (!formatted.includes("<p>") && !formatted.includes("<h")) {
      formatted = `<p class="mb-3">${formatted}</p>`
    }

    // Envelopper les listes
    formatted = formatted.replace(/(<li.*?<\/li>\s*)+/g, '<ul class="mb-4">$&</ul>')

    return formatted
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setRecommendation("")

    try {
      console.log("📤 Envoi des données à l'API Gradio...")

      const response = await fetch("http://localhost:7860/api/orientation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [
            formData.age,
            formData.sexe,
            formData.localite,
            formData.langues,
            formData.niveauEtude,
            formData.filiere,
            formData.matieresScientifiques,
            formData.matieresLitteraires,
            formData.statut,
            formData.matieresPreferees,
            formData.activitesPreferees,
            formData.travailPreference,
            formData.aimes,
            formData.typeTravail,
            formData.metierEnTete,
            formData.metier,
            formData.objectif,
            formData.entrepreneuriat,
            formData.smartphone,
            formData.internet,
            formData.activiteParents,
            formData.apprentissage,
            formData.competenceExistante,
          ],
        }),
      })

      console.log("📡 Statut de la réponse:", response.status)

      if (response.ok) {
        const result = await response.json()
        console.log("✅ Résultat reçu:", result)

        const rawRecommendation = result.data?.[0] || "Aucune recommandation générée"
        setRecommendation(rawRecommendation)
        setShowResult(true)
      } else {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
    } catch (error: any) {
      console.error("❌ Erreur lors de l'appel API:", error)

      if (error.message.includes("fetch")) {
        setError(
          "Impossible de se connecter au service d'orientation. Vérifiez que le serveur Gradio est démarré sur le port 7860.",
        )
      } else {
        setError("Une erreur s'est produite lors de la génération de votre recommandation. Veuillez réessayer.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      age: 12,
      sexe: "",
      localite: "Lomé",
      langues: [],
      niveauEtude: "Collège (3e)",
      filiere: "Série D",
      matieresScientifiques: "Faible",
      matieresLitteraires: "Faible",
      statut: "En cours",
      matieresPreferees: [],
      activitesPreferees: [],
      travailPreference: "Seul",
      aimes: [],
      typeTravail: "Fixe",
      metierEnTete: "Non",
      metier: "",
      objectif: "Aider les autres",
      entrepreneuriat: "Non",
      smartphone: "Oui",
      internet: "Fréquent",
      activiteParents: "Agriculture",
      apprentissage: [],
      competenceExistante: "",
    })
    setShowResult(false)
    setRecommendation("")
    setError("")
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#1E3A8A] flex items-center justify-center">
        <div className="text-[#DBEAFE] text-xl font-inter flex items-center">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Chargement...
        </div>
      </div>
    )
  }

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-[#1E3A8A] font-inter">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#172554] shadow-lg border-b border-slate-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
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
        <main className="container mx-auto px-4 py-8">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Titre */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-[#DBEAFE] mb-4">
                Trouvez votre voie avec <span className="text-[#60A5FA]">YVA</span>
              </h1>
              <p className="text-xl text-[#DBEAFE] max-w-2xl mx-auto">
                Remplissez ce formulaire pour une recommandation personnalisée adaptée aux réalités togolaises.
              </p>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg"
              >
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-red-200">
                    <p className="font-medium mb-1">Erreur</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Formulaire */}
            <motion.div
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="bg-[#172554] border-slate-700">
                <CardHeader>
                  <CardTitle className="text-[#DBEAFE] flex items-center">
                    <Lightbulb className="w-6 h-6 mr-2 text-[#60A5FA]" />
                    Questionnaire d'orientation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Section 1: Informations personnelles */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-[#60A5FA] border-b border-slate-600 pb-2">
                        Informations personnelles
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="age" className="text-[#DBEAFE] font-medium">
                            Âge *
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            min="12"
                            max="25"
                            value={formData.age}
                            onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || 12)}
                            className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] focus:border-[#60A5FA] mt-1"
                            required
                          />
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Sexe (facultatif)</Label>
                          <Select value={formData.sexe} onValueChange={(value) => handleInputChange("sexe", value)}>
                            <SelectTrigger className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] mt-1">
                              <SelectValue placeholder="Sélectionner" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#172554] border-slate-600">
                              <SelectItem value="Homme" className="text-[#DBEAFE]">
                                Homme
                              </SelectItem>
                              <SelectItem value="Femme" className="text-[#DBEAFE]">
                                Femme
                              </SelectItem>
                              <SelectItem value="Autre" className="text-[#DBEAFE]">
                                Autre
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Localité / Région *</Label>
                          <Select
                            value={formData.localite}
                            onValueChange={(value) => handleInputChange("localite", value)}
                          >
                            <SelectTrigger className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#172554] border-slate-600">
                              <SelectItem value="Lomé" className="text-[#DBEAFE]">
                                Lomé
                              </SelectItem>
                              <SelectItem value="Kara" className="text-[#DBEAFE]">
                                Kara
                              </SelectItem>
                              <SelectItem value="Savanes" className="text-[#DBEAFE]">
                                Savanes
                              </SelectItem>
                              <SelectItem value="Maritime" className="text-[#DBEAFE]">
                                Maritime
                              </SelectItem>
                              <SelectItem value="Plateaux" className="text-[#DBEAFE]">
                                Plateaux
                              </SelectItem>
                              <SelectItem value="Centrale" className="text-[#DBEAFE]">
                                Centrale
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Langue(s) parlée(s) *</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {["Français", "Ewe", "Kabyè", "Mina", "Autre"].map((langue) => (
                              <div key={langue} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`langue-${langue}`}
                                  checked={formData.langues.includes(langue)}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange("langues", langue, checked as boolean)
                                  }
                                  className="border-slate-600 data-[state=checked]:bg-[#60A5FA]"
                                />
                                <Label htmlFor={`langue-${langue}`} className="text-[#DBEAFE] text-sm">
                                  {langue}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Niveau d'études */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-[#60A5FA] border-b border-slate-600 pb-2">
                        Niveau d'études
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Niveau d'étude actuel *</Label>
                          <Select
                            value={formData.niveauEtude}
                            onValueChange={(value) => handleInputChange("niveauEtude", value)}
                          >
                            <SelectTrigger className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#172554] border-slate-600">
                              <SelectItem value="Collège (3e)" className="text-[#DBEAFE]">
                                Collège (3e)
                              </SelectItem>
                              <SelectItem value="Lycée (Terminale)" className="text-[#DBEAFE]">
                                Lycée (Terminale)
                              </SelectItem>
                              <SelectItem value="BTS" className="text-[#DBEAFE]">
                                BTS
                              </SelectItem>
                              <SelectItem value="Licence" className="text-[#DBEAFE]">
                                Licence
                              </SelectItem>
                              <SelectItem value="Autre" className="text-[#DBEAFE]">
                                Autre
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Filière suivie</Label>
                          <Select
                            value={formData.filiere}
                            onValueChange={(value) => handleInputChange("filiere", value)}
                          >
                            <SelectTrigger className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#172554] border-slate-600">
                              <SelectItem value="Série D" className="text-[#DBEAFE]">
                                Série D
                              </SelectItem>
                              <SelectItem value="Série C" className="text-[#DBEAFE]">
                                Série C
                              </SelectItem>
                              <SelectItem value="Série L" className="text-[#DBEAFE]">
                                Série L
                              </SelectItem>
                              <SelectItem value="Série F" className="text-[#DBEAFE]">
                                Série F
                              </SelectItem>
                              <SelectItem value="Aucune" className="text-[#DBEAFE]">
                                Aucune
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Matières scientifiques *</Label>
                          <RadioGroup
                            value={formData.matieresScientifiques}
                            onValueChange={(value) => handleInputChange("matieresScientifiques", value)}
                            className="mt-2"
                          >
                            {["Faible", "Moyen", "Élevé"].map((niveau) => (
                              <div key={niveau} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={niveau}
                                  id={`sci-${niveau}`}
                                  className="border-slate-600 text-[#60A5FA]"
                                />
                                <Label htmlFor={`sci-${niveau}`} className="text-[#DBEAFE]">
                                  {niveau}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Matières littéraires *</Label>
                          <RadioGroup
                            value={formData.matieresLitteraires}
                            onValueChange={(value) => handleInputChange("matieresLitteraires", value)}
                            className="mt-2"
                          >
                            {["Faible", "Moyen", "Élevé"].map((niveau) => (
                              <div key={niveau} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={niveau}
                                  id={`litt-${niveau}`}
                                  className="border-slate-600 text-[#60A5FA]"
                                />
                                <Label htmlFor={`litt-${niveau}`} className="text-[#DBEAFE]">
                                  {niveau}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Tu es actuellement *</Label>
                        <RadioGroup
                          value={formData.statut}
                          onValueChange={(value) => handleInputChange("statut", value)}
                          className="mt-2 flex flex-wrap gap-6"
                        >
                          {["En cours", "En pause", "Déscolarisé"].map((situation) => (
                            <div key={situation} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={situation}
                                id={`sit-${situation}`}
                                className="border-slate-600 text-[#60A5FA]"
                              />
                              <Label htmlFor={`sit-${situation}`} className="text-[#DBEAFE]">
                                {situation}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Section 3: Préférences */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-[#60A5FA] border-b border-slate-600 pb-2">
                        Préférences et intérêts
                      </h3>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Matière(s) préférée(s) *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                          {["Maths", "Physique", "Chimie", "Français", "Histoire", "Géographie", "SVT"].map(
                            (matiere) => (
                              <div key={matiere} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`matiere-${matiere}`}
                                  checked={formData.matieresPreferees.includes(matiere)}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange("matieresPreferees", matiere, checked as boolean)
                                  }
                                  className="border-slate-600 data-[state=checked]:bg-[#60A5FA]"
                                />
                                <Label htmlFor={`matiere-${matiere}`} className="text-[#DBEAFE] text-sm">
                                  {matiere}
                                </Label>
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Activité(s) préférée(s) *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {["Bricoler", "Dessiner", "Aider", "Vendre", "Coder"].map((activite) => (
                            <div key={activite} className="flex items-center space-x-2">
                              <Checkbox
                                id={`activite-${activite}`}
                                checked={formData.activitesPreferees.includes(activite)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("activitesPreferees", activite, checked as boolean)
                                }
                                className="border-slate-600 data-[state=checked]:bg-[#60A5FA]"
                              />
                              <Label htmlFor={`activite-${activite}`} className="text-[#DBEAFE] text-sm">
                                {activite}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Tu aimes *</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {["Créer", "Réparer", "Enseigner", "Soigner", "Organiser"].map((action) => (
                            <div key={action} className="flex items-center space-x-2">
                              <Checkbox
                                id={`aimer-${action}`}
                                checked={formData.aimes.includes(action)}
                                onCheckedChange={(checked) => handleCheckboxChange("aimes", action, checked as boolean)}
                                className="border-slate-600 data-[state=checked]:bg-[#60A5FA]"
                              />
                              <Label htmlFor={`aimer-${action}`} className="text-[#DBEAFE] text-sm">
                                {action}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Préfères-tu travailler *</Label>
                          <RadioGroup
                            value={formData.travailPreference}
                            onValueChange={(value) => handleInputChange("travailPreference", value)}
                            className="mt-2"
                          >
                            {["Seul", "En équipe", "Peu importe"].map((pref) => (
                              <div key={pref} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={pref}
                                  id={`travail-${pref}`}
                                  className="border-slate-600 text-[#60A5FA]"
                                />
                                <Label htmlFor={`travail-${pref}`} className="text-[#DBEAFE]">
                                  {pref}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Type de travail qui t'attire *</Label>
                          <RadioGroup
                            value={formData.typeTravail}
                            onValueChange={(value) => handleInputChange("typeTravail", value)}
                            className="mt-2"
                          >
                            {["Fixe", "Terrain", "Mobile", "En ligne"].map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={type}
                                  id={`type-${type}`}
                                  className="border-slate-600 text-[#60A5FA]"
                                />
                                <Label htmlFor={`type-${type}`} className="text-[#DBEAFE]">
                                  {type}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: Aspirations */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-[#60A5FA] border-b border-slate-600 pb-2">
                        Aspirations professionnelles
                      </h3>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">As-tu un métier en tête ? *</Label>
                        <RadioGroup
                          value={formData.metierEnTete}
                          onValueChange={(value) => handleInputChange("metierEnTete", value)}
                          className="mt-2 flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Oui" id="metier-oui" className="border-slate-600 text-[#60A5FA]" />
                            <Label htmlFor="metier-oui" className="text-[#DBEAFE]">
                              Oui
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Non" id="metier-non" className="border-slate-600 text-[#60A5FA]" />
                            <Label htmlFor="metier-non" className="text-[#DBEAFE]">
                              Non
                            </Label>
                          </div>
                        </RadioGroup>

                        {formData.metierEnTete === "Oui" && (
                          <div className="mt-4">
                            <Label htmlFor="metier" className="text-[#DBEAFE] font-medium">
                              Si oui, quel métier ? *
                            </Label>
                            <Input
                              id="metier"
                              value={formData.metier}
                              onChange={(e) => handleInputChange("metier", e.target.value)}
                              className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] focus:border-[#60A5FA] mt-1"
                              placeholder="Ex: Médecin, Ingénieur, Professeur..."
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Tu veux *</Label>
                        <RadioGroup
                          value={formData.objectif}
                          onValueChange={(value) => handleInputChange("objectif", value)}
                          className="mt-2 space-y-2"
                        >
                          {[
                            "Aider les autres",
                            "Gagner de l'argent",
                            "Être indépendant",
                            "Être utile à ma communauté",
                          ].map((obj) => (
                            <div key={obj} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={obj}
                                id={`obj-${obj}`}
                                className="border-slate-600 text-[#60A5FA]"
                              />
                              <Label htmlFor={`obj-${obj}`} className="text-[#DBEAFE]">
                                {obj}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">
                          Es-tu intéressé(e) par l'entrepreneuriat ? *
                        </Label>
                        <RadioGroup
                          value={formData.entrepreneuriat}
                          onValueChange={(value) => handleInputChange("entrepreneuriat", value)}
                          className="mt-2 flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Oui" id="entrep-oui" className="border-slate-600 text-[#60A5FA]" />
                            <Label htmlFor="entrep-oui" className="text-[#DBEAFE]">
                              Oui
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Non" id="entrep-non" className="border-slate-600 text-[#60A5FA]" />
                            <Label htmlFor="entrep-non" className="text-[#DBEAFE]">
                              Non
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    {/* Section 5: Contexte */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-[#60A5FA] border-b border-slate-600 pb-2">
                        Contexte et ressources
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Accès à un smartphone *</Label>
                          <RadioGroup
                            value={formData.smartphone}
                            onValueChange={(value) => handleInputChange("smartphone", value)}
                            className="mt-2 flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Oui" id="phone-oui" className="border-slate-600 text-[#60A5FA]" />
                              <Label htmlFor="phone-oui" className="text-[#DBEAFE]">
                                Oui
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="Non" id="phone-non" className="border-slate-600 text-[#60A5FA]" />
                              <Label htmlFor="phone-non" className="text-[#DBEAFE]">
                                Non
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Accès internet régulier ? *</Label>
                          <RadioGroup
                            value={formData.internet}
                            onValueChange={(value) => handleInputChange("internet", value)}
                            className="mt-2"
                          >
                            {["Fréquent", "Parfois", "Rarement"].map((freq) => (
                              <div key={freq} className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value={freq}
                                  id={`net-${freq}`}
                                  className="border-slate-600 text-[#60A5FA]"
                                />
                                <Label htmlFor={`net-${freq}`} className="text-[#DBEAFE]">
                                  {freq}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Activité des parents *</Label>
                        <Select
                          value={formData.activiteParents}
                          onValueChange={(value) => handleInputChange("activiteParents", value)}
                        >
                          <SelectTrigger className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#172554] border-slate-600">
                            <SelectItem value="Agriculture" className="text-[#DBEAFE]">
                              Agriculture
                            </SelectItem>
                            <SelectItem value="Commerce" className="text-[#DBEAFE]">
                              Commerce
                            </SelectItem>
                            <SelectItem value="Fonctionnaire" className="text-[#DBEAFE]">
                              Fonctionnaire
                            </SelectItem>
                            <SelectItem value="Artisanat" className="text-[#DBEAFE]">
                              Artisanat
                            </SelectItem>
                            <SelectItem value="Autre" className="text-[#DBEAFE]">
                              Autre
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Tu apprends mieux en *</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {["Vidéo", "Lecture", "Exercice pratique", "Discussion"].map((style) => (
                            <div key={style} className="flex items-center space-x-2">
                              <Checkbox
                                id={`apprentissage-${style}`}
                                checked={formData.apprentissage.includes(style)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("apprentissage", style, checked as boolean)
                                }
                                className="border-slate-600 data-[state=checked]:bg-[#60A5FA]"
                              />
                              <Label htmlFor={`apprentissage-${style}`} className="text-[#DBEAFE] text-sm">
                                {style}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="competence" className="text-[#DBEAFE] font-medium">
                          As-tu déjà une compétence ? (facultatif)
                        </Label>
                        <Textarea
                          id="competence"
                          value={formData.competenceExistante}
                          onChange={(e) => handleInputChange("competenceExistante", e.target.value)}
                          className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] focus:border-[#60A5FA] mt-1"
                          placeholder="Ex: Programmation Python, Couture, Mécanique, Photographie..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Bouton de soumission */}
                    <div className="text-center pt-8">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-12 py-4 text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                            Analyse en cours avec Mistral AI...
                          </>
                        ) : (
                          <>
                            <Lightbulb className="w-6 h-6 mr-3" />
                            Obtenir ma recommandation
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </main>

        {/* Dialogue de résultat */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="bg-[#172554] border-slate-700 max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#DBEAFE] text-2xl flex items-center">
                <CheckCircle className="w-7 h-7 mr-3 text-green-400" />
                Votre recommandation personnalisée
              </DialogTitle>
            </DialogHeader>

            <div className="mt-6">
              <div
                className="text-[#DBEAFE] leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: formatRecommendation(recommendation) }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-slate-600">
              <Button
                onClick={() => (window.location.href = "/dashboard")}
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex-1 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Découvrir les mini-formations
              </Button>

              <Button
                onClick={resetForm}
                variant="outline"
                className="border-slate-600 text-[#DBEAFE] hover:bg-[#1E3A8A] flex-1 bg-transparent py-3"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Refaire une orientation
              </Button>
            </div>
          </DialogContent>
        </Dialog>

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

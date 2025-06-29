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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, LogOut, Loader2, Lightbulb, BookOpen, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"

interface User {
  id: string
  username: string
  name?: string
  email: string
}

interface OrientationFormData {
  age: number
  sexe: string
  localite: string
  langues: string[]
  niveauEtude: string
  filiere: string
  matieresSci: string
  matieresLitt: string
  situationActuelle: string
  matieresPref: string[]
  activitesPref: string[]
  travailPref: string
  aimerFaire: string[]
  typeTravail: string
  metierEnTete: string
  metierPrecis: string
  motivation: string
  entrepreneuriat: string
  smartphone: string
  internet: string
  activiteParents: string
  apprentissage: string[]
  competenceExist: string
}

export default function OrientationPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [recommendation, setRecommendation] = useState("")
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // État du formulaire avec valeurs par défaut
  const [formData, setFormData] = useState<OrientationFormData>({
    age: 0,
    sexe: "",
    localite: "",
    langues: [],
    niveauEtude: "",
    filiere: "",
    matieresSci: "",
    matieresLitt: "",
    situationActuelle: "",
    matieresPref: [],
    activitesPref: [],
    travailPref: "",
    aimerFaire: [],
    typeTravail: "",
    metierEnTete: "",
    metierPrecis: "",
    motivation: "",
    entrepreneuriat: "",
    smartphone: "",
    internet: "",
    activiteParents: "",
    apprentissage: [],
    competenceExist: "",
  })

  // Charger les données utilisateur
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

  // Générer l'URL de l'avatar
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

  // Gérer les changements de champs simples
  const handleInputChange = (field: keyof OrientationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Effacer les erreurs de validation quand l'utilisateur modifie un champ
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  // Gérer les cases à cocher multiples
  const handleCheckboxChange = (field: keyof OrientationFormData, value: string, checked: boolean) => {
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

    // Effacer les erreurs de validation
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  // Validation complète du formulaire
  const validateForm = (): string[] => {
    const errors: string[] = []

    // Validation de l'âge
    if (!formData.age || formData.age < 12 || formData.age > 25) {
      errors.push("L'âge doit être entre 12 et 25 ans")
    }

    // Validation des champs obligatoires
    if (!formData.localite) errors.push("La localité/région est obligatoire")
    if (formData.langues.length === 0) errors.push("Au moins une langue parlée est obligatoire")
    if (!formData.niveauEtude) errors.push("Le niveau d'étude actuel est obligatoire")
    if (!formData.matieresSci) errors.push("Le niveau en matières scientifiques est obligatoire")
    if (!formData.matieresLitt) errors.push("Le niveau en matières littéraires est obligatoire")
    if (!formData.situationActuelle) errors.push("Votre situation actuelle est obligatoire")
    if (formData.matieresPref.length === 0) errors.push("Au moins une matière préférée est obligatoire")
    if (formData.activitesPref.length === 0) errors.push("Au moins une activité préférée est obligatoire")
    if (!formData.travailPref) errors.push("Votre préférence de travail est obligatoire")
    if (formData.aimerFaire.length === 0) errors.push("Au moins une chose que vous aimez faire est obligatoire")
    if (!formData.typeTravail) errors.push("Le type de travail qui vous attire est obligatoire")
    if (!formData.metierEnTete) errors.push("Veuillez indiquer si vous avez un métier en tête")
    if (!formData.motivation) errors.push("Votre motivation principale est obligatoire")
    if (!formData.entrepreneuriat) errors.push("Votre intérêt pour l'entrepreneuriat est obligatoire")
    if (!formData.smartphone) errors.push("Votre accès à un smartphone est obligatoire")
    if (!formData.internet) errors.push("Votre accès internet est obligatoire")
    if (!formData.activiteParents) errors.push("L'activité des parents est obligatoire")
    if (formData.apprentissage.length === 0) errors.push("Au moins un style d'apprentissage est obligatoire")

    // Validation conditionnelle du métier
    if (formData.metierEnTete === "Oui" && !formData.metierPrecis.trim()) {
      errors.push("Veuillez préciser le métier que vous avez en tête")
    }

    return errors
  }

  // Transformer les données du formulaire au format attendu par l'API
  const transformFormDataForAPI = (data: OrientationFormData) => {
    return {
      Âge: data.age,
      Sexe: data.sexe,
      Localité: data.localite,
      "Langue parlée": data.langues,
      "Niveau d'étude actuel": data.niveauEtude,
      "Filière suivie": data.filiere,
      "Matières scientifiques": data.matieresSci,
      "Matières littéraires": data.matieresLitt,
      "Tu es actuellement": data.situationActuelle,
      "Matière(s) préférée(s)": data.matieresPref,
      "Activité(s) préférée(s)": data.activitesPref,
      "Préfères-tu travailler": data.travailPref,
      "Tu aimes": data.aimerFaire,
      "Type de travail qui t'attire": data.typeTravail,
      "As-tu un métier en tête ?": data.metierEnTete,
      ...(data.metierEnTete === "Oui" && { Métier: data.metierPrecis }),
      "Tu veux": data.motivation,
      "Es-tu intéressé(e) par l'entrepreneuriat ?": data.entrepreneuriat,
      "Accès à un smartphone": data.smartphone,
      "Accès internet régulier ?": data.internet,
      "Activité des parents": data.activiteParents,
      "Tu apprends mieux en": data.apprentissage,
      "As-tu déjà une compétence ?": data.competenceExist,
    }
  }

  // Appeler l'API d'orientation
  const callOrientationAPI = async (data: OrientationFormData): Promise<string> => {
    try {
      console.log("Envoi des données à l'API:", data)

      const apiData = transformFormDataForAPI(data)
      console.log("Données transformées pour l'API:", apiData)

      const response = await fetch("/api/orientation/mistral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      })

      console.log("Statut de la réponse:", response.status)

      const contentType = response.headers.get("content-type")
      console.log("Type de contenu:", contentType)

      if (!response.ok) {
        let errorMessage = `Erreur HTTP: ${response.status}`
        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } else {
            const errorText = await response.text()
            errorMessage = errorText || errorMessage
          }
        } catch (e) {
          console.error("Erreur lors de la lecture de l'erreur:", e)
        }
        throw new Error(errorMessage)
      }

      if (!contentType?.includes("application/json")) {
        const responseText = await response.text()
        console.error("Réponse non-JSON reçue:", responseText)
        throw new Error("La réponse du serveur n'est pas au format JSON")
      }

      const result = await response.json()
      console.log("Résultat reçu:", result)

      if (!result.success) {
        throw new Error(result.error || "Erreur inconnue du service AI")
      }

      return result.recommendation || "Aucune recommandation générée"
    } catch (error: any) {
      console.error("Erreur détaillée appel API:", error)

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Problème de connexion au serveur. Vérifiez votre connexion internet.")
      } else if (error.message.includes("JSON")) {
        throw new Error("Erreur de format de données. Veuillez réessayer.")
      } else {
        throw error
      }
    }
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors([])

    // Validation
    const errors = validateForm()
    if (errors.length > 0) {
      setValidationErrors(errors)
      setError("Veuillez corriger les erreurs ci-dessous avant de continuer.")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("Données du formulaire validées:", formData)

      const recommendation = await callOrientationAPI(formData)

      setRecommendation(recommendation)
      setShowResult(true)
    } catch (error: any) {
      console.error("Erreur lors de l'appel API:", error)
      setError(
        error.message || "Une erreur s'est produite lors de la génération de votre recommandation. Veuillez réessayer.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      age: 0,
      sexe: "",
      localite: "",
      langues: [],
      niveauEtude: "",
      filiere: "",
      matieresSci: "",
      matieresLitt: "",
      situationActuelle: "",
      matieresPref: [],
      activitesPref: [],
      travailPref: "",
      aimerFaire: [],
      typeTravail: "",
      metierEnTete: "",
      metierPrecis: "",
      motivation: "",
      entrepreneuriat: "",
      smartphone: "",
      internet: "",
      activiteParents: "",
      apprentissage: [],
      competenceExist: "",
    })
    setShowResult(false)
    setRecommendation("")
    setError("")
    setValidationErrors([])
  }

  // Animations
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1E3A8A] flex items-center justify-center">
        <div className="text-[#DBEAFE] text-xl font-inter flex items-center">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Chargement...
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#1E3A8A] flex items-center justify-center">
        <div className="text-[#DBEAFE] text-xl font-inter">Redirection...</div>
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
                Remplissez ce formulaire pour découvrir les filières et métiers adaptés à vos intérêts et compétences.
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

            {/* Erreurs de validation */}
            {validationErrors.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg"
              >
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-yellow-200">
                    <p className="font-medium mb-2">Champs manquants ou incorrects :</p>
                    <ul className="text-sm space-y-1">
                      {validationErrors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full mr-2"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
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
                            Âge * <span className="text-sm text-slate-400">(12-25 ans)</span>
                          </Label>
                          <Input
                            id="age"
                            type="number"
                            min="12"
                            max="25"
                            value={formData.age || ""}
                            onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value) || 0)}
                            className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] focus:border-[#60A5FA] mt-1"
                            placeholder="Votre âge"
                          />
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">
                            Sexe <span className="text-sm text-slate-400">(facultatif)</span>
                          </Label>
                          <Select value={formData.sexe} onValueChange={(value) => handleInputChange("sexe", value)}>
                            <SelectTrigger className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] mt-1">
                              <SelectValue placeholder="Sélectionnez" />
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
                              <SelectValue placeholder="Sélectionnez votre région" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#172554] border-slate-600">
                              <SelectItem value="Lomé" className="text-[#DBEAFE]">
                                Lomé
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
                              <SelectItem value="Kara" className="text-[#DBEAFE]">
                                Kara
                              </SelectItem>
                              <SelectItem value="Savanes" className="text-[#DBEAFE]">
                                Savanes
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-[#DBEAFE] font-medium">Langues parlées *</Label>
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
                              <SelectValue placeholder="Votre niveau" />
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
                              <SelectValue placeholder="Votre filière" />
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
                            value={formData.matieresSci}
                            onValueChange={(value) => handleInputChange("matieresSci", value)}
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
                            value={formData.matieresLitt}
                            onValueChange={(value) => handleInputChange("matieresLitt", value)}
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
                          value={formData.situationActuelle}
                          onValueChange={(value) => handleInputChange("situationActuelle", value)}
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

                    {/* Section 3: Préférences et intérêts */}
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
                                  checked={formData.matieresPref.includes(matiere)}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange("matieresPref", matiere, checked as boolean)
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
                                checked={formData.activitesPref.includes(activite)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("activitesPref", activite, checked as boolean)
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
                                checked={formData.aimerFaire.includes(action)}
                                onCheckedChange={(checked) =>
                                  handleCheckboxChange("aimerFaire", action, checked as boolean)
                                }
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
                            value={formData.travailPref}
                            onValueChange={(value) => handleInputChange("travailPref", value)}
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

                    {/* Section 4: Aspirations professionnelles */}
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
                            <Label htmlFor="metier-precis" className="text-[#DBEAFE] font-medium">
                              Quel métier ? *
                            </Label>
                            <Input
                              id="metier-precis"
                              value={formData.metierPrecis}
                              onChange={(e) => handleInputChange("metierPrecis", e.target.value)}
                              className="bg-[#1E3A8A] border-slate-600 text-[#DBEAFE] focus:border-[#60A5FA] mt-1"
                              placeholder="Ex: Médecin, Ingénieur, Professeur..."
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <Label className="text-[#DBEAFE] font-medium">Tu veux *</Label>
                        <RadioGroup
                          value={formData.motivation}
                          onValueChange={(value) => handleInputChange("motivation", value)}
                          className="mt-2 space-y-2"
                        >
                          {[
                            "Aider les autres",
                            "Gagner de l'argent",
                            "Être indépendant",
                            "Être utile à ma communauté",
                          ].map((motiv) => (
                            <div key={motiv} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={motiv}
                                id={`motiv-${motiv}`}
                                className="border-slate-600 text-[#60A5FA]"
                              />
                              <Label htmlFor={`motiv-${motiv}`} className="text-[#DBEAFE]">
                                {motiv}
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

                    {/* Section 5: Contexte et ressources */}
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
                            <SelectValue placeholder="Activité principale" />
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
                          As-tu déjà une compétence ? <span className="text-sm text-slate-400">(facultatif)</span>
                        </Label>
                        <Textarea
                          id="competence"
                          value={formData.competenceExist}
                          onChange={(e) => handleInputChange("competenceExist", e.target.value)}
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
          <DialogContent className="bg-[#172554] border-slate-700 max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-[#DBEAFE] text-2xl flex items-center">
                <CheckCircle className="w-7 h-7 mr-3 text-green-400" />
                Votre recommandation personnalisée
              </DialogTitle>
              <DialogDescription className="text-[#DBEAFE] mt-4 whitespace-pre-line leading-relaxed text-base">
                {recommendation}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
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

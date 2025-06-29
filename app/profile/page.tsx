"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Edit, Save, X, User, Mail, Phone, MapPin, Calendar, Download, Key, Trash2 } from "lucide-react"

interface UserProfile {
  id: number
  name: string
  email: string
  username: string
  phone?: string
  location?: string
  bio?: string
  joinDate?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    // Récupérer les informations utilisateur depuis localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        const userWithDefaults = {
          ...parsedUser,
          phone: parsedUser.phone || "",
          location: parsedUser.location || "",
          bio: parsedUser.bio || "",
          joinDate: parsedUser.joinDate || new Date().toLocaleDateString("fr-FR"),
        }
        setUser(userWithDefaults)
        setEditedUser(userWithDefaults)
      } catch (error) {
        console.error("Erreur parsing user data:", error)
        window.location.href = "/login"
      }
    } else {
      window.location.href = "/login"
    }
    setIsLoading(false)
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    setSaveMessage("")
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser(user)
    setSaveMessage("")
  }

  const handleSave = () => {
    if (editedUser) {
      // Sauvegarder dans localStorage
      localStorage.setItem("user", JSON.stringify(editedUser))
      setUser(editedUser)
      setIsEditing(false)
      setSaveMessage("Profil mis à jour avec succès !")

      // Effacer le message après 3 secondes
      setTimeout(() => setSaveMessage(""), 3000)
    }
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value,
      })
    }
  }

  // Générer l'avatar basé sur le nom d'utilisateur
  const getAvatarUrl = (username: string, size = 120) => {
    const seed = username || "default"
    return `https://api.dicebear.com/9.x/identicon/svg?seed=${encodeURIComponent(seed)}&backgroundColor=2563eb&size=${size}`
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
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour au dashboard</span>
            </Link>
            <h1 className="text-xl font-bold text-blue-100">Mon Profil</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {saveMessage && (
            <Alert className="mb-6 border-green-500 bg-green-500/10">
              <AlertDescription className="text-green-400">{saveMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Carte Avatar et Informations de base */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <img
                      src={getAvatarUrl(user.username) || "/placeholder.svg"}
                      alt={`Avatar de ${user.name}`}
                      className="w-32 h-32 rounded-full border-4 border-blue-400"
                    />
                  </div>
                  <CardTitle className="text-blue-100 text-2xl">{user.name}</CardTitle>
                  <CardDescription className="text-blue-400">@{user.username}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3 text-blue-200">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-blue-200">
                    <Calendar className="w-5 h-5 text-blue-400" />
                    <span className="text-sm">Membre depuis {user.joinDate}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Carte Informations détaillées */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-100 text-xl">Informations personnelles</CardTitle>
                    <CardDescription className="text-blue-200">Gérez vos informations de profil</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={handleEdit}
                      variant="outline"
                      size="sm"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-blue-200 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Nom complet
                      </Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={editedUser?.name || ""}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-slate-700 border-slate-600 text-blue-100 focus:border-blue-400"
                        />
                      ) : (
                        <p className="text-blue-100 bg-slate-700/50 p-3 rounded-md">{user.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-blue-200 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Label>
                      <p className="text-blue-100 bg-slate-700/50 p-3 rounded-md">{user.email}</p>
                      <p className="text-xs text-blue-300">L'email ne peut pas être modifié</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-blue-200 flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Téléphone
                      </Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={editedUser?.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+228 XX XX XX XX"
                          className="bg-slate-700 border-slate-600 text-blue-100 focus:border-blue-400"
                        />
                      ) : (
                        <p className="text-blue-100 bg-slate-700/50 p-3 rounded-md">{user.phone || "Non renseigné"}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-blue-200 flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        Localisation
                      </Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={editedUser?.location || ""}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          placeholder="Lomé, Togo"
                          className="bg-slate-700 border-slate-600 text-blue-100 focus:border-blue-400"
                        />
                      ) : (
                        <p className="text-blue-100 bg-slate-700/50 p-3 rounded-md">
                          {user.location || "Non renseigné"}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-blue-200">
                      Biographie
                    </Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editedUser?.bio || ""}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        placeholder="Parlez-nous de vous, vos aspirations, vos objectifs..."
                        className="bg-slate-700 border-slate-600 text-blue-100 focus:border-blue-400 min-h-[100px]"
                      />
                    ) : (
                      <p className="text-blue-100 bg-slate-700/50 p-3 rounded-md min-h-[100px]">
                        {user.bio || "Aucune biographie renseignée"}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Actions du compte */}
          <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 mt-8">
            <CardHeader>
              <CardTitle className="text-blue-100 text-xl">Actions du compte</CardTitle>
              <CardDescription className="text-blue-200">Gérez les paramètres avancés de votre compte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </Button>
                <Button
                  variant="outline"
                  className="border-green-400 text-green-400 hover:bg-green-400 hover:text-white bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger mes données
                </Button>
                <Button
                  variant="outline"
                  className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white bg-transparent"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer le compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

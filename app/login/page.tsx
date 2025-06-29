"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Comptes de test prédéfinis
  const testAccounts = [
    { email: "admin@yva.com", password: "admin", name: "Administrateur YVA", username: "admin" },
    { email: "test@yva.com", password: "test1234", name: "Utilisateur Test", username: "test" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulation d'un délai d'authentification
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Vérifier les comptes de test
      const account = testAccounts.find((acc) => acc.email === email && acc.password === password)

      if (account) {
        // Simuler les tokens et données utilisateur
        const userData = {
          id: account.email === "admin@yva.com" ? 1 : 2,
          name: account.name,
          email: account.email,
          username: account.username,
        }

        // Stocker dans localStorage
        localStorage.setItem("access_token", "fake_access_token_" + Date.now())
        localStorage.setItem("refresh_token", "fake_refresh_token_" + Date.now())
        localStorage.setItem("user", JSON.stringify(userData))

        // Rediriger vers le dashboard
        window.location.href = "/dashboard"
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Lien de retour */}
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l'accueil
        </Link>

        <Card className="bg-slate-800/80 backdrop-blur-sm border-slate-700 shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-2xl">Y</span>
            </div>
            <CardTitle className="text-3xl font-bold text-blue-100">Connexion à YVA</CardTitle>
            <CardDescription className="text-blue-200">
              Accédez à votre espace personnel pour continuer votre parcours
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-200">
                  Adresse email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-blue-100 placeholder-blue-300 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-blue-200">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-700 border-slate-600 text-blue-100 placeholder-blue-300 focus:border-blue-400 focus:ring-blue-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                  Mot de passe oublié ?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 transition-colors"
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Comptes de test */}
            <div className="border-t border-slate-700 pt-6">
              <p className="text-blue-200 text-sm text-center mb-4">Comptes de test disponibles :</p>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-blue-300 font-medium">Administrateur</p>
                  <p className="text-blue-400">admin@yva.com / admin</p>
                </div>
                <div className="bg-slate-700/50 rounded p-3">
                  <p className="text-blue-300 font-medium">Utilisateur test</p>
                  <p className="text-blue-400">test@yva.com / test1234</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-blue-200">
                Pas encore de compte ?{" "}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  Créer un compte
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

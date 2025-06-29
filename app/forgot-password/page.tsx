"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("L'email est requis")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format d'email invalide")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // TODO: Intégrer avec l'API Django
      const response = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Erreur lors de l'envoi de l'email")
      }
    } catch (error) {
      setError("Erreur de connexion au serveur")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-6 py-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Email envoyé !</h2>
            <p className="mb-6">
              Un lien de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception et
              suivez les instructions.
            </p>
            <Link href="/login">
              <Button className="bg-blue-600 hover:bg-blue-700">Retour à la connexion</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header simple */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <Link href="/login" className="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à la connexion
          </Link>
        </div>
      </header>

      {/* Section principale */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-100 mb-2">Mot de passe oublié ?</h1>
            <p className="text-blue-200">
              Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-blue-100">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-600 text-blue-100 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

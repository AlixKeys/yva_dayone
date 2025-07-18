"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { initializeGoogleAuth, handleGoogleSignIn, GOOGLE_CLIENT_ID } from "@/lib/google-auth"

interface GoogleSignInProps {
  text?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function GoogleSignIn({ text = "Se connecter avec Google", onSuccess, onError }: GoogleSignInProps) {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false)

  useEffect(() => {
    initializeGoogleAuth()

    // Callback global pour Google
    window.googleSignInCallback = async (response: any) => {
      try {
        await handleGoogleSignIn(response.credential)
        onSuccess?.()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Erreur de connexion Google"
        onError?.(errorMessage)
      }
    }

    // Vérifier si Google est chargé
    const checkGoogleLoaded = () => {
      if (window.google?.accounts?.id) {
        setIsGoogleLoaded(true)
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: window.googleSignInCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
            ux_mode: "popup",
            context: "signin",
          })
        } catch (error) {
          console.error("Erreur initialisation Google:", error)
          onError?.("Erreur de configuration Google OAuth")
        }
      } else {
        setTimeout(checkGoogleLoaded, 100)
      }
    }

    checkGoogleLoaded()

    return () => {
      if (window.googleSignInCallback) {
        delete window.googleSignInCallback
      }
    }
  }, [onSuccess, onError])

  const handleClick = () => {
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: ouvrir la popup de connexion Google
            window.google.accounts.id.renderButton(document.createElement("div"), {
              theme: "outline",
              size: "large",
              type: "standard",
              text: "signin_with",
              shape: "rectangular",
              logo_alignment: "left",
            })
          }
        })
      } catch (error) {
        console.error("Erreur Google Sign-In:", error)
        onError?.("Impossible d'ouvrir la connexion Google. Vérifiez la configuration OAuth.")
      }
    } else {
      onError?.("Google Identity Services n'est pas encore chargé")
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant="outline"
      className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 py-3 text-lg transition-colors disabled:opacity-50"
      disabled={!isGoogleLoaded}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      {isGoogleLoaded ? text : "Chargement Google..."}
    </Button>
  )
}

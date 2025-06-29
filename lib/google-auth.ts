// Configuration Google Auth pour le frontend
declare global {
  interface Window {
    google: any
    googleSignInCallback: (response: any) => void
  }
}

export const GOOGLE_CLIENT_ID = "56630309985-ks3hqev5takfalpdaa6l6s52ipf2qlbj.apps.googleusercontent.com"

export const initializeGoogleAuth = () => {
  // Charger le script Google Identity Services
  if (!document.getElementById("google-identity-script")) {
    const script = document.createElement("script")
    script.id = "google-identity-script"
    script.src = "https://accounts.google.com/gsi/client"
    script.async = true
    script.defer = true
    script.onload = () => {
      console.log("Google Identity Services loaded")
    }
    document.head.appendChild(script)
  }
}

export const handleGoogleSignIn = async (credential: string) => {
  try {
    // Pour le développement, on simule une réponse réussie
    console.log("Google credential received:", credential)

    // TODO: Remplacer par l'appel API réel quand le backend sera prêt
    const mockResponse = {
      success: true,
      tokens: {
        access: "mock_access_token",
        refresh: "mock_refresh_token",
      },
      user: {
        id: 1,
        name: "Utilisateur Google",
        email: "user@gmail.com",
      },
    }

    // Stocker les tokens
    localStorage.setItem("access_token", mockResponse.tokens.access)
    localStorage.setItem("refresh_token", mockResponse.tokens.refresh)
    localStorage.setItem("user", JSON.stringify(mockResponse.user))

    // Rediriger vers le dashboard
    window.location.href = "/dashboard"

    /* 
    // Code pour l'API réelle (à décommenter quand le backend sera prêt)
    const response = await fetch("http://localhost:8000/api/auth/google-auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: credential,
      }),
    })

    const data = await response.json()

    if (data.success) {
      localStorage.setItem("access_token", data.tokens.access)
      localStorage.setItem("refresh_token", data.tokens.refresh)
      localStorage.setItem("user", JSON.stringify(data.user))
      window.location.href = "/dashboard"
    } else {
      throw new Error(data.message)
    }
    */
  } catch (error) {
    console.error("Erreur Google Auth:", error)
    throw error
  }
}

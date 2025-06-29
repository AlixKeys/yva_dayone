/**
 * Client pour appeler le script Python Mistral depuis Next.js
 */

export interface OrientationData {
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

export interface MistralResponse {
  success: boolean
  recommendation?: string
  error?: string
}

/**
 * Appelle le script Python Mistral pour générer une recommandation
 */
export async function callMistralOrientation(data: OrientationData): Promise<string> {
  try {
    // En production, ceci appellerait votre endpoint Django/FastAPI
    // qui exécute le script Python
    const response = await fetch("/api/orientation/mistral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`)
    }

    const result: MistralResponse = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Erreur inconnue")
    }

    return result.recommendation || "Aucune recommandation générée"
  } catch (error) {
    console.error("Erreur appel Mistral:", error)
    throw error
  }
}

/**
 * Valide les données avant envoi à Mistral
 */
export function validateOrientationData(data: OrientationData): string[] {
  const errors: string[] = []

  if (!data.age || data.age < 12 || data.age > 25) {
    errors.push("L'âge doit être entre 12 et 25 ans")
  }

  if (!data.localite) errors.push("La localité est obligatoire")
  if (data.langues.length === 0) errors.push("Au moins une langue est obligatoire")
  if (!data.niveauEtude) errors.push("Le niveau d'étude est obligatoire")
  if (!data.matieresSci) errors.push("Le niveau en sciences est obligatoire")
  if (!data.matieresLitt) errors.push("Le niveau en littérature est obligatoire")
  if (!data.situationActuelle) errors.push("La situation actuelle est obligatoire")
  if (data.matieresPref.length === 0) errors.push("Au moins une matière préférée est obligatoire")
  if (data.activitesPref.length === 0) errors.push("Au moins une activité préférée est obligatoire")
  if (!data.travailPref) errors.push("La préférence de travail est obligatoire")
  if (data.aimerFaire.length === 0) errors.push("Au moins une chose aimée est obligatoire")
  if (!data.typeTravail) errors.push("Le type de travail est obligatoire")
  if (!data.metierEnTete) errors.push("L'indication métier en tête est obligatoire")
  if (!data.motivation) errors.push("La motivation est obligatoire")
  if (!data.entrepreneuriat) errors.push("L'intérêt entrepreneuriat est obligatoire")
  if (!data.smartphone) errors.push("L'accès smartphone est obligatoire")
  if (!data.internet) errors.push("L'accès internet est obligatoire")
  if (!data.activiteParents) errors.push("L'activité des parents est obligatoire")
  if (data.apprentissage.length === 0) errors.push("Au moins un style d'apprentissage est obligatoire")

  if (data.metierEnTete === "Oui" && !data.metierPrecis.trim()) {
    errors.push("Veuillez préciser le métier")
  }

  return errors
}

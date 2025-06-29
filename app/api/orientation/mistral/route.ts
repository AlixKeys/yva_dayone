import { type NextRequest, NextResponse } from "next/server"

interface OrientationData {
  Âge: number
  Sexe: string
  Localité: string
  "Langue parlée": string[]
  "Niveau d'étude actuel": string
  "Filière suivie": string
  "Matières scientifiques": string
  "Matières littéraires": string
  "Tu es actuellement": string
  "Matière(s) préférée(s)": string[]
  "Activité(s) préférée(s)": string[]
  "Préfères-tu travailler": string
  "Tu aimes": string[]
  "Type de travail qui t'attire": string
  "As-tu un métier en tête ?": string
  Métier?: string
  "Tu veux": string
  "Es-tu intéressé(e) par l'entrepreneuriat ?": string
  "Accès à un smartphone": string
  "Accès internet régulier ?": string
  "Activité des parents": string
  "Tu apprends mieux en": string[]
  "As-tu déjà une compétence ?": string
}

export async function POST(request: NextRequest) {
  try {
    const data: OrientationData = await request.json()

    console.log("Données reçues pour orientation:", data)

    // Appel au backend Django
    const djangoResponse = await fetch(
      `${process.env.DJANGO_API_URL || "http://localhost:8000"}/api/auth/orientation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DJANGO_API_KEY || ""}`,
        },
        body: JSON.stringify(data),
      },
    )

    if (!djangoResponse.ok) {
      const errorText = await djangoResponse.text()
      console.error("Erreur Django:", errorText)
      throw new Error(`Erreur Django: ${djangoResponse.status}`)
    }

    const result = await djangoResponse.json()

    return NextResponse.json({
      success: true,
      recommendation: result.recommendation || result.message || "Recommandation générée avec succès",
    })
  } catch (error: any) {
    console.error("Erreur API orientation:", error)

    // Fallback avec recommandation basique si Django/Mistral échoue
    const fallbackRecommendation = `🎯 **Recommandation YVA**

Merci d'avoir rempli le questionnaire d'orientation ! 

**📚 Prochaines étapes recommandées :**
✅ Explorez nos mini-formations sur le dashboard YVA
✅ Renforcez vos compétences dans vos matières préférées
✅ Découvrez les opportunités professionnelles au Togo

**💡 Conseil :**
Votre profil montre un potentiel intéressant. Continuez à développer vos compétences avec YVA !

*Note : Service temporairement en mode simplifié. La recommandation complète sera bientôt disponible.*`

    return NextResponse.json({
      success: true,
      recommendation: fallbackRecommendation,
    })
  }
}

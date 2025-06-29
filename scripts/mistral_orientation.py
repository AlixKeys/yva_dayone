#!/usr/bin/env python3
"""
Script Python pour l'orientation YVA utilisant Mistral AI
Ce script reçoit les données du formulaire et retourne une recommandation personnalisée
"""

import json
import sys
import os
import traceback

# Configuration de la clé API Mistral
MISTRAL_API_KEY = "N3MTpD4hcWN560kPstGLNBxRdMBKyTXf"

def generate_recommendation(user_data):
    """
    Génère une recommandation d'orientation basée sur les données utilisateur
    """
    try:
        # Import de Mistral (avec gestion d'erreur si pas installé)
        try:
            from mistralai import Mistral
        except ImportError:
            # Fallback si Mistral n'est pas installé - simulation pour la démo
            return generate_fallback_recommendation(user_data)
        
        # Création du client Mistral
        client = Mistral(api_key=MISTRAL_API_KEY)
        
        # Construction du prompt système adapté au contexte togolais
        prompt = f"""
Tu es YVA, un assistant virtuel spécialisé dans l'orientation scolaire et professionnelle pour les jeunes Togolais âgés de 12 à 25 ans. 

Ton rôle est de fournir des recommandations personnalisées, motivantes et adaptées aux réalités du Togo, en tenant compte :
- Des filières scolaires togolaises (Série D, C, L, F)
- Des métiers locaux et opportunités au Togo
- Des contraintes géographiques et socio-économiques
- Des ressources disponibles (accès internet, smartphone)
- Du contexte familial et culturel

Données de l'utilisateur :
{json.dumps(user_data, indent=2, ensure_ascii=False)}

Fournis une recommandation structurée qui inclut :

1. **🎓 Orientation scolaire recommandée** : Quelle filière/série choisir et pourquoi
2. **💼 Métiers adaptés** : 3-4 métiers concrets correspondant au profil
3. **🌟 Justification** : Pourquoi ces recommandations basées sur les réponses
4. **📚 Prochaines étapes** : Actions concrètes avec YVA (mini-formations)
5. **💡 Conseil spécial** : Un conseil personnalisé selon le contexte

Réponds en français, avec un ton motivant, bienveillant et adapté à un jeune togolais. 
Évite les généralités et sois spécifique au contexte togolais.
Utilise des emojis pour rendre la réponse plus engageante.
"""

        # Appel à l'API Mistral
        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {
                    "role": "system", 
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1500
        )
        
        # Extraction de la recommandation
        recommendation = response.choices[0].message.content
        
        return {
            "success": True,
            "recommendation": recommendation
        }
        
    except Exception as e:
        # Log l'erreur pour le débogage
        error_msg = f"Erreur Mistral API: {str(e)}"
        print(f"ERROR: {error_msg}", file=sys.stderr)
        
        # Retourner une recommandation de fallback
        return generate_fallback_recommendation(user_data)

def generate_fallback_recommendation(user_data):
    """
    Génère une recommandation de base si Mistral n'est pas disponible
    """
    try:
        age = user_data.get('age', 0)
        niveau = user_data.get('niveauEtude', '')
        matieres_sci = user_data.get('matieresSci', '')
        matieres_litt = user_data.get('matieresLitt', '')
        matieres_pref = user_data.get('matieresPref', [])
        aimer_faire = user_data.get('aimerFaire', [])
        localite = user_data.get('localite', '')
        entrepreneuriat = user_data.get('entrepreneuriat', '')
        
        # Logique de recommandation basique
        if matieres_sci == "Élevé":
            orientation = "Série D (Sciences expérimentales)"
            metiers = ["Médecin", "Ingénieur", "Pharmacien", "Vétérinaire"]
        elif matieres_litt == "Élevé":
            orientation = "Série L (Littéraire)"
            metiers = ["Professeur", "Journaliste", "Avocat", "Traducteur"]
        else:
            orientation = "Série C (Mathématiques)"
            metiers = ["Comptable", "Informaticien", "Banquier", "Statisticien"]
        
        # Ajustement selon les préférences
        if "Soigner" in aimer_faire:
            metiers = ["Médecin", "Infirmier", "Pharmacien", "Kinésithérapeute"]
        elif "Enseigner" in aimer_faire:
            metiers = ["Professeur", "Formateur", "Éducateur", "Directeur d'école"]
        elif "Créer" in aimer_faire:
            metiers = ["Designer", "Architecte", "Artiste", "Développeur"]
        
        recommendation = f"""🎯 **Recommandation personnalisée YVA**

Bonjour ! Basé sur votre profil, voici ma recommandation :

**🎓 Orientation scolaire recommandée :**
{orientation}

**💼 Métiers adaptés à votre profil :**
{chr(10).join([f"• {metier}" for metier in metiers[:4]])}

**🌟 Pourquoi cette recommandation ?**
Vos compétences en {matieres_sci.lower() if matieres_sci == "Élevé" else "littérature" if matieres_litt == "Élevé" else "mathématiques"} et votre intérêt pour {", ".join(matieres_pref[:2]) if matieres_pref else "les études"} montrent une affinité naturelle pour ce domaine.

**📚 Prochaines étapes avec YVA :**
✅ Explorez nos mini-formations en {matieres_pref[0] if matieres_pref else "sciences"}
✅ Renforcez vos compétences avec nos modules pratiques
✅ Découvrez les opportunités au Togo dans votre région ({localite})

**💡 Conseil spécial :**
{f"Votre intérêt pour l'entrepreneuriat est un atout ! Considérez des formations en gestion d'entreprise." if entrepreneuriat == "Oui" else "N'hésitez pas à explorer l'entrepreneuriat, c'est une excellente voie au Togo !"}

Bonne chance dans votre parcours ! 🚀"""

        return {
            "success": True,
            "recommendation": recommendation
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": f"Erreur lors de la génération de la recommandation de base : {str(e)}"
        }

def main():
    """
    Fonction principale du script
    """
    try:
        # Lecture des données depuis stdin
        input_data = sys.stdin.read().strip()
        
        if not input_data:
            raise ValueError("Aucune donnée reçue")
        
        # Parsing des données JSON
        user_data = json.loads(input_data)
        
        # Génération de la recommandation
        result = generate_recommendation(user_data)
        
        # Retour du résultat en JSON
        print(json.dumps(result, ensure_ascii=False, indent=2))
        
    except json.JSONDecodeError as e:
        error_result = {
            "success": False,
            "error": f"Erreur de format JSON : {str(e)}"
        }
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)
        
    except Exception as e:
        error_result = {
            "success": False,
            "error": f"Erreur inattendue : {str(e)}"
        }
        print(json.dumps(error_result, ensure_ascii=False))
        print(f"TRACEBACK: {traceback.format_exc()}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()

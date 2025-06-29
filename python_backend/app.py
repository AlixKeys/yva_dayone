from flask import Flask, request, jsonify
from flask_cors import CORS
from mistralai import Mistral
import os
import time
from dotenv import load_dotenv
load_dotenv()


# Charger la clé API depuis une variable d'environnement
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

app = Flask(__name__)
CORS(app)  # Autorise les appels depuis Next.js

# Fonction de génération de recommandation
def generate_recommendation(age, sexe, localite, langues, niveau_etude, filiere, matieres_scientifiques, matieres_litteraires,
                           statut, matieres_preferees, activites_preferees, travail_preference, aimes, type_travail,
                           metier_en_tete, metier, objectif, entrepreneuriat, smartphone, internet, activite_parents,
                           apprentissage, competence_existante):
    try:
        user_data = {
            "Âge": age,
            "Sexe": sexe,
            "Localité": localite,
            "Langue parlée": ", ".join(langues) if langues else "Aucune",
            "Niveau d’étude actuel": niveau_etude,
            "Filière suivie": filiere,
            "Matières scientifiques": matieres_scientifiques,
            "Matières littéraires": matieres_litteraires,
            "Tu es actuellement": statut,
            "Matière(s) préférée(s)": ", ".join(matieres_preferees) if matieres_preferees else "Aucune",
            "Activité(s) préférée(s)": ", ".join(activites_preferees) if activites_preferees else "Aucune",
            "Préfères-tu travailler": travail_preference,
            "Tu aimes": ", ".join(aimes) if aimes else "Aucune",
            "Type de travail qui t’attire": type_travail,
            "As-tu un métier en tête ?": metier_en_tete,
            "Métier": metier if metier_en_tete == "Oui" else "",
            "Tu veux": objectif,
            "Es-tu intéressé(e) par l’entrepreneuriat ?": entrepreneuriat,
            "Accès à un smartphone": smartphone,
            "Accès internet régulier ?": internet,
            "Activité des parents": activite_parents,
            "Tu apprends mieux en": ", ".join(apprentissage) if apprentissage else "Aucune",
            "As-tu déjà une compétence ?": competence_existante or "Aucune"
        }

prompt = f"""
Tu es YVA, un assistant virtuel pour les jeunes Togolais de 12 à 25 ans. Ta mission est de leur proposer une orientation scolaire ou professionnelle **ultra-contextualisée au Togo uniquement**.

🎯 Consignes claires :
- Réponds **en français**, de manière **structurée, bien lisible**.
- Utilise **uniquement** des **filières, métiers, institutions, formations, contextes et ressources disponibles au Togo**.
- Propose **3 mini-formations ou actions concrètes locales** (ex: ANPE Togo, Institut National, artisanat local, appui communal, dispositifs togolais...).
- Le ton doit être **bienveillant, accessible, motivant et adapté aux réalités locales** (accès Internet limité, environnement rural, etc.).
- Ne propose **aucun service étranger, ni école internationale, ni plateforme non disponible au Togo.**
- Termine par **une phrase de motivation locale**.

Voici les données du jeune :
{user_data}

🧠 Structure ta réponse comme ceci :

1. **Profil résumé**
(3-4 lignes pour décrire la personne)

2. **Suggestion de filière ou métier**
(Utilise un mot en gras et explique le lien avec ses réponses)

3. **Pourquoi ce choix**
(Analyse brève des réponses cohérentes)

4. **Mini-formations ou services disponibles au Togo**
(3 suggestions locales, pratiques et accessibles)

5. **Message de motivation**
(1 phrase inspirante en lien avec la jeunesse togolaise)

Sois bref, efficace et **100 % ancré dans le Togo**.
"""
Tu es YVA, un assistant virtuel pour les jeunes Togolais (12-25 ans). Réponds en français, avec un ton motivant, clair, et structuré. Tiens compte des réalités locales (ex : filières scolaires comme la série D, métiers comme agriculture ou commerce, accès limité à Internet...).

Voici les informations du jeune : {user_data}

Génère une recommandation dans ce format :

1. **Profil du jeune** : (Résumé rapide des données utiles)
2. **Filière ou métier recommandé(e)** : (avec une explication adaptée)
3. **Pourquoi ce choix ?** : (arguments liés à ses réponses)
4. **Mini-formations YVA proposées** : (3 courtes suggestions adaptées à son profil)
5. **Mot de motivation** : (phrase inspirante, simple et locale)

Évite les phrases longues ou trop générales. Sois chaleureux, accessible, et motivant.        """

        client = Mistral(api_key=MISTRAL_API_KEY)
        start_time = time.time()
        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[{"role": "system", "content": prompt}]
        )
        elapsed_time = time.time() - start_time
        if elapsed_time > 30:
            return "Erreur : Délai d'attente dépassé."
        return response.choices[0].message.content
    except Exception as e:
        return f"Erreur : {str(e)}"

@app.route("/api/orientation", methods=["POST"])
def orientation():
    data = request.json
    try:
        result = generate_recommendation(*data["data"])
        return jsonify({"data": [result]})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=7860)

from flask import Flask, request, jsonify
from flask_cors import CORS
from mistralai import Mistral
import os
import time
from dotenv import load_dotenv

load_dotenv()

MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

app = Flask(__name__)
CORS(app)


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
Tu es YVA, un assistant virtuel pour les jeunes Togolais de 12 à 25 ans. Ta mission est de leur proposer une orientation scolaire ou professionnelle ultra-contextualisée au Togo uniquement.

Consignes importantes :
- Réponds en français, de manière structurée, claire et bien lisible.
- Utilise uniquement des filières, métiers, institutions, formations et ressources disponibles au Togo.
- Quand tu proposes des formations, commence toujours par suggérer les mini-formations proposées par YVA dans le domaine recommandé. C’est la priorité. Ensuite, tu peux compléter avec d'autres alternatives locales disponibles au Togo (exemple : ANPE Togo, centres de formation, chambres de métiers, dispositifs communaux...).
- Le ton doit être bienveillant, motivant, simple et adapté aux réalités locales (connexion Internet limitée, zones rurales, contexte économique togolais...).
- Aucun service étranger, aucune école internationale, aucune plateforme non disponible au Togo. Jamais.
- Termine par une phrase de motivation courte, percutante et liée à la jeunesse togolaise.

Voici les données du jeune :
{user_data}

Structure ta réponse de la manière suivante :

1. Profil résumé
Décris le jeune en 3 ou 4 phrases : qui il ou elle est, ses préférences, ses forces et son contexte.

2. Suggestion de filière ou métier
Propose un métier ou une filière (avec un mot en gras) qui correspond à son profil, avec une explication claire du lien avec ses réponses.

3. Pourquoi ce choix
Explique de façon simple et directe pourquoi ce choix est pertinent pour lui ou elle, en te basant sur ses réponses et son contexte.

4. Mini-formations ou services disponibles au Togo
- Commence toujours par les mini-formations proposées par YVA dans le domaine recommandé.
- Ensuite, propose deux autres alternatives locales accessibles au Togo, comme des centres de formation professionnelle, des dispositifs gouvernementaux (ANPE, chambres de métiers, appui communal, associations locales...).
- Les suggestions doivent être pratiques, accessibles, réalistes et faisables au Togo, en tenant compte de l’accès au smartphone, à Internet ou aux formations en présentiel.

5. Message de motivation
Termine avec une phrase motivante, simple, chaleureuse et ancrée dans le contexte de la jeunesse togolaise.

Important : Sois bref, efficace, motivant et 100 % ancré dans le Togo.
"""




        client = Mistral(api_key=MISTRAL_API_KEY)
        start_time = time.time()
        response = client.chat.complete(
            model="mistral-large-latest",
            messages=[{"role": "user", "content": prompt}]
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

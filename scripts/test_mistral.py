#!/usr/bin/env python3
"""
Script de test pour vérifier le fonctionnement de mistral_orientation.py
"""

import json
import subprocess
import sys
import os

def test_mistral_script():
    """
    Teste le script mistral_orientation.py avec des données d'exemple
    """
    
    # Données de test
    test_data = {
        "age": 18,
        "sexe": "Homme",
        "localite": "Lomé",
        "langues": ["Français", "Ewe"],
        "niveauEtude": "Lycée (Terminale)",
        "filiere": "Série D",
        "matieresSci": "Élevé",
        "matieresLitt": "Moyen",
        "situationActuelle": "En cours",
        "matieresPref": ["Maths", "Physique"],
        "activitesPref": ["Bricoler", "Coder"],
        "travailPref": "En équipe",
        "aimerFaire": ["Créer", "Réparer"],
        "typeTravail": "Fixe",
        "metierEnTete": "Oui",
        "metierPrecis": "Ingénieur informatique",
        "motivation": "Être utile à ma communauté",
        "entrepreneuriat": "Oui",
        "smartphone": "Oui",
        "internet": "Fréquent",
        "activiteParents": "Commerce",
        "apprentissage": ["Vidéo", "Exercice pratique"],
        "competenceExist": "Programmation Python basique"
    }
    
    try:
        print("🧪 Test du script Mistral AI...")
        print("=" * 50)
        
        # Chemin vers le script
        script_path = os.path.join(os.path.dirname(__file__), 'mistral_orientation.py')
        
        # Exécution du script
        result = subprocess.run(
            ['python3', script_path],
            input=json.dumps(test_data, ensure_ascii=False),
            text=True,
            capture_output=True,
            timeout=30
        )
        
        print(f"Code de retour: {result.returncode}")
        
        if result.returncode == 0:
            print("✅ Script exécuté avec succès!")
            print("\n📄 Sortie:")
            print("-" * 30)
            
            try:
                response = json.loads(result.stdout)
                print(json.dumps(response, ensure_ascii=False, indent=2))
                
                if response.get('success'):
                    print("\n🎉 Recommandation générée avec succès!")
                else:
                    print(f"\n❌ Erreur dans la recommandation: {response.get('error')}")
                    
            except json.JSONDecodeError:
                print("❌ Sortie non-JSON:")
                print(result.stdout)
        else:
            print("❌ Erreur lors de l'exécution du script")
            print(f"Stderr: {result.stderr}")
            print(f"Stdout: {result.stdout}")
            
    except subprocess.TimeoutExpired:
        print("⏰ Timeout - Le script a pris trop de temps")
    except Exception as e:
        print(f"❌ Erreur inattendue: {str(e)}")

def test_json_parsing():
    """
    Teste le parsing JSON avec différents formats
    """
    print("\n🔍 Test du parsing JSON...")
    print("=" * 30)
    
    test_cases = [
        '{"test": "valeur"}',
        '{"success": true, "recommendation": "Test"}',
        'invalid json',
        ''
    ]
    
    for i, test_case in enumerate(test_cases):
        try:
            result = json.loads(test_case)
            print(f"✅ Test {i+1}: JSON valide - {result}")
        except json.JSONDecodeError as e:
            print(f"❌ Test {i+1}: JSON invalide - {e}")

if __name__ == "__main__":
    test_mistral_script()
    test_json_parsing()

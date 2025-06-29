# YVA - Your Virtual Aide

YVA est un assistant virtuel intelligent conçu pour accompagner les jeunes Togolais de 12 à 25 ans dans leur développement personnel et professionnel, utilisant l'API Mistral AI.

## 🛠️ Technologies utilisées

- **Frontend** : Next.js avec TypeScript
- **Backend** : Python avec Flask
- **IA** : Mistral AI (clé API : `MISTRAL_API_KEY`)

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Python 3.9+ et pip
- PostgreSQL 13+ (non intégré dans le projet, mais instructions d'installation fournies)

### Configuration Frontend

1. **Cloner le projet et installer Next.js**
```bash
git clone <repository-url>
cd yva-frontend
npm install next
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

### Configuration Backend

1. **Cloner le projet et créer un environnement virtuel**
```bash
cd yva-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
```

2. **Installer les dépendances Python**
```bash
pip install flask flask-cors mistralai python-dotenv
```

Les imports utilisés dans le backend :
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from mistralai import Mistral
import os
import time
from dotenv import load_dotenv
```

3. **Configurer la clé API Mistral AI**
Créer un fichier `.env` dans `yva-backend` avec :
```env
MISTRAL_API_KEY=N3MTpD4hcWN560kPstGLNBxRdMBKyTXf
```

### Installation de PostgreSQL (optionnel, non intégré)

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS avec Homebrew
brew install postgresql
brew services start postgresql

# Windows
# Télécharger depuis https://www.postgresql.org/download/windows/
```
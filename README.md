# YVA - Your Virtual Aide

YVA est un assistant virtuel intelligent conçu pour accompagner les jeunes Togolais de 12 à 25 ans dans leur développement personnel et professionnel.

## 🚀 Fonctionnalités

- **Authentification complète** : Inscription, connexion, réinitialisation de mot de passe
- **Connexion Google** : Authentification via Google OAuth
- **Vérification d'email** : Système de confirmation par email
- **Interface moderne** : Design responsive avec thème bleu nuit
- **Sécurité renforcée** : JWT tokens, validation des données, protection CORS

## 🛠️ Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants
- **Lucide React** pour les icônes

### Backend
- **Django 4.2** avec Django REST Framework
- **PostgreSQL** pour la base de données
- **JWT** pour l'authentification
- **Resend** pour l'envoi d'emails
- **Google OAuth** pour la connexion sociale

## 📦 Installation

### Prérequis
- Node.js 18+ et npm/yarn
- Python 3.9+ et pip
- PostgreSQL 13+
- Compte Resend (pour les emails)
- Compte Google Cloud (pour OAuth)

### Configuration Frontend

1. **Cloner le projet et installer les dépendances**
\`\`\`bash
git clone <repository-url>
cd yva-frontend
npm install
\`\`\`

2. **Configurer les variables d'environnement**
Créer un fichier `.env.local` :
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`

3. **Lancer le serveur de développement**
\`\`\`bash
npm run dev
\`\`\`

Le frontend sera accessible sur `http://localhost:3000`

### Configuration Backend

1. **Créer un environnement virtuel Python**
\`\`\`bash
cd yva-backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
\`\`\`

2. **Installer les dépendances**
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. **Configurer les variables d'environnement**
Créer un fichier `.env` :
\`\`\`env
# Django
SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_NAME=yva_db
DB_USER=postgres
DB_PASSWORD=your-db-password
DB_HOST=localhost
DB_PORT=5432

# Email (Resend)
RESEND_API_KEY=re_your-resend-api-key

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
\`\`\`

4. **Configurer la base de données**
\`\`\`bash
# Créer la base de données PostgreSQL
createdb yva_db

# Appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser
\`\`\`

5. **Lancer le serveur Django**
\`\`\`bash
python manage.py runserver
\`\`\`

Le backend sera accessible sur `http://localhost:8000`

## 🔧 Configuration des services externes

### 1. Configuration Resend (Email)

1. Créer un compte sur [resend.com](https://resend.com)
2. Obtenir votre clé API dans le dashboard
3. Ajouter la clé dans votre fichier `.env` :
\`\`\`env
RESEND_API_KEY=re_your-api-key-here
\`\`\`

4. **Vérifier votre domaine** (pour la production) :
   - Ajouter votre domaine dans Resend
   - Configurer les enregistrements DNS
   - Utiliser `noreply@votre-domaine.com` comme expéditeur

### 2. Configuration Google OAuth

1. **Créer un projet Google Cloud** :
   - Aller sur [Google Cloud Console](https://console.cloud.google.com)
   - Créer un nouveau projet ou sélectionner un existant

2. **Activer l'API Google+ et OAuth** :
   - Dans "APIs & Services" > "Library"
   - Rechercher et activer "Google+ API"

3. **Créer des identifiants OAuth** :
   - "APIs & Services" > "Credentials"
   - "Create Credentials" > "OAuth 2.0 Client IDs"
   - Type d'application : "Web application"
   - Origines JavaScript autorisées :
     - `http://localhost:3000` (développement)
     - `https://votre-domaine.com` (production)
   - URIs de redirection autorisées :
     - `http://localhost:3000/auth/callback`
     - `https://votre-domaine.com/auth/callback`

4. **Configurer les variables d'environnement** :
\`\`\`env
GOOGLE_CLIENT_ID=your-client-id.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
\`\`\`

### 3. Configuration de la base de données PostgreSQL

1. **Installation PostgreSQL** :
\`\`\`bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS avec Homebrew
brew install postgresql
brew services start postgresql

# Windows
# Télécharger depuis https://www.postgresql.org/download/windows/
\`\`\`

2. **Créer la base de données** :
\`\`\`bash
sudo -u postgres psql
CREATE DATABASE yva_db;
CREATE USER yva_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE yva_db TO yva_user;
\q
\`\`\`

## 🚀 Déploiement

### Frontend (Vercel)

1. **Connecter votre repository GitHub à Vercel**
2. **Configurer les variables d'environnement** dans Vercel :
\`\`\`env
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
\`\`\`
3. **Déployer** : Vercel déploiera automatiquement à chaque push

### Backend (Heroku)

1. **Installer Heroku CLI** et se connecter :
\`\`\`bash
heroku login
\`\`\`

2. **Créer une application Heroku** :
\`\`\`bash
heroku create yva-backend
\`\`\`

3. **Ajouter PostgreSQL** :
\`\`\`bash
heroku addons:create heroku-postgresql:hobby-dev
\`\`\`

4. **Configurer les variables d'environnement** :
\`\`\`bash
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False
heroku config:set RESEND_API_KEY=your-resend-key
heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-google-secret
heroku config:set FRONTEND_URL=https://your-frontend-url.vercel.app
\`\`\`

5. **Déployer** :
\`\`\`bash
git push heroku main
heroku run python manage.py migrate
\`\`\`

## 📱 Utilisation

### Pages disponibles

- **`/`** : Page d'accueil avec présentation de YVA
- **`/login`** : Page de connexion
- **`/signup`** : Page d'inscription
- **`/forgot-password`** : Réinitialisation de mot de passe

### API Endpoints

- **`POST /api/auth/signup`** : Inscription d'un nouvel utilisateur
- **`POST /api/auth/login`** : Connexion utilisateur
- **`POST /api/auth/google-auth`** : Authentification Google
- **`POST /api/auth/password-reset`** : Demande de réinitialisation
- **`GET /api/auth/verify-email/<token>`** : Vérification d'email

## 🔒 Sécurité

- **Hachage des mots de passe** avec Django's `make_password`
- **Tokens JWT** avec expiration automatique
- **Validation des données** côté frontend et backend
- **Protection CORS** configurée
- **HTTPS** en production
- **Variables d'environnement** pour les clés sensibles

## 🎨 Personnalisation

### Couleurs du thème
\`\`\`css
/* Couleurs principales */
--blue-night: #1E3A8A;
--blue-dark: #172554;
--blue-light: #60A5FA;
--blue-button: #2563EB;
--blue-hover: #1D4ED8;
--text-light: #DBEAFE;
\`\`\`

### Modification des emails
Les templates d'email se trouvent dans `scripts/django_utils.py`. Vous pouvez personnaliser :
- Le design HTML
- Les couleurs
- Le contenu des messages
- Le logo et branding

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- **Email** : support@yva-togo.com
- **Issues GitHub** : [Créer une issue](https://github.com/your-repo/issues)

---

**YVA - Votre compagnon pour un avenir meilleur** 🌟

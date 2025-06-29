# YVA Dashboard - Guide Complet

## 🚀 Présentation

YVA (Your Virtual Aide) est une plateforme d'accompagnement virtuel dédiée aux jeunes Togolais (12-25 ans). Cette interface dashboard offre une expérience moderne et intuitive pour accéder aux services d'orientation, formation, génération de documents et soutien moral.

## ✨ Fonctionnalités

### 🏠 Page d'accueil (`/`)
- **Design moderne** avec animations Framer Motion
- **Section hero** avec statistiques en temps réel
- **Présentation des fonctionnalités** avec badges interactifs
- **Témoignages utilisateurs** avec système de notation
- **Navigation responsive** avec menu mobile
- **Call-to-action** optimisés pour la conversion

### 🔐 Système d'authentification
- **Page de connexion** (`/login`) avec validation complète
- **Page d'inscription** (`/signup`) avec confirmation de mot de passe
- **Mot de passe oublié** (`/forgot-password`) avec récupération
- **Comptes de test** intégrés pour développement

### 📊 Dashboard principal (`/dashboard`)
- **Header sticky** avec logo, nom utilisateur et avatar DiceBear
- **Navigation** vers dashboard et profil
- **4 cartes fonctionnalités** avec animations hover :
  - 🧭 **Orientation scolaire et professionnelle**
  - 📚 **Mini-formations** adaptées au marché local
  - 📄 **Génération** de CV, lettres de motivation, pitchs
  - ❤️ **Motivation** et soutien moral personnalisé
- **Statistiques globales** : utilisateurs, formations, satisfaction
- **Section motivation** avec appel à l'action

### 👤 Page profil (`/profile`)
- **Informations personnelles** modifiables
- **Avatar généré automatiquement** via DiceBear API
- **Mode édition** avec sauvegarde/annulation
- **Informations du compte** avec date d'inscription
- **Actions avancées** : changer mot de passe, télécharger données

## 🎨 Design System

### Couleurs principales
- **Bleu primaire** : `#2563EB` (boutons, liens)
- **Bleu secondaire** : `#60A5FA` (textes highlights)
- **Arrière-plan** : `#0F172A` (slate-900)
- **Cartes** : `#1E293B` (slate-800)
- **Texte** : `#DBEAFE` (blue-100)

### Animations
- **Framer Motion** pour transitions fluides
- **Fade-in progressif** des cartes
- **Hover effects** avec scale et shadow
- **Scroll animations** avec `whileInView`

### Responsive Design
- **Mobile-first** avec breakpoints Tailwind
- **Navigation adaptative** avec menu hamburger
- **Grilles responsives** : 1→2→4 colonnes
- **Typographie scalable** selon l'écran

## 🔧 Configuration technique

### Prérequis
\`\`\`bash
Node.js 18+ 
npm ou yarn
\`\`\`

### Installation
\`\`\`bash
# Clone du projet
git clone [repository-url]
cd yva-website

# Installation des dépendances
npm install

# Lancement en développement
npm run dev
\`\`\`

### Packages principaux
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling utilitaire
- **Framer Motion** - Animations
- **Radix UI** - Composants accessibles
- **Lucide React** - Icônes modernes

## 🔑 Comptes de test

### Administrateur
- **Email** : `admin@yva.com`
- **Mot de passe** : `admin`
- **Rôle** : Accès complet, statistiques

### Utilisateur test
- **Email** : `test@yva.com`
- **Mot de passe** : `test1234`
- **Rôle** : Utilisateur standard

## 🌐 API et Intégrations

### Avatar DiceBear
- **URL** : `https://api.dicebear.com/9.x/identicon/svg`
- **Paramètres** : seed (nom utilisateur), backgroundColor, taille
- **Usage** : Génération automatique d'avatars uniques

### Structure API (à implémenter)
\`\`\`typescript
// Authentification
POST /api/auth/login
POST /api/auth/signup
POST /api/auth/logout
GET  /api/auth/user

// Utilisateurs
GET  /api/users/profile
PUT  /api/users/profile
POST /api/users/change-password

// Fonctionnalités YVA
GET  /api/orientation/tests
GET  /api/formations/available
POST /api/generation/cv
GET  /api/motivation/daily
\`\`\`

## 📱 Pages disponibles

| Route | Description | Statut |
|-------|-------------|--------|
| `/` | Page d'accueil | ✅ Complète |
| `/login` | Connexion | ✅ Complète |
| `/signup` | Inscription | ✅ Complète |
| `/forgot-password` | Récupération MDP | ✅ Complète |
| `/dashboard` | Tableau de bord | ✅ Complète |
| `/profile` | Profil utilisateur | ✅ Complète |
| `/orientation` | Tests d'orientation | 🚧 À développer |
| `/formations` | Mini-formations | 🚧 À développer |
| `/generation` | Génération docs | 🚧 À développer |
| `/motivation` | Soutien moral | 🚧 À développer |

## 🚀 Déploiement

### Vercel (recommandé)
\`\`\`bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel

# Production
vercel --prod
\`\`\`

### Variables d'environnement
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_DICEBEAR_API=https://api.dicebear.com/9.x/identicon/svg
\`\`\`

## 🔄 Prochaines étapes

### Phase 1 - Fonctionnalités core
- [ ] Tests d'orientation personnalisés
- [ ] Catalogue de mini-formations
- [ ] Générateur de CV intelligent
- [ ] Chat de soutien moral

### Phase 2 - Améliorations
- [ ] Notifications push
- [ ] Système de badges/récompenses
- [ ] Communauté utilisateurs
- [ ] Analytics avancées

### Phase 3 - Intégration
- [ ] API Django complète
- [ ] Base de données PostgreSQL
- [ ] Authentification JWT
- [ ] Services Cloud (AWS/GCP)

## 📞 Support

Pour toute question ou problème :
- **Email** : support@yva.tg
- **Documentation** : [docs.yva.tg]
- **Issues GitHub** : [github.com/yva/issues]

---

**YVA** - Votre compagnon pour un avenir meilleur 🇹🇬

# Orientation YVA - Documentation

## Structure des pages d'orientation

Le système d'orientation YVA est organisé en plusieurs pages pour offrir une expérience utilisateur fluide :

### 📁 Structure des fichiers

\`\`\`
app/orientation/
├── page.tsx                    # Page principale de choix d'orientation
├── scolaire/
│   └── page.tsx               # Orientation scolaire complète
└── professionnelle/
    └── page.tsx               # Orientation professionnelle (en construction)
\`\`\`

### 🔄 Flux de navigation

1. **Dashboard** → Clic sur "Explorer" de la carte "Orientation scolaire et professionnelle"
2. **Page principale** (`/orientation`) → Choix entre orientation scolaire et professionnelle
3. **Orientation scolaire** (`/orientation/scolaire`) → Flux complet d'évaluation
4. **Orientation professionnelle** (`/orientation/professionnelle`) → Page "en construction"

## Fonctionnalités

### Page principale d'orientation (`/orientation`)

- **Choix visuel** entre deux types d'orientation
- **Cartes interactives** avec effets hover et animations Framer Motion
- **Section informative** sur les avantages de YVA
- **Navigation fluide** vers les sous-pages

### Orientation scolaire (`/orientation/scolaire`)

- **Question initiale** : "Quel métier rêves-tu de faire ?"
- **Évaluation des compétences** pour le métier de médecin (hardcodé)
- **6 compétences évaluées** : Maths, Physique, Chimie, Sciences naturelles, Empathie, Travail d'équipe
- **Feedback personnalisé** basé sur la moyenne des évaluations
- **Recommandations** pour la série D (scientifique)

### Orientation professionnelle (`/orientation/professionnelle`)

- **Page temporaire** "en construction"
- **Liste des fonctionnalités** à venir
- **Redirection** vers l'orientation scolaire ou le dashboard

## Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Lucide React** pour les icônes

### Thème et couleurs
- **Arrière-plan principal** : `#1E3A8A` (bleu nuit)
- **Éléments sombres** : `#172554` (bleu très sombre)
- **Accents** : `#60A5FA` (bleu clair)
- **Texte clair** : `#DBEAFE` (bleu très clair)
- **Boutons** : `#2563EB` (hover: `#1D4ED8`)

### Animations
- **Transitions de page** : fade-in/out avec mouvement vertical
- **Cartes** : scale et fade-in avec délais échelonnés
- **Effets hover** : scale 1.05 et changement de couleur

## Configuration requise

### Dépendances principales
\`\`\`json
{
  "framer-motion": "^10.x.x",
  "lucide-react": "^0.x.x",
  "@radix-ui/react-*": "^1.x.x"
}
\`\`\`

### Polices
- **Inter** importée via Google Fonts
- URL : `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap`

### Avatar utilisateur
- **DiceBear API** : `https://api.dicebear.com/9.x/identicon/svg`
- Paramètres : `seed={username}&backgroundColor=60A5FA&size=40`

## Authentification

### Gestion utilisateur
- **localStorage** pour la démo (clés : `user`, `access_token`, `refresh_token`)
- **API future** : `GET /api/auth/user` avec credentials
- **Redirection** vers `/login` si non authentifié

### Déconnexion
- Suppression des tokens localStorage
- Redirection vers la page d'accueil

## Responsive Design

### Breakpoints Tailwind
- **Mobile** : par défaut
- **Tablette** : `md:` (768px+)
- **Desktop** : `lg:` (1024px+)

### Adaptations
- **Grilles** : 1 colonne mobile → 2 tablette → 3 desktop
- **Navigation** : textes masqués sur mobile
- **Cartes** : padding et tailles adaptés

## Accessibilité

### Standards WCAG
- **Contrastes** conformes aux recommandations
- **Navigation clavier** complète
- **Labels ARIA** pour tous les éléments interactifs
- **Textes alternatifs** pour les images et avatars

### Éléments accessibles
- **Boutons radio** avec labels cachés mais accessibles
- **Images** avec attributs alt descriptifs
- **Navigation** avec indicateurs visuels et textuels

## Déploiement

### Vercel (recommandé)
1. Connecter le repository GitHub
2. Configuration automatique Next.js
3. Variables d'environnement si nécessaire
4. Déploiement automatique sur push

### Variables d'environnement
\`\`\`env
# API Backend (futur)
NEXT_PUBLIC_API_URL=https://api.yva.tg
API_SECRET_KEY=your_secret_key
\`\`\`

## Développement

### Scripts disponibles
\`\`\`bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Vérification ESLint
\`\`\`

### Structure recommandée
\`\`\`
src/
├── components/      # Composants réutilisables
├── hooks/          # Hooks personnalisés
├── lib/            # Utilitaires et configurations
├── types/          # Types TypeScript
└── app/            # Pages Next.js (App Router)
\`\`\`

## Améliorations futures

### Orientation professionnelle
- **Tests de personnalité** pour identifier les métiers compatibles
- **Base de données** des métiers togolais
- **Témoignages** de professionnels
- **Statistiques** du marché de l'emploi

### Orientation scolaire
- **Autres métiers** avec leurs compétences spécifiques
- **Algorithme** de recommandation plus sophistiqué
- **Graphiques** de visualisation des résultats
- **Historique** des évaluations

### Fonctionnalités générales
- **Sauvegarde** des résultats en base de données
- **Partage** des résultats
- **Export PDF** des recommandations
- **Notifications** de suivi

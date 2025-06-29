# Page d'Orientation Scolaire YVA - Flux Complet

Cette page permet aux jeunes Togolais de choisir entre orientation scolaire et professionnelle, puis d'évaluer leurs compétences pour le métier de médecin avec des recommandations personnalisées pour la série D (scientifique).

## 🎯 Fonctionnalités

### 1. Choix initial d'orientation
- **Orientation scolaire** : Découverte des filières et séries correspondant aux aspirations
- **Orientation professionnelle** : Exploration des métiers et carrières (redirection vers `/orientation/professionnelle`)
- **Interface intuitive** : Cartes cliquables avec icônes et effets hover

### 2. Question sur le métier rêvé (Orientation scolaire)
- Saisie du métier souhaité (hardcodé sur "Médecin" pour la démo)
- Interface de saisie avec validation
- Transition fluide vers l'évaluation des compétences

### 3. Évaluation des compétences spécifiques
Évaluation de **6 compétences clés** pour devenir médecin :

- **Maths** : Maîtrise des concepts mathématiques pour les calculs médicaux
- **Physique** : Compréhension des principes physiques pour les technologies médicales  
- **Chimie** : Connaissances en chimie pour comprendre les médicaments et réactions
- **Sciences naturelles** : Connaissances en biologie pour comprendre le corps humain
- **Degré d'empathie** : Capacité à comprendre et soutenir les patients
- **Travail d'équipe** : Collaboration avec d'autres professionnels de santé

Chaque compétence est évaluée sur **4 niveaux** :
- **Faible** (1 point)
- **Moyen** (2 points)
- **Bon** (3 points)
- **Excellent** (4 points)

### 4. Feedback personnalisé basé sur la moyenne

#### Si moyenne ≥ 3 (Bon/Excellent) :
- ✅ **Message de félicitations**
- 📚 **Validation pour la série D (scientifique)**
- 🎯 **Encouragement vers les mini-formations YVA**
- **Boutons** : "Découvrir les mini-formations" + "Refaire une orientation"

#### Si moyenne < 3 (Faible/Moyen) :
- ⚠️ **Message d'encouragement**
- 📋 **Recommandation série D avec renforcement nécessaire**
- 💪 **Promotion des mini-formations pour les compétences faibles**
- **Boutons** : "Découvrir les mini-formations" + "Refaire une orientation"

## 🛠️ Technologies Utilisées

- **React 18** avec TypeScript
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **Next.js App Router** pour la navigation
- **DiceBear API** pour les avatars
- **Lucide React** pour les icônes

## ⚙️ Configuration

### 1. Installation des dépendances

\`\`\`bash
npm install framer-motion lucide-react
# ou
yarn add framer-motion lucide-react
\`\`\`

### 2. Configuration Tailwind CSS

Les couleurs personnalisées YVA sont utilisées directement :

\`\`\`css
/* Couleurs du thème bleu nuit YVA */
background: #1E3A8A;        /* Arrière-plan principal */
elements: #172554;          /* Éléments plus sombres */
accent: #60A5FA;            /* Couleur d'accent */
text: #DBEAFE;              /* Texte clair */
button: #2563EB;            /* Boutons */
button-hover: #1D4ED8;      /* Boutons hover */
\`\`\`

### 3. Import Google Fonts

La police **Inter** est importée directement dans le composant :

\`\`\`html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
  rel="stylesheet"
/>
\`\`\`

### 4. Configuration API Utilisateur

Pour l'intégration backend, décommentez et configurez l'appel API dans le \`useEffect\` :

\`\`\`typescript
try {
  const response = await fetch('/api/auth/user', {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  
  if (response.ok) {
    const userData = await response.json()
    setUser(userData)
  } else {
    throw new Error('Erreur récupération utilisateur')
  }
} catch (apiError) {
  console.error('Erreur API:', apiError)
  // Fallback sur localStorage si API indisponible
}
\`\`\`

## 📱 Design Responsive

- **Mobile** : Layout en colonne, cartes empilées
- **Tablette** : Grid 2 colonnes pour les choix et niveaux d'évaluation
- **Desktop** : Grid optimisé avec 4 colonnes pour les niveaux
- **Header adaptatif** : Masquage du nom utilisateur sur mobile

## ♿ Accessibilité

- **Contraste WCAG** : Couleurs conformes aux standards
- **Navigation clavier** : Tous les éléments focusables
- **Labels ARIA** : Boutons radio avec descriptions appropriées
- **Screen readers** : Textes alternatifs pour les avatars et icônes
- **Focus visible** : Indicateurs de focus clairs

## 🎨 Animations Framer Motion

### Transitions de page :
\`\`\`typescript
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}
\`\`\`

### Animations de cartes :
\`\`\`typescript
const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
}
\`\`\`

### Effets hover :
- **Scale 1.05** : Agrandissement subtil des cartes
- **Changement de couleur** : Transition vers #2563EB au hover
- **Transitions fluides** : Duration 300ms pour tous les effets

## 🔧 Structure des Données

### Interface User
\`\`\`typescript
interface User {
  id: string
  username: string
  name?: string
  email: string
}
\`\`\`

### Interface CompetenceEvaluation
\`\`\`typescript
interface CompetenceEvaluation {
  id: string
  nom: string
  description: string
  icon: React.ReactNode
  niveau: number // 0-4 (0=non évalué)
}
\`\`\`

## 🚀 Déploiement

### Prérequis
- Node.js 18+
- Next.js 14+
- Tailwind CSS configuré

### Build et déploiement
\`\`\`bash
npm run build
npm run start
\`\`\`

### Déploiement Vercel
1. Connecter le repository GitHub
2. Configuration automatique détectée
3. Variables d'environnement pour l'API backend
4. Déploiement automatique sur push

## 🔗 Navigation

- **Route principale** : \`/orientation/scolaire\`
- **Retour** : \`/dashboard\`
- **Orientation professionnelle** : \`/orientation/professionnelle\`
- **Mini-formations** : \`/dashboard\` (section spécifique)
- **Déconnexion** : Redirection vers \`/\`

## 🔒 Sécurité

- **Authentification requise** : Redirection si non connecté
- **Validation côté client** : Vérification des données
- **Gestion d'erreurs** : Try/catch pour les appels API
- **Protection XSS** : Échappement des données utilisateur

## 📊 Logique Métier

### Calcul de la moyenne :
\`\`\`typescript
const calculerMoyenne = () => {
  const evaluations = competences.filter(comp => comp.niveau > 0)
  if (evaluations.length === 0) return 0
  const total = evaluations.reduce((sum, comp) => sum + comp.niveau, 0)
  return total / evaluations.length
}
\`\`\`

### Détection des compétences faibles :
\`\`\`typescript
const getCompetencesFaibles = () => {
  return competences
    .filter(comp => comp.niveau > 0 && comp.niveau < 3)
    .map(comp => comp.nom)
}
\`\`\`

## 🎯 Objectifs Pédagogiques

- **Choix éclairé** : Distinction claire entre orientation scolaire et professionnelle
- **Orientation précise** : Recommandation série D pour médecin
- **Auto-évaluation** : Prise de conscience des compétences
- **Motivation** : Encouragement vers les mini-formations
- **Accessibilité** : Interface adaptée aux jeunes Togolais
- **Engagement** : Design moderne et interactif

## 🔄 Flux Utilisateur Complet

1. **Choix initial** : Sélection entre orientation scolaire/professionnelle
2. **Question métier** : "Quel métier rêves-tu de faire ?" (si scolaire)
3. **Saisie** : Entrée du métier (hardcodé "Médecin")
4. **Évaluation** : 6 compétences avec 4 niveaux chacune
5. **Calcul** : Moyenne automatique des scores
6. **Feedback** : Message personnalisé selon la moyenne
7. **Action** : Redirection vers mini-formations ou recommencement

## 📈 Métriques de Succès

- **Taux de completion** : Pourcentage d'utilisateurs terminant l'évaluation
- **Choix d'orientation** : Répartition scolaire vs professionnelle
- **Engagement** : Temps passé sur chaque étape
- **Conversion** : Clics vers les mini-formations
- **Satisfaction** : Feedback utilisateur sur l'expérience

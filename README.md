# Nomos - Application d'actualités neutres et accessibles

Nomos est une application innovante pensée pour réconcilier les utilisateurs avec l'information, dans un contexte où les médias traditionnels peinent à convaincre et où les fake news pullulent. L'objectif principal est de proposer un espace neutre, accessible et intuitif pour consulter l'actualité. Nomos invite les étudiants en développement web à imaginer des fonctionnalités interactives et des optimisations pour rendre l'application encore plus attrayante et adaptée aux besoins de ses utilisateurs.

## Technologies utilisées

### Frontend

- **React 19** - Bibliothèque JavaScript pour construire l'interface utilisateur
- **Vite 6** - Outil de build ultrarapide pour le développement moderne
- **Tailwind CSS 4** - Framework CSS utilitaire pour le design responsive
- **ESLint 9** - Outil d'analyse statique pour identifier les problèmes dans le code JavaScript

### Backend

- **Node.js** - Environnement d'exécution JavaScript côté serveur
- **Express 4** - Framework web minimaliste pour Node.js
- **Sequelize 6** - ORM pour Node.js, supportant PostgreSQL et d'autres bases de données
- **PostgreSQL** - Système de gestion de base de données relationnelle avancé
- **SQLite** (pour le développement) - Base de données légère basée sur des fichiers
- **JSON Web Tokens (JWT)** - Pour l'authentification sécurisée
- **bcrypt** - Pour le hashage sécurisé des mots de passe
- **Cloudinary** - Service cloud pour la gestion et l'optimisation des médias
- **Multer** - Middleware pour la gestion des téléchargements de fichiers

## Architecture du projet

Le projet est organisé avec une architecture claire séparant le frontend et le backend :

### Frontend

- Interface utilisateur responsive construite avec React et Tailwind CSS
- Sections principales : Actualités, Pour toi, Profil, Catégories
- Gestion des préférences utilisateur
- Affichage optimisé pour mobile et desktop

### Backend

- API RESTful construite avec Express
- Architecture MVC (Modèle-Vue-Contrôleur)
- Base de données gérée via Sequelize ORM
- Services dédiés pour chaque fonctionnalité
- Système d'authentification sécurisé avec JWT

## Fonctionnalités principales

- **Actualités neutres** : Accès à des informations sans biais
- **Personnalisation** : Contenu adapté aux préférences de l'utilisateur via "Pour toi"
- **Catégorisation** : Organisation des actualités par catégories (Politique, Science, Sport, etc.)
- **Gestion de profil** : Authentification et paramètres utilisateur
- **Réactions** : Interaction avec les articles (likes)
- **Recommandations** : Suggestions d'articles basées sur les préférences

## Déploiement

Le projet est configuré pour être déployé sur Vercel avec des fichiers de configuration spécifiques pour le frontend et le backend.

## Installation et démarrage

### Prérequis

- Node.js (version 18.x recommandée)
- npm ou yarn
- PostgreSQL (pour la production) ou accès à Supabase

### Installation

1. Cloner le dépôt

```bash
git clone https://github.com/paule624/Nomos.git
cd Nomos
```

2. Installer les dépendances du backend

```bash
cd backend
npm install
```

3. Installer les dépendances du frontend

```bash
cd ../frontend
npm install
```

### Configuration

1. Créer un fichier `.env` dans le dossier backend avec les variables appropriées pour la connexion à la base de données et les services tiers

### Démarrage en développement

1. Démarrer le backend

```bash
cd backend
npm run dev
```

2. Démarrer le frontend

```bash
cd frontend
npm run dev
```

## Contribution

Les contributions au projet sont les bienvenues. N'hésitez pas à proposer des fonctionnalités interactives et des optimisations pour améliorer l'application.


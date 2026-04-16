# Architecture et Plan de Finalisation - Suivlima 🚀

Suivlima est conçu comme une application SaaS multi-tenant (orientée rôles) pour la gestion client et le suivi de dossiers. L'architecture actuelle suit une séparation claire entre le Frontend (Next.js) et le Backend (Node/Express).

## Architecture du Projet

### 1. Backend (API REST)
- **Framework** : Node.js avec Express.
- **Structure** :
    - `/models` : Définition des schémas SQL via Sequelize (PostgreSQL).
    - `/controllers` : Logique métier et orchestration des requêtes.
    - `/routes` : Endpoints de l'API.
    - `/middleware` : Authentification (JWT), Validation, Gestion des rôles.
    - `/services` : Logique externe (Email, WhatsApp, Paiements).
    - `/config` : Configuration base de données et variables d'environnement.
- **Sécurité** : JWT pour l'auth, Hachage des mots de passe (bcrypt), CORS, Helmet (à ajouter), Rate Limiting (à ajouter).

### 2. Frontend (Client)
- **Framework** : Next.js (App Router).
- **Structure** :
    - `/app` : Pages et routing (Dashboard, Login, Clients, etc.).
    - `/components` : Composants UI réutilisables (Cards, Modals, StatCards).
    - `/lib` : Client API (Axios avec intercepteurs).
    - `/hooks` : Gestion des états et data fetching.
- **Styling** : CSS Vanilla (pour flexibilité maximale) + Tailwind (requis si demandé, actuellement présent).

### 3. Base de Données
- **Moteur** : PostgreSQL (via Docker).
- **Schéma** :
    - `users` : admin/staff credentials.
    - `clients` : informations signalétiques.
    - `dossiers` : dossiers liés aux clients (statuts: en_cours, termine, suspendu).
    - `paiements` : suivi des transactions.
    - `relances` : logs des relances auto.

---

## Plan d'Action (Phase d'Exécution)

### Étape 1 : Infrastructure & Connectivité
- **[MODIFY] .env** : Changer le port du Backend (3000 -> 5000) pour éviter le conflit avec le Frontend.
- **[MODIFY] frontend/src/lib/api.js** : S'assurer que l'URL pointe vers le port 5000.
- **Vérification** : Lancement simultané des deux serveurs.

### Étape 2 : Audit & Sécurisation Backend
- **Audit de code** : Identifier les routes non protégées ou manquant de validation.
- **Injection & XSS** : Implémenter `express-validator` sur toutes les entrées utilisateur de création/mise à jour.
- **Headers de sécurité** : Ajouter `helmet` pour protéger contre les attaques courantes.

### Étape 3 : Finalisation du Backend
- Compléter les services de relance (Mock SendGrid/Twilio).
- Implémenter le Dashboard Controller pour agréger les statistiques réelles.

### Étape 4 : Finalisation du Frontend
- Connecter les pages Clients et Dossiers (CRUD complet).
- Implémenter la gestion des erreurs globale (Toasts).
- Rendre l'UI "Premium" (Gradients, micro-animations, design responsive).

### Étape 5 : Tests & Documentation
- Tests de flux : "Nouveau Client -> Création Dossier -> Paiement partiel -> Relance Auto".
- Création du README.md final avec instructions Docker.

---

## Questions Ouvertes / Review Requise
> [!IMPORTANT]
> - **PostgreSQL vs SQLite** : Souhaitez-vous que je force l'utilisation de PostgreSQL (via Docker) immédiatement, ou qu'on continue en SQLite pour le développement rapide avant la prod ?
> - **Design** : J'ai pour mission de créer une interface "Premium". Avez-vous une préférence de couleur dominante (actuellement bleu nuit et orange) ?

## Plan de Vérification
- Lancement de `npm run dev` sur les deux parties.
- Test de connexion avec un utilisateur admin.
- Vérification de la persistance des données.

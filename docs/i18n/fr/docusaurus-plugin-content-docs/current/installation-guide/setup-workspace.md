---
sidebar_position: 2
---

# Configurer votre espace de travail

Maintenant que vous avez configuré votre projet Firebase, il est temps de configurer votre espace de travail. Ce guide vous aidera à mettre en place votre environnement de développement et de déploiement local et à configurer votre projet Firebase pour fonctionner avec UrbanNote.

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les éléments suivants sur votre machine :

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) - nous avons utilisé la version 18.16.0 pour développer UrbanNote, je recommande d'utiliser un gestionnaire de versions tel que nvm
- [Yarn](https://yarnpkg.com/) - nous avons utilisé la version 1.22.19
- [Firebase CLI](https://firebase.google.com/docs/cli?hl=fr) - nous utilisons actuellement la version 12.4.2

## Installer les dépendances

- Clonez le dépôt, puis installez les dépendances du projet en exécutant la commande suivante :

  ```bash
  yarn
  ```

  dans les répertoires suivants : `frontend`, `functions`, et éventuellement `docs` si vous souhaitez contribuer à cette documentation.

- Utilisez la Firebase CLI pour vous connecter à votre compte Firebase :

  ```bash
  firebase login
  ```

  Cela ouvrira une fenêtre de navigateur et vous invitera à vous connecter à votre compte Firebase. Une fois connecté, vous pouvez fermer la fenêtre du navigateur et revenir à votre terminal.

- Associez votre projet local à votre projet Firebase :

  ```bash
  firebase use --add
  ```

  Cela vous demandera de sélectionner un projet Firebase dans la liste des projets auxquels vous avez accès. Sélectionnez le projet que vous avez créé à l'étape précédente.

## Configurer les variables d'environnement

- Copiez le fichier `/frontend/.env.local.example` en `/frontend/.env.local`.

- Remplissez toutes les valeurs :

  - Toute valeur préfixée par `VITE_FIREBASE_` doit être remplie avec la valeur correspondante de votre projet Firebase. Vous pouvez trouver ces valeurs dans la console Firebase, sous Paramètres du projet > Général > Vos applications > Applications web > Votre application > Config.

  - La `VITE_APP_PUBLIC_URL` doit être l'URL où votre application sera hébergée. Si vous utilisez Firebase Hosting, ce sera l'URL de votre projet Firebase Hosting.

## Démarrer le serveur de développement

Le projet est configuré avec les [émulateurs Firebase](https://firebase.google.com/docs/emulator-suite?hl=fr) pour vous aider à développer et tester votre application localement. Si vous êtes sous Windows, vous pouvez exécuter la commande suivante dans le répertoire racine pour démarrer les processus de terminal multiples nécessaires pour exécuter les émulateurs frontend et backend :

```bash
yarn dev
```

Si vous êtes sur un système basé sur Unix, toujours dans le répertoire racine, vous pouvez exécuter les commandes suivantes dans des fenêtres de terminal séparées :

```bash
# Démarrer les émulateurs
yarn emulate

# Compiler les fonctions en mode surveillance
yarn dev:functions

# Démarrer le serveur de développement frontend
yarn dev:frontend
```

---
sidebar_position: 3
---

# Déployer votre application

Maintenant que la configuration est terminée et que vous êtes satisfait des fonctionnalités, il est temps de déployer votre propre instance UrbanNote et de créer votre compte administrateur.

## Déployer sur votre projet Firebase

En utilisant la CLI Firebase, vous pouvez déployer votre application en une seule commande :

```bash
firebase deploy
```

Cette commande déploie l'application sur votre projet Firebase et vous fournit une URL pour accéder à votre application. Si vous avez configuré plusieurs projets pour le dépôt, vous pouvez utiliser l'option `--project` :

```bash
firebase deploy --project <project-id>
```

Vous pouvez également souhaiter déployer uniquement certaines parties de votre application, comme les règles de la base de données ou les fichiers d'hébergement. Vous pouvez le faire en spécifiant la cible avec l'option `--only` :

```bash
firebase deploy --only hosting
```

## Créer votre compte administrateur

L'inscription étant désactivée, vous devrez créer un compte administrateur manuellement. Il s'agit d'une opération unique puisque vous pourrez utiliser l'application pour créer d'autres administrateurs.

- Accédez à la console Firebase et ouvrez votre projet.

- Naviguez vers la section Authentification et cliquez sur le bouton "Ajouter un utilisateur".

- Remplissez l'email de l'utilisateur et un mot de passe sécurisé.

- Une fois l'utilisateur créé, copiez son UID.

- Allez dans la section Firestore et créez une nouvelle collection `userProfiles`, avec un nouveau document ayant l'UID de l'utilisateur comme ID de document. Remplissez les champs suivants :

  ```json
  {
    "id": "<user-uid>",
    "email": "<user-email>",
    "createdBy": "<user-uid>",
    "createdAt": "<current-timestamp>",
    "updatedBy": "<user-uid>",
    "updatedAt": "<current-timestamp>",
    "firstName": "<user-first-name>",
    "lastName": "<user-last-name>",
    "chosenName": "Optionnel - <user-chosen-name>",
    "language": "<en | fr>"
  }
  ```

- Créez une nouvelle collection `userRoles`, avec un nouveau document ayant l'UID de l'utilisateur comme ID de document. Remplissez les champs suivants :

  ```json
  {
    "id": "<user-uid>",
    "createdBy": "<user-uid>",
    "createdAt": "<current-timestamp>",
    "updatedBy": "<user-uid>",
    "updatedAt": "<current-timestamp>",
    "admin": true,
    "expenseManagement": true,
    "resourceManagement": true,
    "userManagement": true
  }
  ```

Vous pouvez maintenant accéder à votre application et vous connecter avec le compte administrateur que vous venez de créer ! 🎉

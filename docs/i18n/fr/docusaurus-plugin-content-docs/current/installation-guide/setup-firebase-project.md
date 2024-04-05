---
sidebar_position: 1
---

# Configurer votre projet Firebase

UrbanNote utilise [Firebase](https://firebase.google.com) pour stocker et gérer les données. Pour déployer UrbanNote, vous devez créer votre propre projet Firebase et le configurer avec les services requis. Vous pouvez ignorer cette étape si vous travaillez avec l'équipe UrbanNote et avez accès à leurs projets Firebase privés.

## Créer un projet Firebase

Créer un projet Firebase est un processus rapide. Vous pouvez suivre le [guide officiel](https://firebase.google.com/docs/web/setup?hl=fr#create-firebase-project-and-app) pour créer un nouveau projet Firebase.

## Configurer les services Firebase

UrbanNote nécessite quelques services Firebase pour fonctionner correctement. Heureusement, il est facile de configurer ces dépendances. Accédez à la console Firebase et activez les éléments suivants dans votre projet :

- [Plan tarifaire Blaze](https://firebase.google.com/pricing?hl=fr) - UrbanNote nécessite un plan payant à l'utilisation pour utiliser les Cloud Functions et certains autres services.

- [Enregistrer votre application](https://firebase.google.com/docs/web/setup?hl=fr#create-firebase-project-and-app). Vous recevrez un objet de configuration Firebase avec les identifiants de votre application. Vous aurez besoin de ces valeurs plus tard.

- [Authentication](https://firebase.google.com/docs/auth?hl=fr) :

  - Allez dans Méthodes de connexion et activez Email/Mot de passe, puis modifiez le fournisseur pour activer la connexion avec le lien email.
  - Allez dans les paramètres, puis dans Actions utilisateur et désactivez la création d'utilisateur.
  - Ensuite, dans les domaines autorisés, ajoutez le domaine sur lequel votre application sera hébergée. Firebase vous demandera d'ajouter des enregistrements DNS pour vérifier le domaine, donc assurez-vous d'avoir accès aux paramètres DNS de votre domaine.
  - Une fois votre domaine confirmé, vous pouvez ensuite aller dans Modèles et [définir l'adresse email de l'expéditeur](https://firebase.google.com/docs/auth/email-custom-domain?hl=fr) pour utiliser votre domaine.

- [Firestore](https://firebase.google.com/docs/firestore?hl=fr) : vous avez juste besoin de créer une base de données Firestore pour l'instant.

- [Storage](https://firebase.google.com/docs/storage?hl=fr) : vous avez juste besoin de créer un bucket de stockage pour l'instant.

- [Hosting](https://firebase.google.com/docs/hosting?hl=fr) : activez le service, puis ajoutez votre domaine personnalisé. Vous déployerez UrbanNote sur ce domaine plus tard.

- [Cloud Functions](https://firebase.google.com/docs/functions?hl=fr) : vous avez juste besoin d'activer le service pour l'instant.

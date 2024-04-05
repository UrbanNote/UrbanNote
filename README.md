# UrbanNote

Une application web qui vient en aide aux travailleurs et travailleuses de rue en leur offrant des outils pratiques.

## Mise en route

### Prérequis

- [Node.js](https://nodejs.org/en/) (version 18.16.0 ou plus récente)
- [Yarn](https://yarnpkg.com/) (version 1.22.19 ou plus récente)

Si jamais vous avez des erreurs d'ExecutionPolicy avec Yarn, vous pouvez rouler la commande `Set-ExecutionPolicy RemoteSigned` dans un terminal PowerShell en tant qu'administrateur.

### Mise en place de Firebase

- Installez le CLI de Firebase avec `npm install -g firebase-tools`.
- Connectez-vous à votre compte Firebase avec `firebase login`.
- Accédez à votre projet Firebase et récupérez les variables d'environnement.
- Dans le dossier `./frontend`, copiez le ficher `.env.local.example` et renommez la copie à `.env.local`.
- Remplacez les valeurs des variables d'environnement dans le fichier `.env.local` par celles de votre projet Firebase.

### Installation des dépendances

Lancez `yarn` dans les dossiers `./frontend` et `./functions/` afin d'installer les dépendances.

### Développement local

Le projet est configuré pour utiliser les émulateurs de Firebase en développement. Il s'agit d'une version locale des services de Firebase qui permet de tester l'application sans avoir à déployer sur un serveur.

- Vous devez avoir une version compilée de vos Cloud Functions pour qu'ils soient disponibles sur l'émulateur. Vous pouvez utiliser la commande `yarn dev:functions` pour les compiler et les mettre à jour automatiquement lorsque vous les modifiez.
- Si vous n'avez jamais utilisé les émulateurs firebase, utilisez la commande `firebase init emulators` afin de les télécharger. Comme les paramètres sont déjà initialisés, vous pouvez simplement accepter les valeurs par défaut, puis entrer `Y` lorsqu'on vous demande si vous voulez télécharger les émulateurs.
- Utilisez la commande `yarn emulate` pour démarrer les émulateurs. Vous trouverez dans la console les adresses des émulateurs.
- Vous pouvez maintenant démarrer l'application React en utilisant la commande `yarn dev:frontend`.

<div align="center">

![UrbanNote](./logo.png)

# UrbanNote

🔗 <https://urbannote.org>

⚖️ [LiliQ-R+ License](./LICENSE)

📋 [Changelog](./CHANGELOG.md)

[English](#english) | [Français](#français)

</div>

## English

UrbanNote is a web application that assists street workers by providing practical tools.

## Getting Started

Read or [documentation](https://urbannote.org/docs) for more detailed information.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (version 18.16.0 or newer)
- [Yarn](https://yarnpkg.com/) (version 1.22.19 or newer)

If you encounter ExecutionPolicy errors with Yarn, you can run the command `Set-ExecutionPolicy RemoteSigned` in a PowerShell terminal as an administrator.

### Setting up Firebase

- Install the Firebase CLI with `npm install -g firebase-tools`.
- Log in to your Firebase account with `firebase login`.
- Access your Firebase project and retrieve the environment variables.
- In the `./frontend` folder, copy the `.env.local.example` file and rename the copy to `.env.local`.
- Replace the values of the environment variables in the `.env.local` file with those from your Firebase project.

### Installing Dependencies

Run `yarn` in the `./frontend` and `./functions/` folders to install the dependencies.

### Local Development

The project is set up to use Firebase emulators for development. This is a local version of Firebase services that allows you to test the application without deploying it to a server.

- You must have a compiled version of your Cloud Functions available for them to be accessible on the emulator. You can use the command `yarn dev:functions` to compile and automatically update them when you make changes.
- If you have never used Firebase emulators before, use the command `firebase init emulators` to download them. Since the settings are already initialized, you can simply accept the default values, then enter `Y` when asked if you want to download the emulators.
- Use the command `yarn emulate` to start the emulators. You will find the emulator addresses in the console.
- You can now start the React application by using the command `yarn dev:frontend`.

## Français

UrbanNote est une application web qui vient en aide aux travailleurs et travailleuses de rue en leur offrant des outils pratiques.

## Mise en route

Lisez notre [documentation](https://urbannote.org/fr/docs) pour plus d'informations détaillées.

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

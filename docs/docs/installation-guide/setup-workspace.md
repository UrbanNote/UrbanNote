---
sidebar_position: 2
---

# Setup your workspace

Now that you have setup your Firebase project, it's time to setup your workspace. This guide will help you setup your local development and deployment environment and configure your Firebase project to work with UrbanNote.

## Prerequisites

Before you get started, make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) - we used v18.16.0 to develop UrbanNote, I recommend using a version manager such as nvm
- [Yarn](https://yarnpkg.com/) - we used v1.22.19
- [Firebase CLI](https://firebase.google.com/docs/cli) - we are currently using v12.4.2

## Install dependencies

- Clone the repository, then install the project dependencies by running the following command:

  ```bash
  yarn
  ```

  in the following directories: `frontend`, `functions`, and optionally `docs` if you want to contribute to this documentation.

- Use the Firebase CLI to login to your Firebase account:

  ```bash
  firebase login
  ```

  This will open a browser window and prompt you to login to your Firebase account. Once you are logged in, you can close the browser window and return to your terminal.

- Associate your local project with your Firebase project:

  ```bash
  firebase use --add
  ```

  This will prompt you to select a Firebase project from the list of projects you have access to. Select the project you created in the previous step.

## Configure environment variables

- Copy the `/frontend/.env.local.example` file to `/frontend/.env.local`.

- Fill all the values:

  - Any value prefixed by `VITE_FIREBASE_` should be filled with the corresponding value from your Firebase project. You can find these values in the Firebase console, under Project settings > General > Your apps > Web apps > Your app > Config.

  - The `VITE_APP_PUBLIC_URL` should be the URL where your app will be hosted. If you are using Firebase Hosting, this will be the URL of your Firebase Hosting project.

## Start the development server

The project is setup with [Firebase emulators](https://firebase.google.com/docs/emulator-suite) to help you develop and test your app locally. If you're on Windows, you can run the command following in the root directory to start the multiple terminal processes required to run the frontend and backend emulators:

```bash
yarn dev
```

If you're on a Unix-based system, still in the root directory, you can run the following commands in separate terminal windows:

```bash
# Start the emulators
yarn emulate

# Compile the functions in watch mode
yarn dev:functions

# Start the frontend development server
yarn dev:frontend
```

---
sidebar_position: 3
---

# Deploy your app

Now that the setup is complete and you're satisfied with the features, it's time to deploy your own UrbanNote instance and create your administrator account.

## Deploy to your Firebase project

Using the Firebase CLI, you can deploy your app in a single command:

```bash
firebase deploy
```

This command deploys the app to your Firebase project and provides you with a URL to access your app. If you have multiple projects configured for the repository, you can use the `--project` flag:

```bash
firebase deploy --project <project-id>
```

You may also want to deploy only specific parts of your app, such as the database rules or the hosting files. You can do this by specifying the target with the `--only` flag:

```bash
firebase deploy --only hosting
```

## Create your administrator account

Since registering is disabled, you will need to create an administrator account manually. This is a one-time operation since you will be able to use the app to create more administrators.

- Go to the Firebase Console and access your project.

- Navigate to the Authentication section and click on the "Add user" button.

- Fill in the user's email and a secure password.

- Once the user is created, copy its UID.

- Go to the Firestore section create a new collection `userProfiles`, with a new document with the user's UID as the document ID. Fill in the following fields:

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
    "chosenName": "Optional - <user-chosen-name>",
    "language": "<en | fr>"
  }
  ```

- Create a new collection `userRoles`, with a new document with the user's UID as the document ID. Fill in the following fields:

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

You can now access your app and sign in with the administrator account you just created! 🎉

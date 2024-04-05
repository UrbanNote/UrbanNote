---
sidebar_position: 1
---

# Setup your Firebase project

UrbanNote uses [Firebase](https://firebase.google.com) to store and manage data. To deploy UrbanNote, you need to create yout own Firebase project and configure with the required services. You can skip this step if you are working with the UrbanNote team and have access to their private Firebase projects.

## Create a Firebase project

Creating a Firebase project is a quick process. You can follow the [official guide](https://firebase.google.com/docs/web/setup#create-firebase-project) to create a new Firebase project.

## Configure Firebase services

UrbanNote requires a few Firebase services to work properly. Luckily, it's easy to set up these dependencies. Access the Firebase console and enable the following in your project:

- [Blaze pricing plan](https://firebase.google.com/pricing) - UrbanNote requires a pay-by-usage plan to use Cloud Functions and some other services.

- [Registering your app](https://firebase.google.com/docs/web/setup#create-firebase-project). You will be given a Firebase configuration object with your app's credentials. You will need these values later.

- [Authentication](https://firebase.google.com/docs/auth):

  - Go to Sign-in methods and enable Email/Password, then edit the provider to enable signing in with email link.
  - Go to parameters, then to User actions and disable user creation.
  - Then, in authorized domains, add the domain on which your app will be hosted. Firebase will prompt you to add DNS records to verify the domain, so make sure you have access to your domain's DNS settings.
  - Once your domain is confirmed, you can then go to Templates and [set the sender email address](https://firebase.google.com/docs/auth/email-custom-domain) to use your domain.

- [Firestore](https://firebase.google.com/docs/firestore): you only need to create a Firestore database for now.

- [Storage](https://firebase.google.com/docs/storage): you only need to create a Storage bucket for now.

- [Hosting](https://firebase.google.com/docs/hosting): activate the service, then add your custom domain. You will deploy UrbanNote to this domain later.

- [Cloud Functions](https://firebase.google.com/docs/functions): you only need to activate the service for now.

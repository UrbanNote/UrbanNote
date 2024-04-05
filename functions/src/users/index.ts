import { onCall } from 'firebase-functions/v1/https';

import { IUserController } from './userController';
import type { UserProfileDoc } from './userProfileDoc';
import container from '../container';

// On récupère le contrôleur depuis le conteneur d'injection de dépendances.
const userController = container.resolve<IUserController>('UserController');

// Le module exporte les fonctions qui sont encapsulées par des onCall et autres triggers.
export default {
  // Functions
  createUserProfile: onCall(userController.createUserProfile.bind(userController)),
  createUserRoles: onCall(userController.createUserRoles.bind(userController)),
  updateUserProfile: onCall(userController.updateUserProfile.bind(userController)),
  // Triggers
};

export type { UserProfileDoc };

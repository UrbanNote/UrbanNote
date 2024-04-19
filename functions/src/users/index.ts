import { document } from 'firebase-functions/v1/firestore';
import { onCall } from 'firebase-functions/v1/https';

import { IUserController } from './userController';
import { IUserObserver } from './userObserver';
import type { UserProfileDoc } from './userProfileDoc';
import container from '../container';

// On récupère le contrôleur et l'observer depuis le conteneur d'injection de dépendances.
const userController = container.resolve<IUserController>('UserController');
const userObserver = container.resolve<IUserObserver>('UserObserver');

// Le module exporte les fonctions qui sont encapsulées par des onCall et autres triggers.
export default {
  // Functions
  createUserProfile: onCall(userController.createUserProfile.bind(userController)),
  createUserRoles: onCall(userController.createUserRoles.bind(userController)),
  updateUserProfile: onCall(userController.updateUserProfile.bind(userController)),
  updateUserRoles: onCall(userController.updateUserRoles.bind(userController)),
  // Triggers
  onUserUpdated: document('userProfiles/{userId}').onUpdate(change =>
    userObserver.onUserUpdated.bind(userObserver)(
      change.before.data() as UserProfileDoc,
      change.after.data() as UserProfileDoc,
    ),
  ),
};

export type { UserProfileDoc };

import { onCall } from 'firebase-functions/v1/https';

import { IAuthController } from './authController';
import container from '../container';

const authController = container.resolve<IAuthController>('AuthController');

export default {
  // Functions
  createUser: onCall(authController.createUser.bind(authController)),
  updateUser: onCall(authController.updateUser.bind(authController)),
  disableUser: onCall(authController.disableUser.bind(authController)),
  enableUser: onCall(authController.enableUser.bind(authController)),
  getUsers: onCall(authController.getUsers.bind(authController)),
  getUserNames: onCall(authController.getUserNames.bind(authController)),
  getAuthUsers: onCall(authController.getAuthUsers.bind(authController)),
};

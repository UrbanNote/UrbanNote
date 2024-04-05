import { onCall } from 'firebase-functions/v1/https';
import { container } from 'tsyringe';

import { IStorageController } from './storageController';

// On récupère le contrôleur depuis le conteneur d'injection de dépendances.
const storageController = container.resolve<IStorageController>('StorageController');

// Le module exporte les fonctions qui sont encapsulées par des onCall
export default {
  // Functions
  deleteFile: onCall(storageController.deleteFile.bind(storageController)),
};

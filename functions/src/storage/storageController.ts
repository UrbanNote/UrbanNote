// ajouter dans container

import { CallableContext } from 'firebase-functions/v1/https';
import { inject, injectable } from 'tsyringe';

import { IStorageService } from './storageService';
import { ApplicationError, handleError } from '../errors';

export interface IStorageController {
  /**
   * Delete file metadata associated with an expense.
   * @param path The path to the file.
   */
  deleteFile(paths: string[], context: CallableContext): Promise<void>;
}

@injectable()
export class StorageController implements IStorageController {
  constructor(@inject('StorageService') private readonly storageService: IStorageService) {}

  public async deleteFile(paths: string[], context: CallableContext) {
    try {
      if (!context.auth) {
        throw new ApplicationError('unauthenticated', 'NotAuthenticated');
      }

      await this.storageService.deleteFile(paths, context.auth.uid);
    } catch (error) {
      throw handleError(error);
    }
  }
}

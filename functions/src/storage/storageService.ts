import { inject, injectable } from 'tsyringe';

import { EntityTypes, FileMetadata } from './fileMetadata';
import { IStorageRepository } from './storageRepository';
import { IAuthorizationService } from '../auth/authorizationService';
import { ApplicationError } from '../errors';
import { IExpenseRepository } from '../expenses/expenseRepository';

/** Provides an API to manage files and their associated metadata on the Interaction layer. */
export interface IStorageService {
  /**
   * Sets file metadata to associate it with an expense or a user.
   * @param path The path to the file.
   * @param entityType The type of entity to associate the file with.
   * @param entityId The ID of the expense or the user to associate the file with.
   */
  associateFileToEntity(path: string, entityType: EntityTypes, entityId: string): Promise<void>;

  /**
   * Delete file associated with an expense.
   * @param path The path to the file.
   * If requesterId is defined, we perform the permission check.
   */
  deleteFile(path: string[], requesterId?: string): Promise<void>;
}

@injectable()
export class StorageService implements IStorageService {
  constructor(
    @inject('StorageRepository') private readonly storageRepository: IStorageRepository,
    @inject('ExpenseRepository') private readonly expenseRepository: IExpenseRepository,
    @inject('AuthorizationService') private readonly authorizationService: IAuthorizationService,
  ) {}

  public async associateFileToEntity(path: string, entityType: EntityTypes, entityId: string) {
    const file = await this.storageRepository.getFile(path);
    if (!file) throw new ApplicationError('not-found', 'FileNotFound');

    const metadata: FileMetadata = {
      entityType,
      entityId,
    };

    await this.storageRepository.setMetadata(path, metadata);
  }

  public async deleteFile(paths: string[], requesterId?: string) {
    for (const path of paths) {
      const file = await this.storageRepository.getFile(path);
      if (!file) throw new ApplicationError('not-found', 'FileNotFound');

      if (requesterId) {
        const metadata = await this.storageRepository.getMetadata(path);

        if ((!metadata?.entityType || !metadata.entityId) && requesterId !== metadata?.userId) {
          throw new ApplicationError('permission-denied', 'PermissionDenied');
        }

        if (metadata?.entityType === 'expenseDetails') {
          const expense = await this.expenseRepository.getExpenseDetailsById(metadata.entityId);

          if (requesterId !== expense?.assignedToId) {
            await this.authorizationService.assertUserHasExpenseManagementRole(requesterId!);
          }
        }
      }
      await this.storageRepository.deleteFile(path);
    }
  }
}

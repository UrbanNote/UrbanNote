import { inject, injectable } from 'tsyringe';

import { EntityTypes, FileMetadata } from './fileMetadata';
import { IStorageRepository } from './storageRepository';
import { ApplicationError } from '../errors';

/** Provides an API to manage files and their associated metadata on the Interaction layer. */
export interface IStorageService {
  /**
   * Sets file metadata to associate it with an expense.
   * @param path The path to the file.
   * @param entityType The type of entity to associate the file with.
   * @param entityId The ID of the expense to associate the file with.
   */
  associateFileToEntity(path: string, entityType: EntityTypes, expenseId: string): Promise<void>;

  /**
   * Delete file associated with an expense.
   * @param path The path to the file.
   */
  deleteFile(path: string[]): Promise<void>;
}

@injectable()
export class StorageService implements IStorageService {
  constructor(@inject('StorageRepository') private readonly storageRepository: IStorageRepository) {}

  public async associateFileToEntity(path: string, entityType: EntityTypes, expenseId: string) {
    const file = await this.storageRepository.getFile(path);
    if (!file) throw new ApplicationError('not-found', 'FileNotFound');

    const metadata: FileMetadata = {
      entityType,
      entityId: expenseId,
    };

    await this.storageRepository.setMetadata(path, metadata);
  }

  public async deleteFile(paths: string[]) {
    for (const path of paths) {
      const file = await this.storageRepository.getFile(path);
      if (!file) throw new ApplicationError('not-found', 'FileNotFound');

      await this.storageRepository.deleteFile(path);
    }
  }
}

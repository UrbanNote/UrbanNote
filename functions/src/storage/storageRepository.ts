import { File } from '@google-cloud/storage';
import { storage } from 'firebase-admin';
import { injectable } from 'tsyringe';

import { isApiError } from '../errors';

/**
 * Connects the application to its storage system.
 */
export interface IStorageRepository {
  /**
   * Deletes a file from storage.
   * @param path - The path to the file.
   */
  deleteFile(path: string): Promise<void>;

  /**
   * Gets a file from storage.
   * @param path - The path to the file.
   * @returns The file, or null if it does not exist.
   */
  getFile(path: string): Promise<File | null>;

  /**
   * Gets the metadata for a file.
   * @param path - The path to the file.
   * @returns The metadata, or null if the file does not exist.
   */
  getMetadata(path: string): Promise<Record<string, string> | null>;

  /**
   * Sets the metadata for a file.
   * @param path - The path to the file.
   * @param metadata - The metadata to set.
   */
  setMetadata(path: string, metadata: Record<string, string>): Promise<void>;
}

@injectable()
export class StorageRepository implements IStorageRepository {
  private readonly bucket = storage().bucket();

  public async deleteFile(path: string) {
    await this.bucket.file(path).delete({ ignoreNotFound: true });
  }

  public async getFile(path: string) {
    try {
      const fileResponse = await this.bucket.file(path).get();
      return fileResponse[0];
    } catch (error) {
      if (!isApiError(error) || error.code !== 404) throw error;
      return null;
    }
  }

  public async getMetadata(path: string): Promise<Record<string, string> | null> {
    const file = await this.getFile(path);
    if (!file) return null;
    const response = await file.getMetadata();
    return response[0].metadata;
  }

  public async setMetadata(path: string, metadata: Record<string, string>) {
    const file = await this.bucket.file(path).get();
    if (!file) {
      throw new Error('File not found');
    }

    await this.bucket.file(path).setMetadata({ metadata });
  }
}

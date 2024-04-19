import { File } from '@google-cloud/storage';
import { injectable } from 'tsyringe';

import { FileMock } from './FileMock';
import { IStorageRepository } from '../../src/storage/storageRepository';

@injectable()
export class StorageRepositoryMock implements IStorageRepository {
  private readonly storage: Map<string, FileMock> = new Map();
  private readonly metadata: Map<string, Record<string, string>> = new Map();

  public async deleteFile(path: string): Promise<void> {
    this.storage.delete(path);
  }

  public async getFile(path: string): Promise<File | null> {
    const fileMock = this.storage.get(path);
    return fileMock ? (fileMock as unknown as File) : null;
  }

  public async getMetadata(path: string): Promise<Record<string, string> | null> {
    const metadata = this.metadata.get(path);
    return metadata || null;
  }

  public async setMetadata(path: string, metadata: Record<string, string>): Promise<void> {
    this.metadata.set(path, metadata);
  }

  public uploadFile(path: string, file: FileMock): void {
    this.storage.set(path, file);
  }
}

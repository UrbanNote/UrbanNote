import { inject, injectable } from 'tsyringe';

import { ExpenseDetailsDoc } from './expenseDetailsDoc';
import { EntityTypes } from '../storage/fileMetadata';
import { IStorageService } from '../storage/storageService';

/**
 * Observes expense changes and updates other services accordingly.
 */
export interface IExpenseObserver {
  /**
   * Actions to perform when an expense is created.
   * If there are pictures associated with the expense, associate them with the expense.
   */
  onExpenseCreated: (expense: ExpenseDetailsDoc) => Promise<void>;

  /**
   * Actions to perform when an expense is updated.
   * If there are new pictures associated with the expense, associate them with the expense.
   */
  onExpenseUpdated: (beforeData: ExpenseDetailsDoc, afterData: ExpenseDetailsDoc) => Promise<void>;

  /**
   * Actions to perform when an expense is deleted.
   * onExpenseDeleted -> delete all associated pictures
   */
  onExpenseDeleted: (expense: ExpenseDetailsDoc) => Promise<void>;
}

@injectable()
export class ExpenseObserver implements IExpenseObserver {
  constructor(@inject('StorageService') private readonly storageService: IStorageService) {}

  public async onExpenseCreated(expense: ExpenseDetailsDoc): Promise<void> {
    if (!expense.pictureURL || !expense.pictureURL.length) return;

    const failedAssociatedPictures: string[] = [];

    for (const pictureURL of expense.pictureURL) {
      try {
        this.storageService.associateFileToEntity(pictureURL, EntityTypes.EXPENSE, expense.id);
      } catch (error) {
        console.error(error);
        failedAssociatedPictures.push(pictureURL);
      }
    }

    // delete pictures that couldn't be associated due to errors
    try {
      await this.storageService.deleteFile(failedAssociatedPictures);
    } catch (error) {
      console.error(error);
    }
  }

  public async onExpenseUpdated(beforeData: ExpenseDetailsDoc, afterData: ExpenseDetailsDoc): Promise<void> {
    const newPictures = afterData.pictureURL?.filter(pictureURL => !beforeData.pictureURL?.includes(pictureURL)) || [];
    const removedPictures =
      beforeData.pictureURL?.filter(pictureURL => !afterData.pictureURL?.includes(pictureURL)) || [];

    const failedAssociatedPictures: string[] = [];

    for (const pictureURL of newPictures) {
      try {
        this.storageService.associateFileToEntity(pictureURL, EntityTypes.EXPENSE, afterData.id);
      } catch (error) {
        console.error(error);
        failedAssociatedPictures.push(pictureURL);
      }
    }

    // delete pictures that were removed from entity
    try {
      await this.storageService.deleteFile(removedPictures);
    } catch (error) {
      console.error(error);
    }

    // delete pictures that couldn't be associated due to errors
    try {
      this.storageService.deleteFile(failedAssociatedPictures);
    } catch (error) {
      console.error(error);
    }
  }

  public async onExpenseDeleted(expense: ExpenseDetailsDoc): Promise<void> {
    if (!expense.pictureURL || !expense.pictureURL.length) return;

    try {
      this.storageService.deleteFile(expense.pictureURL);
    } catch (error) {
      console.error(error);
    }
  }
}

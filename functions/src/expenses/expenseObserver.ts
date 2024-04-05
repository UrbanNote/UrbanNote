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
   * @todo delete pictures that couldn't be associated due to errors
   */
  onExpenseCreated: (expense: ExpenseDetailsDoc) => Promise<void>;

  /**
   * Actions to perform when an expense is updated.
   * If there are new pictures associated with the expense, associate them with the expense.
   * @todo delete pictures that were removed from entity, and pictures that couldn't be associated due to errors
   * @todo add onExpenseDeleted -> delete all associated pictures
   */
  onExpenseUpdated: (beforeData: ExpenseDetailsDoc, afterData: ExpenseDetailsDoc) => Promise<void>;
}

@injectable()
export class ExpenseObserver implements IExpenseObserver {
  constructor(@inject('StorageService') private readonly storageService: IStorageService) {}

  public async onExpenseCreated(expense: ExpenseDetailsDoc): Promise<void> {
    if (!expense.pictureURL || !expense.pictureURL.length) return;

    for (const pictureURL of expense.pictureURL) {
      try {
        this.storageService.associateFileToEntity(pictureURL, EntityTypes.EXPENSE, expense.id);
      } catch (error) {
        console.error(error);
      }
    }
  }

  public async onExpenseUpdated(beforeData: ExpenseDetailsDoc, afterData: ExpenseDetailsDoc): Promise<void> {
    const newPictures = afterData.pictureURL?.filter(pictureURL => !beforeData.pictureURL?.includes(pictureURL)) || [];

    for (const pictureURL of newPictures) {
      try {
        this.storageService.associateFileToEntity(pictureURL, EntityTypes.EXPENSE, afterData.id);
      } catch (error) {
        console.error(error);
      }
    }
  }
}

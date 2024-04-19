import { IAuthRepository } from 'src/auth/authRepository';
import { inject, injectable } from 'tsyringe';

import { UserProfileDoc } from './userProfileDoc';

/**
 * Observes user changes and updates other services accordingly.
 */
export interface IUserObserver {
  /**
   * Action to perform when a user is updated.
   * @param beforeData User profile before modification.
   * @param afterData User profile after modification.
   * @returns A promise.
   */
  onUserUpdated: (beforeData: UserProfileDoc, afterData: UserProfileDoc) => Promise<void>;
}

@injectable()
export class UserObserver implements IUserObserver {
  constructor(@inject('AuthRepository') private readonly authRepository: IAuthRepository) {}

  public async onUserUpdated(beforeData: UserProfileDoc, afterData: UserProfileDoc): Promise<void> {
    if (beforeData.firstName === afterData.firstName && beforeData.lastName === afterData.lastName) {
      return;
    }

    const newDisplayName = afterData.firstName + ' ' + afterData.lastName;

    await this.authRepository.updateAuthUser(afterData.id, { displayName: newDisplayName });
  }
}

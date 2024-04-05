import { ListUsersResult, UserRecord } from 'firebase-admin/auth';
import { Timestamp } from 'firebase-admin/firestore';
import { injectable } from 'tsyringe';

import { IAuthRepository } from '../../src/auth/authRepository';

// Création d'un mock qui permet de simuler le comportement de la classe AuthRepository
@injectable()
export class AuthRepositoryMock implements IAuthRepository {
  // Permet de stocker les authUsers
  private readonly authUsers: Map<string, UserRecord> = new Map();

  public async getAuthUserByEmail(email: string): Promise<UserRecord | null> {
    for (const authUser of this.authUsers.values()) {
      if (authUser.email === email) {
        return authUser;
      }
    }

    return null;
  }
  public async getAuthUsers(ipp: number, pageToken?: string | undefined): Promise<ListUsersResult> {
    return {
      users: Array.from(this.authUsers.values()).slice(0, ipp),
      pageToken,
    };
  }

  public async createAuthUser(
    requesterId: string,
    email: string,
    displayName: string,
    disabled: boolean,
    emailVerified?: boolean,
  ): Promise<UserRecord> {
    this.authUsers.set(email, {
      email,
      displayName,
      disabled,
      emailVerified: emailVerified ?? false,
      uid: requesterId,
      toJSON: function (): object {
        throw new Error('Function not implemented.');
      },
      metadata: {
        creationTime: Timestamp.now().toString(),
        lastSignInTime: Timestamp.now().toString(),
        toJSON: function (): object {
          throw new Error('Function not implemented.');
        },
      },
      providerData: [],
    });

    return this.authUsers.get(email)!;
  }

  public async updateAuthUser(
    id: string,
    updates: Partial<Pick<UserRecord, 'disabled' | 'displayName' | 'emailVerified'>>,
  ): Promise<void> {
    const authUser = await this.getAuthUserById(id);
    if (authUser) {
      if (authUser.email) {
        const userToModify = this.authUsers.get(authUser.email);
        if (!userToModify) {
          throw new Error('User not found');
        }

        this.authUsers.set(authUser.email, {
          disabled: updates.disabled ?? authUser.disabled,
          email: authUser.email,
          displayName: updates.displayName ?? authUser.displayName,
          emailVerified: updates.emailVerified ?? authUser.emailVerified,
          uid: id,
          metadata: authUser.metadata,
          providerData: authUser.providerData,
          toJSON: authUser.toJSON,
        });
      }
    } else {
      throw new Error('User not found');
    }
  }

  public async getAuthUserById(id: string): Promise<UserRecord | null> {
    for (const authUser of this.authUsers.values()) {
      if (authUser.uid === id) {
        return authUser;
      }
    }

    return null;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from 'firebase-admin';
import { ListUsersResult, UserRecord } from 'firebase-admin/auth';
import { injectable } from 'tsyringe';

/**
 * Connects the application to its auth data source.
 */
export interface IAuthRepository {
  createAuthUser(
    requesterId: string,
    email: string,
    displayName: string,
    disabled: boolean,
    emailVerified?: boolean,
  ): Promise<UserRecord>;

  updateAuthUser(
    id: string,
    updates: Partial<Pick<UserRecord, 'disabled' | 'displayName' | 'emailVerified'>>,
  ): Promise<void>;

  getAuthUserByEmail(email: string): Promise<UserRecord | null>;

  getAuthUserById(id: string): Promise<UserRecord | null>;

  /**
   * @param ipp Items per page.
   * @param pageToken The next page token. If not specified, returns users starting without any offset.
   */
  getAuthUsers(ipp: number, pageToken?: string): Promise<ListUsersResult>;
}

@injectable()
export class AuthRepository implements IAuthRepository {
  public async createAuthUser(
    requesterId: string,
    email: string,
    displayName: string,
    disabled: boolean,
    emailVerified?: boolean,
  ): Promise<UserRecord> {
    return auth().createUser({ email, displayName, disabled, emailVerified });
  }

  public async updateAuthUser(
    id: string,
    updates: Partial<Pick<UserRecord, 'disabled' | 'displayName' | 'emailVerified'>>,
  ): Promise<void> {
    await auth().updateUser(id, {
      ...(updates.disabled !== undefined && { disabled: updates.disabled }),
      ...(updates.displayName !== undefined && { displayName: updates.displayName }),
      ...(updates.emailVerified !== undefined && { emailVerified: updates.emailVerified }),
    });
  }

  public async getAuthUserByEmail(email: string): Promise<UserRecord | null> {
    try {
      const user = await auth().getUserByEmail(email);
      return user;
    } catch (error: any) {
      if (error.code && error.code === 'auth/user-not-found') {
        return null;
      }

      throw error;
    }
  }

  public async getAuthUserById(id: string): Promise<UserRecord | null> {
    try {
      const user = await auth().getUser(id);
      return user;
    } catch (error: any) {
      if (error.code && error.code === 'auth/user-not-found') {
        return null;
      }

      throw error;
    }
  }

  public async getAuthUsers(ipp: number, pageToken?: string): Promise<ListUsersResult> {
    const listUsersResult = await auth().listUsers(ipp, pageToken);
    return listUsersResult;
  }
}

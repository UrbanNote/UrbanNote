import { firestore } from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { injectable } from 'tsyringe';

import { UserProfile, UserProfileDoc } from './userProfileDoc';
import { UserRoles, UserRolesDoc } from './userRolesDoc';

/**
 * Connects the application to its user data source.
 */
export interface IUserRepository {
  createUserProfile(
    requesterId: string,
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ): Promise<void>;

  createUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ): Promise<void>;

  getUserProfileByEmail(email: string): Promise<UserProfileDoc | null>;

  getUserProfileById(id: string): Promise<UserProfileDoc | null>;

  getUserRoles(id: string): Promise<UserRolesDoc | null>;

  updateUserProfile(
    requesterId: string,
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'email'>>,
  ): Promise<void>;

  updateUserRoles(requesterId: string, userId: string, updates: Partial<Omit<UserRoles, 'id'>>): Promise<void>;
}

@injectable()
export class UserRepository implements IUserRepository {
  private readonly userProfilesCollection = firestore().collection('userProfiles');
  private readonly userRolesCollection = firestore().collection('userRoles');

  public async createUserProfile(
    requesterId: string,
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ) {
    const userProfileDoc: UserProfileDoc = {
      id: userId,
      createdBy: requesterId,
      createdAt: Timestamp.now(),
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
      email,
      firstName,
      lastName,
      chosenName,
      language,
      pictureId,
    };

    await this.userProfilesCollection.doc(userId).set(userProfileDoc);
  }

  public async createUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ) {
    const userRolesDoc: UserRolesDoc = {
      id: userId,
      createdBy: requesterId,
      createdAt: Timestamp.now(),
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
      admin,
      expenseManagement,
      resourceManagement,
      userManagement,
    };

    await this.userRolesCollection.doc(userId).set(userRolesDoc);
  }

  public async getUserProfileByEmail(email: string) {
    const userProfileDoc = await this.userProfilesCollection.where('email', '==', email).get();
    if (userProfileDoc.empty) {
      return null;
    }

    return userProfileDoc.docs[0].data() as UserProfileDoc;
  }

  public async getUserProfileById(id: string) {
    const userProfileDoc = await this.userProfilesCollection.doc(id).get();
    if (!userProfileDoc.exists) {
      return null;
    }

    return userProfileDoc.data() as UserProfileDoc;
  }

  public async getUserRoles(id: string) {
    const userRolesDoc = await this.userRolesCollection.doc(id).get();
    if (!userRolesDoc.exists) {
      return null;
    }

    return userRolesDoc.data() as UserRolesDoc;
  }

  public async updateUserProfile(
    requesterId: string,
    userId: string,
    updates: Partial<Omit<UserProfile, 'id' | 'email'>>,
  ) {
    const userProfileDoc = {
      ...updates,
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
    };

    await this.userProfilesCollection.doc(userId).update(userProfileDoc);
  }

  public async updateUserRoles(requesterId: string, userId: string, updates: Partial<Omit<UserRoles, 'id'>>) {
    const userRolesDoc = {
      ...updates,
      updatedBy: requesterId,
      updatedAt: Timestamp.now(),
    };

    await this.userRolesCollection.doc(userId).update(userRolesDoc);
  }
}

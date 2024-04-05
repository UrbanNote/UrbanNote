/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Timestamp } from 'firebase-admin/firestore';
import { injectable } from 'tsyringe';

import { UserProfile, UserProfileDoc } from '../../src/users/userProfileDoc';
import { IUserRepository } from '../../src/users/userRepository';
import { UserRoles, UserRolesDoc } from '../../src/users/userRolesDoc';

@injectable()
export class UserRepositoryMock implements IUserRepository {
  private readonly userProfiles: Map<string, UserProfileDoc> = new Map();
  private readonly userRoles: Map<string, UserRolesDoc> = new Map();

  public async createUserProfile(
    requesterId: string,
    userId: string,
    email: string,
    firstName: string,
    lastName: string,
    language: string,
    chosenName?: string,
    pictureId?: string,
  ): Promise<void> {
    this.userProfiles.set(userId, {
      id: userId,
      createdAt: Timestamp.now(),
      createdBy: requesterId,
      updatedAt: Timestamp.now(),
      updatedBy: requesterId,
      email,
      firstName,
      lastName,
      language,
      chosenName,
      pictureId,
    });
  }

  public async createUserRoles(
    requesterId: string,
    userId: string,
    admin: boolean,
    expenseManagement: boolean,
    resourceManagement: boolean,
    userManagement: boolean,
  ): Promise<void> {
    this.userRoles.set(userId, {
      id: userId,
      createdAt: Timestamp.now(),
      createdBy: requesterId,
      updatedAt: Timestamp.now(),
      updatedBy: requesterId,
      admin,
      expenseManagement,
      resourceManagement,
      userManagement,
    });
  }

  public async getUserProfileByEmail(email: string): Promise<UserProfileDoc | null> {
    for (const userProfile of this.userProfiles.values()) {
      if (userProfile.email === email) {
        return userProfile;
      }
    }

    return null;
  }

  public async getUserProfileById(id: string): Promise<UserProfileDoc | null> {
    return this.userProfiles.get(id) ?? null;
  }

  public async getUserRoles(id: string): Promise<UserRolesDoc | null> {
    return this.userRoles.get(id) ?? null;
  }

  public async updateUserProfile(
    requesterId: string,
    userId: string,
    updates: Partial<Omit<UserProfile, 'email' | 'id'>>,
  ): Promise<void> {
    if (!this.userProfiles.has(userId)) {
      throw new Error('User profile not found');
    }

    const userProfile = this.userProfiles.get(userId) as UserProfileDoc;
    this.userProfiles.set(userId, {
      ...updates,
      ...userProfile,
      updatedAt: Timestamp.now(),
      updatedBy: requesterId,
    });
  }

  public async updateUserRoles(
    requesterId: string,
    userId: string,
    updates: Partial<Omit<UserRoles, 'id'>>,
  ): Promise<void> {
    if (!this.userRoles.has(userId)) {
      throw new Error('User roles not found');
    }

    const userRoles = this.userRoles.get(userId) as UserRolesDoc;

    this.userRoles.set(userId, {
      ...updates,
      ...userRoles,
      updatedAt: Timestamp.now(),
      updatedBy: requesterId,
    });
  }
}

import 'reflect-metadata';

import { firestore } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
firestore().settings({ ignoreUndefinedProperties: true });

import auth from './auth';
import expenses from './expenses';
import users from './users';

export { auth, users, expenses };

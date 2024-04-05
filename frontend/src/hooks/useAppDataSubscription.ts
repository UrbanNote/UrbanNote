import { useEffect, useState } from 'react';

import type { Unsubscribe } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import { auth, db } from '$firebase';
import { signOut } from '$firebase/auth';
import { SubscriptionTypes, pushSubscriber, unsubscribeAll } from '$firebase/subscriptions';
import { createUserRoles } from '$firebase/users';
import { useAppDispatch } from '$store';
import type { UserProfileState, UserRolesState } from '$store/userStore';
import { clearUser, clearUserProfile, clearUserRoles, setUser, setUserProfile, setUserRoles } from '$store/userStore';

import { useAlerts } from './useAlerts';

export function useAppDataSubscription(beforeCallback?: () => void, afterCallback?: () => void) {
  const alert = useAlerts();
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('common');

  const [hasRetrievedAuth, setHasRetrievedAuth] = useState(false);
  const [hasRetrievedProfile, setHasRetrievedProfile] = useState(false);
  const [hasRetrievedRoles, setHasRetrievedRoles] = useState(false);

  useEffect(() => {
    let unsubscribe: Unsubscribe;

    try {
      // Subscribe to Firebase Auth state
      unsubscribe = onAuthStateChanged(auth, user => {
        beforeCallback?.();

        setHasRetrievedProfile(false);
        setHasRetrievedRoles(false);

        if (!user) {
          unsubscribeAll();
          dispatch(clearUser());
          setHasRetrievedAuth(true);
          setHasRetrievedProfile(true);
          setHasRetrievedRoles(true);
          return;
        }

        const { uid: id, email, emailVerified } = user;
        dispatch(setUser({ id, email, emailVerified }));
        setHasRetrievedAuth(true);

        // Subscribe to User's profile document in Firestore
        const userProfileQuery = doc(db, 'userProfiles', user.uid);
        pushSubscriber(
          SubscriptionTypes.USER_PROFILE,
          onSnapshot(userProfileQuery, doc => {
            if (!doc.exists()) {
              dispatch(clearUserProfile());
              setHasRetrievedProfile(true);
              return;
            }

            const { email, firstName, lastName, chosenName, language, pictureId } = doc.data() as UserProfileState;
            i18n.changeLanguage(language);
            dispatch(setUserProfile({ email, firstName, lastName, chosenName, language, pictureId }));
            setHasRetrievedProfile(true);
          }),
        );

        // Subscribe to User's roles document in Firestore
        const userRolesQuery = doc(db, 'userRoles', user.uid);
        pushSubscriber(
          SubscriptionTypes.USER_ROLES,
          onSnapshot(userRolesQuery, async doc => {
            if (!doc.exists()) {
              dispatch(clearUserRoles());
              await createUserRoles({ userId: user.uid });
              return;
            }

            const { admin, expenseManagement, resourceManagement, userManagement } = doc.data() as UserRolesState;
            dispatch(setUserRoles({ admin, expenseManagement, resourceManagement, userManagement }));
            setHasRetrievedRoles(true);
          }),
        );
      });
    } catch (error) {
      alert(t('appDataSubscription.errors.unknown'), 'danger');
      signOut();
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return () => {
        unsubscribeAll();
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hasRetrievedAuth || !hasRetrievedProfile || !hasRetrievedRoles) return;
    afterCallback?.();
  }, [hasRetrievedAuth, hasRetrievedProfile, hasRetrievedRoles, afterCallback]);
}

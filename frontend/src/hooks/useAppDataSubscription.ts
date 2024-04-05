import { useEffect } from 'react';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import { auth, db } from '$firebase';
import { SubscriptionTypes, pushSubscriber, unsubscribeAll } from '$firebase/subscriptions';
import { useAppDispatch } from '$store';
import type { UserProfileState, UserRolesState } from '$store/userStore';
import { clearUser, clearUserProfile, clearUserRoles, setUser, setUserProfile, setUserRoles } from '$store/userStore';

export function useAppDataSubscription(callback?: () => void) {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (!user) {
        unsubscribeAll();
        dispatch(clearUser());
        return;
      }

      const { uid: id, email, emailVerified } = user;
      dispatch(setUser({ id, email, emailVerified }));

      // Subscribe to User's profile document in Firestore
      const userProfileQuery = doc(db, 'userProfiles', user.uid);
      pushSubscriber(
        SubscriptionTypes.USER_PROFILE,
        onSnapshot(userProfileQuery, doc => {
          if (!doc.exists()) {
            dispatch(clearUserProfile());
            return;
          }

          const { email, firstName, lastName, chosenName, language, pictureId } = doc.data() as UserProfileState;
          i18n.changeLanguage(language);
          dispatch(setUserProfile({ email, firstName, lastName, chosenName, language, pictureId }));
        }),
      );

      // Subscribe to User's roles document in Firestore
      const userRolesQuery = doc(db, 'userRoles', user.uid);
      pushSubscriber(
        SubscriptionTypes.USER_ROLES,
        onSnapshot(userRolesQuery, doc => {
          if (!doc.exists()) {
            dispatch(clearUserRoles());
            return;
          }

          const { admin, expenseManagement, resourceManagement, userManagement } = doc.data() as UserRolesState;
          dispatch(setUserRoles({ admin, expenseManagement, resourceManagement, userManagement }));
        }),
      );
    });

    callback?.();

    return () => {
      unsubscribeAll();
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

import { useEffect, useState, type PropsWithChildren } from 'react';

import { doc, onSnapshot } from 'firebase/firestore';
import { Formik } from 'formik';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { SlideOut } from '$components';
import '../Users.css';
import { db } from '$firebase';
import type { AuthUser, CreateUserData } from '$firebase/auth';
import { createUser, updateUser } from '$firebase/auth';
import { isFirebaseError } from '$helpers';
import { useAlerts } from '$hooks';
import type { UserProfileState, UserRolesState } from '$store/userStore';

import Form from './Form';
import type { UpdateUserDetails } from '../Users';

export type UsersSlideOutProps = PropsWithChildren<{
  authUser?: AuthUser;
  showSlideOut: boolean;
  setShowSlideOut: (show: boolean) => void;
  onCreate: () => void;
  onUpdate: (userId: string, disabled: boolean, displayName: string) => void;
}>;

export function CreateOrEditSlideOut({
  authUser,
  showSlideOut,
  setShowSlideOut,
  onCreate,
  onUpdate,
}: UsersSlideOutProps) {
  const { t, i18n } = useTranslation('users');
  const alert = useAlerts();

  const [userProfile, setUserProfile] = useState<UserProfileState | null | undefined>(undefined);
  const [userRoles, setUserRoles] = useState<UserRolesState | null | undefined>(undefined);
  const loading = authUser !== undefined && (userProfile === undefined || userRoles === undefined);

  const mode = authUser ? 'editUser' : 'createUser';

  const fullName = authUser && userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : '';

  const emptyValues: CreateUserData = {
    email: '',
    emailVerified: false,
    firstName: '',
    lastName: '',
    language: i18n.language,
    chosenName: '',
    disabled: false,
    admin: false,
    expenseManagement: false,
    resourceManagement: false,
    userManagement: false,
  };

  const initialValues: CreateUserData = {
    email: authUser?.email ?? '',
    emailVerified: Boolean(authUser?.emailVerified),
    firstName: authUser && userProfile ? userProfile.firstName : '',
    lastName: authUser && userProfile ? userProfile.lastName : '',
    language: authUser && userProfile ? userProfile.language : i18n.language,
    chosenName: authUser && userProfile ? userProfile.chosenName : '',
    disabled: Boolean(!authUser?.disabled),
    admin: authUser && userRoles ? userRoles.admin : false,
    expenseManagement: authUser && userRoles ? userRoles.expenseManagement : false,
    resourceManagement: authUser && userRoles ? userRoles.resourceManagement : false,
    userManagement: authUser && userRoles ? userRoles.userManagement : false,
  };

  const createOrEditUserSchema = Yup.object({
    email: Yup.string().required(t('createOrEdit.fields.email.required')).email(t('createOrEdit.fields.email.valid')),
    emailVerified: Yup.boolean(),
    firstName: Yup.string().required(t('createOrEdit.fields.firstName.required')),
    lastName: Yup.string().required(t('createOrEdit.fields.lastName.required')),
    language: Yup.string().required(),
    chosenName: Yup.string().optional(),
    disabled: Yup.boolean(),
    admin: Yup.boolean(),
    expenseManagement: Yup.boolean(),
    resourceManagement: Yup.boolean(),
    userManagement: Yup.boolean(),
  });

  const handleSubmit = async (values: CreateUserData) => {
    try {
      // User modification
      if (authUser) {
        const userToModify: UpdateUserDetails = {
          userId: authUser.uid,
          auth: {
            disabled: !values.disabled,
            email: authUser.email,
            emailVerified: values.emailVerified,
          },
          userProfile: {
            firstName: values.firstName,
            lastName: values.lastName,
            language: values.language,
            chosenName: values.chosenName,
            pictureId: '',
          },
          userRoles: {
            admin: values.admin,
            expenseManagement: values.expenseManagement,
            resourceManagement: values.resourceManagement,
            userManagement: values.userManagement,
          },
        };

        await updateUser(userToModify);

        const displayName = values.firstName + ' ' + values.lastName;

        onUpdate(authUser.uid, !values.disabled, displayName);

        // User creation
      } else {
        await createUser(values);

        onCreate();
      }

      alert(t(`${mode}.success`), 'success');
      setShowSlideOut(false);
    } catch (error) {
      if (isFirebaseError(error)) {
        return alert(t(`${mode}.errors.${error.message}`), 'danger');
      }

      alert(t(`${mode}.errors.unexpected`), 'danger');
    }
  };

  useEffect(() => {
    if (!authUser) {
      return () => {};
    }

    setUserProfile(undefined);
    setUserRoles(undefined);
    try {
      const userProfileQuery = doc(db, 'userProfiles', authUser.uid);

      const unsubscribeProfile = onSnapshot(userProfileQuery, doc => {
        setUserProfile(doc.exists() ? (doc.data() as UserProfileState) : null);
      });

      const userRolesQuery = doc(db, 'userRoles', authUser.uid);

      const unsubscribeRoles = onSnapshot(userRolesQuery, doc => {
        setUserRoles(doc.exists() ? (doc.data() as UserRolesState) : null);
      });
      return () => {
        unsubscribeProfile();
        unsubscribeRoles();
      };
    } catch (error) {
      return () => {};
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.uid]);

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={createOrEditUserSchema} onSubmit={handleSubmit}>
        {({ dirty, isSubmitting, isValid, handleSubmit, resetForm }) => (
          <SlideOut show={showSlideOut} setShow={setShowSlideOut} onCancel={() => resetForm({ values: emptyValues })}>
            <SlideOut.Header
              title={
                authUser
                  ? userProfile?.firstName == null && userProfile?.lastName == null
                    ? `${t('updateUser')}`
                    : fullName
                  : `${t('createUsers')}`
              }
              closeBtn
            />
            <SlideOut.Body>
              {loading ? (
                <Spinner size="sm" className="m-1" />
              ) : (
                <Form authUser={authUser} userRoles={userRoles} initialValues={initialValues} />
              )}
            </SlideOut.Body>
            <SlideOut.Footer
              confirmLabel={isSubmitting ? <Spinner size="sm" /> : t(`${mode}.confirm`)}
              confirmProps={{
                disabled: !isValid || !dirty || isSubmitting || loading,
                onClick: handleSubmit,
              }}
            />
          </SlideOut>
        )}
      </Formik>
    </>
  );
}

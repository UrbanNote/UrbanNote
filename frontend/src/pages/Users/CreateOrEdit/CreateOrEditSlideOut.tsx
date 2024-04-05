import type { PropsWithChildren } from 'react';

import { Formik } from 'formik';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { SlideOut } from '$components';
import '../Users.css';
import type { CreateUserData } from '$firebase/auth';
import { createUser, updateUser } from '$firebase/auth';
import type { UpdateUserProfileData } from '$firebase/users';
import { updateUserProfile } from '$firebase/users';
import { isFirebaseError } from '$helpers';
import { useAlerts } from '$hooks';

import Form from './Form';
import type { AuthUserDetails, UserDetails } from '../Users';

export type UsersSlideOutProps = PropsWithChildren<{
  userRecord?: UserDetails;
  showSlideOut: boolean;
  setShowSlideOut: (show: boolean) => void;
  onCreate: () => void;
  onUpdate: () => void;
}>;

export type GetAuthUsersResponse = {
  users: {
    uid: string;
    disabled: boolean;
    displayName: string;
    email: string;
    emailVerified: boolean;
  }[];
};

export function CreateOrEditSlideOut({
  userRecord,
  showSlideOut,
  setShowSlideOut,
  onCreate,
  onUpdate,
}: UsersSlideOutProps) {
  const { t, i18n } = useTranslation('users');
  const alert = useAlerts();

  const mode = userRecord ? 'editUser' : 'createUser';

  const fullName: string | undefined = userRecord?.profile?.firstName + ' ' + userRecord?.profile?.lastName;

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
    email: userRecord?.email ?? '',
    emailVerified: Boolean(userRecord?.emailVerified),
    firstName: userRecord?.profile?.firstName ?? '',
    lastName: userRecord?.profile?.lastName ?? '',
    language: userRecord?.profile?.language ?? i18n.language,
    chosenName: userRecord?.profile?.chosenName ?? '',
    disabled: Boolean(!userRecord?.disabled),
    admin: Boolean(userRecord?.roles?.admin),
    expenseManagement: Boolean(userRecord?.roles?.expenseManagement),
    resourceManagement: Boolean(userRecord?.roles?.resourceManagement),
    userManagement: Boolean(userRecord?.roles?.userManagement),
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
      if (userRecord) {
        const authUser: AuthUserDetails = {
          uid: userRecord.id,
          disabled: !values.disabled,
          displayName: values.firstName + ' ' + values.lastName,
          email: values.email,
          emailVerified: values.emailVerified,
        };

        const userProfile: UpdateUserProfileData = {
          userId: userRecord.id,
          firstName: values.firstName,
          lastName: values.lastName,
          language: values.language,
          chosenName: values.chosenName,
          pictureId: '',
        };

        await updateUser(authUser);
        await updateUserProfile(userProfile);

        onUpdate();
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

  return (
    <>
      <Formik initialValues={initialValues} validationSchema={createOrEditUserSchema} onSubmit={handleSubmit}>
        {({ values, isSubmitting, handleSubmit, resetForm }) => (
          <SlideOut show={showSlideOut} setShow={setShowSlideOut} onCancel={() => resetForm({ values: emptyValues })}>
            {/* TODO : À modifier (content vs title) */}
            <SlideOut.Header content={userRecord ? fullName : `${t('createUsers')}`} closeBtn></SlideOut.Header>
            <SlideOut.Body>
              <Form userRecord={userRecord} />
            </SlideOut.Body>
            <SlideOut.Footer
              confirmLabel={isSubmitting ? <Spinner size="sm" /> : t(`${mode}.confirm`)}
              confirmProps={{
                disabled:
                  values.email === '' ||
                  values.firstName === '' ||
                  values.lastName === '' ||
                  values.language === '' ||
                  isSubmitting,
                onClick: handleSubmit,
              }}></SlideOut.Footer>
          </SlideOut>
        )}
      </Formik>
    </>
  );
}

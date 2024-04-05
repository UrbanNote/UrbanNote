import type { FormikHelpers } from 'formik';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import BootstrapForm from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { SlideOut } from '$components';
import { updateUserProfile } from '$firebase/users';
import { useAlerts } from '$hooks';
import { useAppSelector } from '$store';

type SettingsSlideOutProps = {
  show: boolean;
  setShow: (show: boolean) => void;
};

type SettingsFormValues = {
  firstName: string;
  lastName: string;
  chosenName: string;
  language: string;
};

function SettingsSlideOut({ show, setShow }: SettingsSlideOutProps) {
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const alert = useAlerts();

  const user = useAppSelector(state => state.user);

  const handleSubmit = async (values: SettingsFormValues, helpers: FormikHelpers<SettingsFormValues>) => {
    try {
      await updateUserProfile(values);
      helpers.resetForm({ values });
      alert(t('success'), 'success');
      setShow(false);
    } catch (error) {
      // TODO: validate errors we know
      alert(t('errors.unexpected'), 'danger');
    }
  };

  const settingsSchema = Yup.object({
    firstName: Yup.string().required(t('fields.firstName.required')),
    lastName: Yup.string().required(t('fields.lastName.required')),
    chosenName: Yup.string(),
    language: Yup.string().required(t('fields.language.required')),
  });

  const initialValues = {
    firstName: user.profile?.firstName ?? '',
    lastName: user.profile?.lastName ?? '',
    chosenName: user.profile?.chosenName ?? '',
    language: user.profile?.language ?? '',
  };

  if (!user.profile) {
    return <></>;
  }
  return (
    <Formik<SettingsFormValues> initialValues={initialValues} validationSchema={settingsSchema} onSubmit={handleSubmit}>
      {({ errors, values, isValid, isSubmitting, handleSubmit, setFieldValue, resetForm }) => (
        <SlideOut show={show} setShow={setShow} onCancel={resetForm}>
          <SlideOut.Header title={t('title')} closeBtn />
          <SlideOut.Body>
            <Form className="w-100">
              <h3 className="text-primary mb-3 h5">{t('profile')}</h3>
              <BootstrapForm.Group className="mb-3" controlId="firstName">
                <BootstrapForm.Label>
                  {t('fields.firstName.label')}
                  <span className="text-danger">*</span>
                </BootstrapForm.Label>
                <Field
                  name="firstName"
                  as={BootstrapForm.Control}
                  type="text"
                  placeholder={t('fields.firstName.placeholder')}
                />
                <ErrorMessage name="firstName" component="div" className="text-danger" />
              </BootstrapForm.Group>
              <BootstrapForm.Group className="mb-3" controlId="lastName">
                <BootstrapForm.Label>
                  {t('fields.lastName.label')}
                  <span className="text-danger">*</span>
                </BootstrapForm.Label>
                <Field
                  name="lastName"
                  as={BootstrapForm.Control}
                  type="text"
                  placeholder={t('fields.lastName.placeholder')}
                />
                <ErrorMessage name="lastName" component="div" className="text-danger" />
              </BootstrapForm.Group>
              <BootstrapForm.Group className="mb-3" controlId="chosenName">
                <BootstrapForm.Label>{t('fields.chosenName.label')}</BootstrapForm.Label>
                <Field
                  name="chosenName"
                  as={BootstrapForm.Control}
                  type="text"
                  placeholder={t('fields.chosenName.placeholder')}
                />
                {!errors.chosenName && (
                  <BootstrapForm.Text className="text-muted">{t('fields.chosenName.helpText')}</BootstrapForm.Text>
                )}
                <ErrorMessage name="chosenName" component="div" className="text-danger" />
              </BootstrapForm.Group>
              <h3 className="text-primary mt-4 mb-3 h5">{t('contactInfo')}</h3>
              <BootstrapForm.Group className="mb-3" controlId="language">
                <BootstrapForm.Label>
                  {t('fields.language.label')}
                  <span className="text-danger">*</span>
                </BootstrapForm.Label>
                <BootstrapForm.Select
                  name="language"
                  onChange={e => setFieldValue('language', e.target.value)}
                  value={values.language}>
                  <option value="fr">{tCommon('fr')}</option>
                  <option value="en">{tCommon('en')}</option>
                </BootstrapForm.Select>
                <ErrorMessage name="language" component="div" className="text-danger" />
              </BootstrapForm.Group>
              <BootstrapForm.Group>
                <BootstrapForm.Label>{t('fields.email.label')}</BootstrapForm.Label>
                <BootstrapForm.Control value={user.email || user.email!} disabled />
                <BootstrapForm.Text className="text-muted">{t('fields.email.helpText')}</BootstrapForm.Text>
              </BootstrapForm.Group>
            </Form>
          </SlideOut.Body>
          <SlideOut.Footer
            confirmLabel={isSubmitting ? <Spinner size="sm" /> : t('confirm')}
            confirmProps={{
              onClick: handleSubmit,
              disabled: isSubmitting || !isValid,
            }}
          />
        </SlideOut>
      )}
    </Formik>
  );
}

export default SettingsSlideOut;

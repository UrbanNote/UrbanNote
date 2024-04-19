import { useMutation } from '@tanstack/react-query';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { motion } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import BootstrapForm from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { slideIn } from '$animations';
import peaks from '$assets/peaks.svg';
import { signOut } from '$firebase/auth';
import type { CreateUserProfileInput } from '$firebase/users';
import { createUserProfile } from '$firebase/users';
import { useAlerts } from '$hooks';
import { useAppSelector } from '$store';

import './Onboarding.scss';

type OnboardingFormValues = {
  firstName: string;
  lastName: string;
  chosenName: string;
  language: string;
};

export default function Onboarding() {
  const user = useAppSelector(state => state.user);
  const { t, i18n } = useTranslation('onboarding');
  const { t: tCommon } = useTranslation('common');
  const alert = useAlerts();

  const createUserProfileMutation = useMutation({
    mutationFn: async (data: CreateUserProfileInput) => createUserProfile(data),
  });

  const handleSubmit = async (values: OnboardingFormValues) => {
    try {
      await createUserProfileMutation.mutateAsync({
        userId: user.id!,
        email: user.email!,
        firstName: values.firstName,
        lastName: values.lastName,
        chosenName: values.chosenName,
        language: values.language,
      });

      alert(t('success'), 'success');
    } catch (error) {
      alert(t('errors.unknown'), 'danger');
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required(t('fields.firstName.required')),
    lastName: Yup.string().required(t('fields.lastName.required')),
    chosenName: Yup.string(),
    language: Yup.string().required(t('fields.language.required')),
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    chosenName: '',
    language: i18n.language,
  };

  return (
    <Container
      fluid
      className="w-screen min-vh-100 bg-primary-100 p-0 position-relative d-flex justify-content-center align-items-center">
      <Container>
        <Card
          className="z-1 p-4 rounded-5 border-0 shadow-lg"
          as={motion.div}
          {...slideIn}
          style={{ maxWidth: 600, margin: 'auto' }}>
          <h2>{t('greetingMessage')}</h2>
          <p>{t('missingInfo')}</p>
          <p>
            {t('requiredField')} (<span className="text-danger">*</span>).
          </p>
          <Formik<OnboardingFormValues>
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ errors, isValid, isSubmitting, values, dirty, setFieldValue }) => (
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
                    onChange={e => {
                      setFieldValue('language', e.target.value);
                      i18n.changeLanguage(e.target.value);
                    }}
                    value={values.language}>
                    <option value="fr">{tCommon('fr')}</option>
                    <option value="en">{tCommon('en')}</option>
                  </BootstrapForm.Select>
                  <ErrorMessage name="language" component="div" className="text-danger" />
                </BootstrapForm.Group>
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label>{t('fields.email.label')}</BootstrapForm.Label>
                  <BootstrapForm.Control value={user.email || user.email!} disabled />
                  <BootstrapForm.Text className="text-muted">{t('fields.email.helpText')}</BootstrapForm.Text>
                </BootstrapForm.Group>
                <Stack direction="horizontal" gap={3}>
                  <Button variant="primary" disabled={isSubmitting || !isValid || !dirty} type="submit">
                    {isSubmitting ? <Spinner size="sm" /> : t('save')}
                  </Button>
                  <Button variant="danger" onClick={handleSignOut}>
                    {t('signOut')}
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Card>
        <Container fluid className="fixed-bottom z-0 d-flex justify-content-center align-items-end">
          <p className="text-white z-1">UrbanNote v{process.env.VERSION}</p>
          <img className="fixed-bottom w-100 z-0" src={peaks} alt="Peaks" />
        </Container>
      </Container>
    </Container>
  );
}

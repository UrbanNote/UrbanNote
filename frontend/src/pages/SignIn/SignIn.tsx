import { useEffect, useMemo, useState } from 'react';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { AnimatePresence } from 'framer-motion';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import BootstrapForm from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Stack from 'react-bootstrap/Stack';
import { EnvelopeOpen } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';

import peaks from '$assets/peaks.svg';
import { sendSignInLink, signInWithLink } from '$firebase/auth';
import { useAlerts, usePageDetails } from '$hooks';

import Card from './Card';

function SignIn() {
  const { t } = useTranslation('auth');
  const [hasSentEmail, setHasSentEmail] = useState(false);
  const [params, setParams] = useSearchParams();
  const [hasOobCode, setHasOobCode] = useState(params.has('oobCode'));
  const alert = useAlerts();

  usePageDetails({ title: t('signIn.title') });

  // TODO: test on deploy if users can subscribe with this method when signing up is disabled.
  useEffect(() => {
    setHasOobCode(params.has('oobCode'));

    if (!params.has('oobCode')) {
      return;
    }

    (async () => {
      try {
        const email = params.get('email');
        if (!email) {
          throw new Error('InvalidSignInURL');
        }

        await signInWithLink(email, window.location.href);
      } catch (error) {
        setHasOobCode(false);
        alert(t('signIn.error.invalidUrl'), 'danger');
      } finally {
        setParams({});
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleSubmit = async (email: string) => {
    try {
      await sendSignInLink(email);
      setHasSentEmail(true);
    } catch (error) {
      alert(t('signIn.error.unexpected'), 'danger');
    }
  };

  const signInSchema = useMemo(
    () =>
      Yup.object({
        email: Yup.string().email(t('signIn.form.email.invalid')).required(t('signIn.form.email.required')),
      }),
    [t],
  );

  return (
    <Container
      fluid
      className="w-screen min-vh-100 bg-primary-100 p-0 position-relative d-flex justify-content-center align-items-center">
      <Container>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={signInSchema}
          onSubmit={({ email }) => handleSubmit(email)}>
          {({ values, isSubmitting }) => (
            <Form>
              <AnimatePresence mode="wait">
                {hasOobCode && (
                  <Card key={0}>
                    <Stack direction="vertical" gap={3} className="align-items-center text-center">
                      <Spinner className="text-primary" />
                      <p>{t('signIn.loading')}</p>
                    </Stack>
                  </Card>
                )}
                {!hasOobCode && hasSentEmail && (
                  <Card key={1} onClickBackLink={() => setHasSentEmail(false)}>
                    <Stack direction="vertical" gap={5} className="mt-4 text-center">
                      <EnvelopeOpen size={64} className="text-primary mx-auto" />
                      <p>
                        {t('signIn.verifyEmailPrompt.start')}
                        <br />
                        <span className="text-primary fw-bold">{values.email}</span>
                        <br />
                        {t('signIn.verifyEmailPrompt.end')}
                      </p>
                    </Stack>
                  </Card>
                )}
                {!hasOobCode && !hasSentEmail && (
                  <Card key={2}>
                    <Stack direction="vertical" gap={3} className="text-center mb-3 align-items-center">
                      <div className="shadow rounded-4 p-2 w-fit bg-light">
                        <img src="/logo.svg" alt="Logo" width={64} />
                      </div>
                      <h1>{t('signIn.welcome')}</h1>
                      <p>{t('signIn.enterEmailPrompt')}</p>
                    </Stack>
                    <Stack direction="vertical" gap={3}>
                      <BootstrapForm.Group controlId="email">
                        <BootstrapForm.Label>{t('signIn.form.email.label')}</BootstrapForm.Label>
                        <Field
                          name="email"
                          type="email"
                          as={BootstrapForm.Control}
                          label={t('signIn.form.email.label')}
                          placeholder={t('signIn.form.email.placeholder')}
                        />
                        <ErrorMessage name="email" component="div" className="text-danger" />
                      </BootstrapForm.Group>

                      <Button variant="secondary" type="submit" disabled={isSubmitting} className="mt-3 text-white">
                        {isSubmitting ? <Spinner size="sm" /> : t('signIn.form.submit')}
                      </Button>
                    </Stack>
                  </Card>
                )}
              </AnimatePresence>
            </Form>
          )}
        </Formik>
      </Container>
      <img className="fixed-bottom w-100 z-0" src={peaks} alt="Peaks" />
    </Container>
  );
}

export default SignIn;

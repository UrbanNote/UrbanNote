import { useEffect } from 'react';

import { ErrorMessage, Field, Form as FormikForm, useFormikContext } from 'formik';
import { Col, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import BootstrapForm from 'react-bootstrap/Form';
import { InfoCircle } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import type { CreateUserData } from '$firebase/auth';
import { useAppSelector } from '$store';

import './Form.scss';

import type { UserDetails } from '../Users';

export type FormProps = {
  userRecord?: UserDetails;
};

function Form({ userRecord }: FormProps) {
  const { errors, touched, resetForm } = useFormikContext<CreateUserData>();

  const { t, i18n } = useTranslation('users');
  const { t: tCommon } = useTranslation('common');

  const isUserAdmin = useAppSelector(state => state.user.roles?.admin);

  useEffect(() => {
    resetForm({
      values: {
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
      },
    });
  }, [userRecord, resetForm, i18n.language]);

  return (
    <FormikForm>
      <div className="tab-form">
        <h4>{t('slideOut.accountInfo')}</h4>
        <p className="mb-4">
          {t('requiredFields')} (<span className="asterisque">*</span>).
        </p>

        {/* Email Field */}
        <BootstrapForm.Group as={Col} controlId="email" md="6" className="slide-out-form mb-4">
          <BootstrapForm.Label>
            <b>{t('profile.email')}</b>
          </BootstrapForm.Label>
          <BootstrapForm.Label className="asterisque">*</BootstrapForm.Label>
          <Field
            name="email"
            type="email"
            as={BootstrapForm.Control}
            isInvalid={touched.email && errors.email}
            placeholder={`${t('slideOut.emailForm')}`}
            disabled={userRecord}
          />
          <BootstrapForm.Text hidden={Boolean(!userRecord)} className="email-text">
            {t('slideOut.emailModified')}
          </BootstrapForm.Text>
          <ErrorMessage name="email" component={BootstrapForm.Text} className="text-danger" />
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="disabled">
          <div className="checkbox-form">
            <Field type="checkbox" name="disabled" id="disabled" className="checkbox-field" />
            <label htmlFor="disabled">{t('slideOut.enableCheckbox')}</label>
          </div>
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="emailVerified">
          <div className="checkbox-form">
            <Field type="checkbox" name="emailVerified" id="emailVerified" className="checkbox-field" />
            <label htmlFor="emailVerified">{t('slideOut.emailToBeVerified')}</label>
          </div>
        </BootstrapForm.Group>
        <h4 className="mt-5">{t('slideOut.accessManagement')}</h4>
        {/* Boolean Fields */}
        <BootstrapForm.Group controlId="admin">
          <div className="checkbox-form">
            <Field type="checkbox" name="admin" id="admin" className="checkbox-field" disabled={!isUserAdmin} />
            <label htmlFor="admin">{t('role.admin')}</label>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>{t('slideOut.tooltip.adminRole')}</Tooltip>}>
              <Button variant="transparent" className="info-circle-button">
                <InfoCircle />
              </Button>
            </OverlayTrigger>
          </div>
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="expenseManagement">
          <div className="checkbox-form">
            <Field type="checkbox" name="expenseManagement" id="expenseManagement" className="checkbox-field" />
            <label htmlFor="expenseManagement">{t('role.expenseManagement')}</label>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>{t('slideOut.tooltip.expenseRole')}</Tooltip>}>
              <Button variant="transparent" className="info-circle-button">
                <InfoCircle />
              </Button>
            </OverlayTrigger>
          </div>
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="resourceManagement">
          <div className="checkbox-form">
            <Field type="checkbox" name="resourceManagement" id="resourceManagement" className="checkbox-field" />
            <label htmlFor="resourceManagement">{t('role.resourceManagement')}</label>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>{t('slideOut.tooltip.resourceRole')}</Tooltip>}>
              <Button variant="transparent" className="info-circle-button">
                <InfoCircle />
              </Button>
            </OverlayTrigger>
          </div>
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="userManagement">
          <div className="checkbox-form">
            <Field type="checkbox" name="userManagement" id="userManagement" className="checkbox-field" />
            <label htmlFor="userManagement">{t('role.userManagement')}</label>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>{t('slideOut.tooltip.userRole')}</Tooltip>}>
              <Button variant="transparent" className="info-circle-button">
                <InfoCircle />
              </Button>
            </OverlayTrigger>
          </div>
        </BootstrapForm.Group>
      </div>

      <div className="tab-form">
        <h4 className="mt-4">{t('slideOut.slideOutTabs.userProfile')}</h4>
        {/* First Name Field */}
        <BootstrapForm.Group as={Col} controlId="firstName" md="6" className="slide-out-form">
          <BootstrapForm.Label>
            <b>{t('profile.firstName')}</b>
          </BootstrapForm.Label>
          <BootstrapForm.Label className="asterisque">*</BootstrapForm.Label>
          <Field
            name="firstName"
            as={BootstrapForm.Control}
            isInvalid={touched.firstName && errors.firstName}
            placeholder={`${t('slideOut.firstNameForm')}`}
          />
          <ErrorMessage name="firstName" component={BootstrapForm.Text} className="text-danger" />
        </BootstrapForm.Group>

        {/* Last Name Field */}
        <BootstrapForm.Group as={Col} controlId="lasName" md="6" className="slide-out-form">
          <BootstrapForm.Label>
            <b>{t('profile.lastName')}</b>
          </BootstrapForm.Label>
          <BootstrapForm.Label className="asterisque">*</BootstrapForm.Label>
          <Field
            name="lastName"
            as={BootstrapForm.Control}
            isInvalid={touched.lastName && errors.lastName}
            placeholder={`${t('slideOut.lastNameForm')}`}
          />
          <ErrorMessage name="lastName" component={BootstrapForm.Text} className="text-danger" />
        </BootstrapForm.Group>

        {/* Chosen Name Field */}
        <BootstrapForm.Group as={Col} controlId="chosenName" md="6" className="slide-out-form">
          <BootstrapForm.Label>
            <b>{t('profile.chosenName')}</b>
          </BootstrapForm.Label>
          <Field name="chosenName" as={BootstrapForm.Control} placeholder={`${t('slideOut.chosenNameForm')}`} />
        </BootstrapForm.Group>

        {/* Language Field */}
        <BootstrapForm.Group as={Col} controlId="language" md="6" className="slide-out-form">
          <BootstrapForm.Label>
            <b>{t('profile.language')}</b>
          </BootstrapForm.Label>
          <BootstrapForm.Label className="asterisque">*</BootstrapForm.Label>
          <Field name="language" as={BootstrapForm.Select}>
            <option value="fr">{tCommon('fr')}</option>
            <option value="en">{tCommon('en')}</option>
          </Field>
        </BootstrapForm.Group>
      </div>
    </FormikForm>
  );
}

export default Form;

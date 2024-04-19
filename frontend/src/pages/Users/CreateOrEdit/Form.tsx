import { useEffect } from 'react';

import { ErrorMessage, Field, Form as FormikForm, useFormikContext } from 'formik';
import { Col, OverlayTrigger, Tooltip, Button, Alert } from 'react-bootstrap';
import BootstrapForm from 'react-bootstrap/Form';
import { InfoCircle } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';

import type { AuthUser, CreateUserData } from '$firebase/auth';
import { userIsAdmin } from '$helpers';
import { useAppSelector } from '$store';
import type { UserRolesState } from '$store/userStore';

import './Form.scss';

export type FormProps = {
  authUser?: AuthUser;
  userRoles: UserRolesState | null | undefined;
  initialValues: CreateUserData;
};

function Form({ authUser, userRoles, initialValues }: FormProps) {
  const { errors, touched, resetForm } = useFormikContext<CreateUserData>();

  const { t, i18n } = useTranslation('users');
  const { t: tCommon } = useTranslation('common');

  const user = useAppSelector(state => state.user);
  const isRequesterAdmin = userIsAdmin(user.roles);
  const isAffectedUserAdmin = userRoles ? userIsAdmin(userRoles) : false;

  /* If the connected user is not admin and the user to be modified is admin, the connected user is not
   permitted to apply modifications */
  const userNotPermitted = !isRequesterAdmin && isAffectedUserAdmin;

  useEffect(() => {
    resetForm({
      values: {
        ...initialValues,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser, resetForm, i18n.language]);

  return (
    <FormikForm>
      <div className="tab-form">
        {userNotPermitted && (
          <Alert key="info" variant="info">
            {t('slideOut.permissions')}
          </Alert>
        )}
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
            disabled={authUser}
          />
          <BootstrapForm.Text hidden={Boolean(!authUser)} className="email-text">
            {t('slideOut.emailModified')}
          </BootstrapForm.Text>
          <ErrorMessage name="email" component={BootstrapForm.Text} className="text-danger" />
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="disabled">
          <div className="checkbox-form">
            <Field
              type="checkbox"
              name="disabled"
              id="disabled"
              className="checkbox-field"
              disabled={userNotPermitted}
            />
            <label htmlFor="disabled">{t('slideOut.enableCheckbox')}</label>
          </div>
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="emailVerified">
          <div className="checkbox-form">
            <Field
              type="checkbox"
              name="emailVerified"
              id="emailVerified"
              className="checkbox-field"
              disabled={userNotPermitted}
            />
            <label htmlFor="emailVerified">{t('slideOut.emailToBeVerified')}</label>
          </div>
        </BootstrapForm.Group>
        <h4 className="mt-5">{t('slideOut.accessManagement')}</h4>
        {/* Boolean Fields */}
        <BootstrapForm.Group controlId="admin">
          <div className={isRequesterAdmin ? 'checkbox-form' : 'checkbox-admin-form'}>
            <Field type="checkbox" name="admin" id="admin" className="checkbox-field" disabled={!isRequesterAdmin} />
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
          {!isRequesterAdmin && <BootstrapForm.Text>{t('slideOut.adminCheckboxPermission')}</BootstrapForm.Text>}
        </BootstrapForm.Group>
        <BootstrapForm.Group controlId="expenseManagement">
          <div className="checkbox-form">
            <Field
              type="checkbox"
              name="expenseManagement"
              id="expenseManagement"
              className="checkbox-field"
              disabled={userNotPermitted}
            />
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
            <Field
              type="checkbox"
              name="resourceManagement"
              id="resourceManagement"
              className="checkbox-field"
              disabled={userNotPermitted}
            />
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
            <Field
              type="checkbox"
              name="userManagement"
              id="userManagement"
              className="checkbox-field"
              disabled={userNotPermitted}
            />
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
            disabled={userNotPermitted}
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
            disabled={userNotPermitted}
          />
          <ErrorMessage name="lastName" component={BootstrapForm.Text} className="text-danger" />
        </BootstrapForm.Group>

        {/* Chosen Name Field */}
        <BootstrapForm.Group as={Col} controlId="chosenName" md="6" className="slide-out-form">
          <BootstrapForm.Label>
            <b>{t('profile.chosenName')}</b>
          </BootstrapForm.Label>
          <Field
            name="chosenName"
            as={BootstrapForm.Control}
            placeholder={`${t('slideOut.chosenNameForm')}`}
            disabled={userNotPermitted}
          />
        </BootstrapForm.Group>

        {/* Language Field */}
        <BootstrapForm.Group as={Col} controlId="language" md="6" className="slide-out-form">
          <BootstrapForm.Label>
            <b>{t('profile.language')}</b>
          </BootstrapForm.Label>
          <BootstrapForm.Label className="asterisque">*</BootstrapForm.Label>
          <Field name="language" as={BootstrapForm.Select} disabled={userNotPermitted}>
            <option value="fr">{tCommon('fr')}</option>
            <option value="en">{tCommon('en')}</option>
          </Field>
        </BootstrapForm.Group>
      </div>
    </FormikForm>
  );
}

export default Form;

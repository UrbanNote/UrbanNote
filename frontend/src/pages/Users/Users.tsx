import { useEffect, useState } from 'react';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Button, Form as BootstrapForm, Col, Table } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { Scrollbar } from '$components';
import { createUser, getUsers } from '$firebase/auth';
import type { CreateUserData, GetUsersResponse } from '$firebase/auth';
import { usePageDetails } from '$hooks';

export function Users() {
  const { t } = useTranslation('users');
  usePageDetails({ title: t('title') });
  const [users, setUsers] = useState<GetUsersResponse>({ users: [], pageToken: undefined });

  const handleSubmit = async (values: CreateUserData) => {
    await createUser(values);
    const newUsers = await getUsers({ ipp: 10 });
    setUsers(newUsers);
  };

  useEffect(() => {
    (async () => {
      const newUsers = await getUsers({ ipp: 10 });
      setUsers(newUsers);
    })();
  }, [setUsers]);

  return (
    <>
      <h1>Users</h1>
      {users.users.length > 0 && (
        <Scrollbar className="w-100">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Enabled</th>
                <th>Email</th>
                <th>Email verified</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Chosen Name</th>
                <th>Language</th>
                <th>Admin</th>
                <th>Expense Management</th>
                <th>Resource Management</th>
                <th>User Management</th>
              </tr>
            </thead>
            <tbody>
              {users.users.map(userDetails => (
                <tr key={userDetails.id}>
                  <td>{userDetails.disabled ? 'No' : 'Yes'}</td>
                  <td>{userDetails.email}</td>
                  <td>{userDetails.emailVerified ? 'Yes' : 'No'}</td>
                  <td>{userDetails.profile?.firstName}</td>
                  <td>{userDetails.profile?.lastName}</td>
                  <td>{userDetails.profile?.chosenName}</td>
                  <td>{userDetails.profile?.language}</td>
                  <td>{userDetails.roles?.admin ? 'Yes' : 'No'}</td>
                  <td>{userDetails.roles?.expenseManagement ? 'Yes' : 'No'}</td>
                  <td>{userDetails.roles?.resourceManagement ? 'Yes' : 'No'}</td>
                  <td>{userDetails.roles?.userManagement ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Scrollbar>
      )}
      <h2>Create User</h2>
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          language: '',
          chosenName: '',
          admin: false,
          expenseManagement: false,
          resourceManagement: false,
          userManagement: false,
        }}
        onSubmit={handleSubmit}>
        {({ errors, touched }) => (
          <Form>
            {/* Email Field */}
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>Email</BootstrapForm.Label>
              <Field name="email" type="email" as={BootstrapForm.Control} isInvalid={touched.email && errors.email} />
              <ErrorMessage name="email" component={BootstrapForm.Text} className="text-danger" />
            </BootstrapForm.Group>

            {/* First Name Field */}
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>First Name</BootstrapForm.Label>
              <Field name="firstName" as={BootstrapForm.Control} isInvalid={touched.firstName && errors.firstName} />
              <ErrorMessage name="firstName" component={BootstrapForm.Text} className="text-danger" />
            </BootstrapForm.Group>

            {/* Last Name Field */}
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>Last Name</BootstrapForm.Label>
              <Field name="lastName" as={BootstrapForm.Control} isInvalid={touched.lastName && errors.lastName} />
              <ErrorMessage name="lastName" component={BootstrapForm.Text} className="text-danger" />
            </BootstrapForm.Group>

            {/* Language Field */}
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>Language</BootstrapForm.Label>
              <Field name="language" as={BootstrapForm.Control} isInvalid={touched.language && errors.language} />
              <ErrorMessage name="language" component={BootstrapForm.Text} className="text-danger" />
            </BootstrapForm.Group>

            {/* Chosen Name Field */}
            <BootstrapForm.Group as={Col} md="6">
              <BootstrapForm.Label>Chosen Name (Optional)</BootstrapForm.Label>
              <Field name="chosenName" as={BootstrapForm.Control} />
            </BootstrapForm.Group>

            {/* Boolean Fields */}
            <div>
              <Field type="checkbox" name="admin" />
              <label htmlFor="admin">Admin</label>
            </div>
            <div>
              <Field type="checkbox" name="expenseManagement" />
              <label htmlFor="expenseManagement">Expense Management</label>
            </div>
            <div>
              <Field type="checkbox" name="resourceManagement" />
              <label htmlFor="resourceManagement">Resource Management</label>
            </div>
            <div>
              <Field type="checkbox" name="userManagement" />
              <label htmlFor="userManagement">User Management</label>
            </div>

            {/* Submit Button */}
            <Button type="submit">Submit</Button>
          </Form>
        )}
      </Formik>
    </>
  );
}

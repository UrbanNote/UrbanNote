---
sidebar_position: 3
---

# API reference

This document provides a reference for the API endpoints available in the application. The API is built with [Google Cloud Functions](https://cloud.google.com/functions) and secured with [Firebase Authentication](https://firebase.google.com/products/auth). The API is accessible through the [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) and the [Firebase Client SDK](https://firebase.google.com/docs/web/setup).

Most requests will not return any data, since UrbanNote uses the web client to request and subscribe to data in Firestore. Only specific data reads will be made through this API, such as Firebase Auth users, which require the Admin SDK to be read.

## Roles

Roles are associated with users and determine their permissions in the application. The roles are stored in Firestore and are managed by the `auth` API. Here are the different roles in the application:

| Role                 | Description                                                                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `admin`              | The admin role grants full access to the application.                                                                                    |
| `expenseManagement`  | The expense management role allows users to create, modify and delete expenses of other users                                            |
| `resourceManagement` | The resource management role allows users to create, modify and delete resources of other users (not implemented yet)                    |
| `userManagement`     | The user management role allows users to create, modify and delete user profiles and roles, as well as create, enable and disable users. |

## Auth

Auth is an API used by users with the `admin` or `userManagement` role to manage authorized users and their roles on the application.

### Create User

<kbd>auth-createUser</kbd>

Creates a new user with the specified roles and profile information.

#### Arguments

| Argument           | Type      | Description                                              |
| ------------------ | --------- | -------------------------------------------------------- |
| firstName          | `string`  | The first name of the user.                              |
| lastName           | `string`  | The last name of the user.                               |
| email              | `string`  | The email address of the user.                           |
| emailVerified      | `boolean` | Indicates if the email address has been verified.        |
| language           | `string`  | The preferred language of the user.                      |
| chosenName         | `string`  | An optional chosen name for the user.                    |
| pictureId          | `string`  | An optional ID referencing the user's picture.           |
| disabled           | `boolean` | Indicates if the user is disabled.                       |
| admin              | `boolean` | Indicates if the user has administrative privileges.     |
| expenseManagement  | `boolean` | Indicates if the user has access to expense management.  |
| resourceManagement | `boolean` | Indicates if the user has access to resource management. |
| userManagement     | `boolean` | Indicates if the user has access to user management.     |

#### Errors

| Code                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `already-exists`    | The specified email address is already in use.                   |
| `permission-denied` | The requester doesn't have the `admin` or `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                              |

#### Response

This request does not return any data.

### Update User

<kbd>auth-updateUser</kbd>

#### Arguments

Updates the Firebase Auth user with specified fields­.

| Argument      | Type      | Description                                       |
| ------------- | --------- | ------------------------------------------------- |
| uid           | `string`  | The unique identifier of the authenticated user.  |
| disabled      | `boolean` | Indicates if the user is disabled.                |
| displayName   | `string`  | An optional display name for the user.            |
| email         | `string`  | An optional email address of the user.            |
| emailVerified | `boolean` | Indicates if the email address has been verified. |

#### Errors

| Code                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `not-found`         | The specified user doesn't exist.                                |
| `permission-denied` | The requester doesn't have the `admin` or `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                              |

#### Response

This request does not return any data.

### Disable User

<kbd>auth-disableUser</kbd>

Disables the Firebase Auth. It will need to be re-enabled to sign in again.

#### Arguments

| Argument | Type     | Description                    |
| -------- | -------- | ------------------------------ |
| id       | `string` | The ID of the user to disable. |

#### Errors

| Code                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `invalid-argument`  | The specified user is already disabled.                          |
| `permission-denied` | The requester doesn't have the `admin` or `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                              |

#### Response

This request does not return any data.

### Enable User

<kbd>auth-enableUser</kbd>

Enables the Firebase Auth so it can sign in again.

#### Arguments

| Argument | Type     | Description                   |
| -------- | -------- | ----------------------------- |
| id       | `string` | The ID of the user to enable. |

#### Errors

| Code                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `invalid-argument`  | The specified user is already enabled.                           |
| `permission-denied` | The requester doesn't have the `admin` or `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                              |

#### Response

This request does not return any data.

### Get Users

<kbd>auth-getUsers</kbd>

Retrieves Users with all their profile and role information.

#### Arguments

| Argument        | Type      | Description                                                              |
| --------------- | --------- | ------------------------------------------------------------------------ |
| ipp             | `number`  | Items per page.                                                          |
| pageToken       | `string`  | The next page token. If not specified, returns users without any offset. |
| disabledFilter  | `boolean` | Indicates whether to filter disabled users.                              |
| searchBarFilter | `string`  | A string to filter users by search bar.                                  |

#### Errors

| Code                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `permission-denied` | The requester doesn't have the `admin` or `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                              |

#### Response

| Argument  | Type                            | Description                                                              |
| --------- | ------------------------------- | ------------------------------------------------------------------------ |
| users     | [`UserDetails[]`](#userdetails) | An array containing details of users.                                    |
| pageToken | `string`                        | The next page token. If not specified, returns users without any offset. |

##### UserDetails

| Argument      | Type                                  | Description                                                |
| ------------- | ------------------------------------- | ---------------------------------------------------------- |
| id            | `string`                              | The unique identifier of the user.                         |
| profile       | [`UserProfile \| null`](#userprofile) | The profile details of the user, or null if not available. |
| roles         | [`UserRoles \| null`](#userroles)     | The roles assigned to the user, or null if not available.  |
| disabled      | `boolean`                             | Indicates if the user is disabled.                         |
| email         | `string \| undefined`                 | The email address of the user, if available.               |
| emailVerified | `boolean`                             | Indicates if the email address has been verified.          |

###### UserProfile

| Argument   | Type                  | Description                                    |
| ---------- | --------------------- | ---------------------------------------------- |
| id         | `string`              | The unique identifier of the user's profile.   |
| firstName  | `string`              | The first name of the user.                    |
| lastName   | `string`              | The last name of the user.                     |
| chosenName | `string \| undefined` | An optional chosen name for the user.          |
| email      | `string`              | The email address of the user.                 |
| pictureId  | `string \| undefined` | An optional ID referencing the user's picture. |
| language   | `string`              | The preferred language of the user.            |

###### UserRoles

| Argument           | Type      | Description                                              |
| ------------------ | --------- | -------------------------------------------------------- |
| id                 | `string`  | The unique identifier of the user's roles.               |
| admin              | `boolean` | Indicates if the user has administrative privileges.     |
| expenseManagement  | `boolean` | Indicates if the user has access to expense management.  |
| resourceManagement | `boolean` | Indicates if the user has access to resource management. |
| userManagement     | `boolean` | Indicates if the user has access to user management.     |

### Get Auth Users

<kbd>auth-getAuthUsers</kbd>

Retrieves Users with their Auth information only.

#### Arguments

| Argument        | Type      | Description                                                              |
| --------------- | --------- | ------------------------------------------------------------------------ |
| ipp             | `number`  | Items per page.                                                          |
| pageToken       | `string`  | The next page token. If not specified, returns users without any offset. |
| disabledFilter  | `boolean` | Indicates whether to filter disabled users.                              |
| searchBarFilter | `string`  | A string to filter users by search bar.                                  |

#### Errors

| Code                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| `permission-denied` | The requester doesn't have the `admin` or `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                              |

#### Response

| Argument  | Type                                    | Description                                                              |
| --------- | --------------------------------------- | ------------------------------------------------------------------------ |
| users     | [`AuthUserDetails[]`](#authuserdetails) | An array containing details of authenticated users.                      |
| pageToken | `string`                                | The next page token. If not specified, returns users without any offset. |

##### AuthUserDetails

| Argument      | Type      | Description                                       |
| ------------- | --------- | ------------------------------------------------- |
| uid           | `string`  | The unique identifier of the authenticated user.  |
| disabled      | `boolean` | Indicates if the user is disabled.                |
| displayName   | `string`  | An optional display name for the user.            |
| email         | `string`  | An optional email address of the user.            |
| emailVerified | `boolean` | Indicates if the email address has been verified. |

## Expenses

Expenses is an API that allows users to create and manage their expenses. The `expenseManagement` role is required to modify the expenses of other users, as well as the status of expenses.

### Create Expense

<kbd>expenses-createExpense</kbd>

Creates a new expense with the specified details.

#### Arguments

| Argument     | Type       | Description                                                         |
| ------------ | ---------- | ------------------------------------------------------------------- |
| assignedToId | `string`   | The ID of the user to whom the expense is assigned.                 |
| title        | `string`   | The title of the expense.                                           |
| description  | `string`   | An optional description of the expense.                             |
| date         | `string`   | The date of the expense in `YYYY/MM/DD` format.                     |
| amount       | `number`   | The amount of the expense.                                          |
| category     | `string`   | The category of the expense.                                        |
| pictureURL   | `string[]` | An optional array of URLs for pictures associated with the expense. |

#### Errors

| Code                | Description                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `invalid-argument`  | The amount is inferior or equal to zero, or the date is in the future.                                       |
| `permission-denied` | The requester attempted to create an expense for another user but doesn't have the `expenseManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                                                                          |

#### Response

This request does not return any data.

### Delete Expense

<kbd>expenses-deleteExpense</kbd>

Deletes an expense record.

#### Arguments

| Argument  | Type     | Description                           |
| --------- | -------- | ------------------------------------- |
| expenseId | `string` | The unique identifier of the expense. |

#### Errors

| Code                | Description                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `not-found`         | The specified expense doesn't exist.                                                                        |
| `permission-denied` | The requester has attempted to delete another user's expense and doesn't have the `expenseManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                                                                         |

#### Response

This request does not return any data.

### Delete all Expenses

<kbd>expenses-deleteAllExpenses</kbd>

Deletes all the expenses of a user.

#### Arguments

| Argument     | Type     | Description                                           |
| ------------ | -------- | ----------------------------------------------------- |
| assignedToId | `string` | The ID of the user to whom the expenses are assigned. |

#### Errors

| Code                | Description                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `not-found`         | The specified user doesn't exist.                                                                            |
| `permission-denied` | The requester has attempted to delete another user's expenses and doesn't have the `expenseManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                                                                          |

#### Response

This request does not return any data.

### Update Expense

<kbd>expenses-updateExpense</kbd>

Updates the specified fields of an existing expense record.

#### Arguments

| Argument  | Type                                                | Description                                |
| --------- | --------------------------------------------------- | ------------------------------------------ |
| expenseId | `string`                                            | The unique identifier of the expense.      |
| updates   | [`ExpenseDetailsToUpdate`](#expensedetailstoupdate) | An object containing the fields to update. |

#### ExpenseDetailsToUpdate

All fields are optional.

| Argument     | Type                                      | Description                                                         |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------- |
| assignedToId | `string`                                  | The ID of the user to whom the expense is assigned.                 |
| title        | `string`                                  | The title of the expense.                                           |
| description  | `string`                                  | An optional description of the expense.                             |
| date         | `string`                                  | The date of the expense in `YYYY/MM/DD` format.                     |
| amount       | `number`                                  | The amount of the expense.                                          |
| pictureURL   | `string[]`                                | An optional array of URLs for pictures associated with the expense. |
| category     | [`ExpenseCategories`](#expensecategories) | The category of the expense.                                        |

##### ExpenseCategories

| Key           | Name        |
| ------------- | ----------- |
| `travel`      | Travel      |
| `parking`     | Parking     |
| `equipment`   | Equipment   |
| `restaurant`  | Restaurant  |
| `convenience` | Convenience |
| `grocery`     | Grocery     |

#### Errors

| Code                | Description                                                                                                                                                            |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `not-found`         | The specified expense doesn't exist.                                                                                                                                   |
| `invalid-argument`  | The amount is inferior or equal to zero or the date is in the future, or the expense is too old (over one year old).                                                   |
| `permission-denied` | The requester has attempted to update another user's expense and doesn't have the `expenseManagement` role, or the expense is already accepted and cannot be modified. |
| `unauthenticated`   | The requester is not authenticated.                                                                                                                                    |

#### Response

This request does not return any data.

### Update Expense Status

<kbd>expenses-updateExpenseStatus</kbd>

Updates the status of an existing expense record. Requires the `expenseManagement` role.

#### Arguments

| Argument  | Type                              | Description                           |
| --------- | --------------------------------- | ------------------------------------- |
| expenseId | `string`                          | The unique identifier of the expense. |
| status    | [`ExpenseStatus`](#expensestatus) | The new status of the expense.        |

##### ExpenseStatus

| Status     | Description                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------- |
| `archived` | An archived expense will not appear in user queries anymore.                                   |
| `accepted` | An accepted expense is considered valid and will be reimbursed.                                |
| `pending`  | A pending expense is waiting for approval. This is the default status.                         |
| `rejected` | A rejected expense is considered invalid and will not be reimbursed. It may still be modified. |

#### Errors

| Code                | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `not-found`         | The specified expense doesn't exist.                     |
| `permission-denied` | The requester doesn't have the `expenseManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                      |

#### Response

This request does not return any data.

## Storage

The Storage API allows users to manipulate files stored in Firebase Storage.

Files have a set of custom metadata keys that are used to manage permissions:

- `userId`: this key is set upon creation. If the file isn't associated with another entity, only this user may edit or delete it.

- `entityId`: this key is set upon association with another entity. If the file is associated with another entity, only the user who created the entity, or a user with the entity's management role may edit or delete it.

- `entityType`: this key is set upon association with another entity. It is used to determine the entity's type. Possible values are `expense` and `resource`.

### Delete File

<kbd>storage-deleteFile</kbd>

Deletes a file from Firebase Storage.

#### Arguments

| Argument | Type                 | Description                                            |
| -------- | -------------------- | ------------------------------------------------------ |
| paths    | `string[] \| string` | The path(s) of the file(s) in Cloud Storage to delete. |

#### Errors

| Code                | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `not-found`         | The specified file doesn't exist.                                        |
| `permission-denied` | The requester doesn't have the necessary permissions to delete the file. |
| `unauthenticated`   | The requester is not authenticated.                                      |

#### Response

This request does not return any data.

## Users

The Users API allows users to create and manage their own profiles and roles. The `userManagement` role is required to modify the profiles and roles of other users, or to grant yourself specific roles. The `admin` role is required to grant the `admin` role.

### Create User Profile

<kbd>users-createUserProfile</kbd>

Creates a new user profile with the specified details.

#### Arguments

| Argument   | Type                  | Description                                                                                                 |
| ---------- | --------------------- | ----------------------------------------------------------------------------------------------------------- |
| userId     | `string \| undefined` | The ID of the user to whom the profile is assigned. If left blank, the requester's id will be used instead. |
| firstName  | `string`              | The first name of the user.                                                                                 |
| lastName   | `string`              | The last name of the user.                                                                                  |
| chosenName | `string`              | An optional chosen name for the user.                                                                       |
| email      | `string`              | The email address of the user.                                                                              |
| pictureId  | `string`              | An optional ID referencing the user's picture.                                                              |
| language   | `string`              | The preferred language of the user.                                                                         |

#### Errors

| Code                | Description                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------ |
| `already-exists`    | The specified user id or email already has a profile associated.                                             |
| `permission-denied` | The requester has attempted to create a profile for another user and doesn't have the `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                                                                          |

#### Response

This request does not return any data.

### Create User Roles

<kbd>users-createUserRoles</kbd>

Creates a new user roles with the specified details. The `admin` role is required to grant the `admin` role. The `userManagement` role is required to grant the any other role, or create the roles document of another user.

#### Arguments

| Argument           | Type                   | Description                                              |
| ------------------ | ---------------------- | -------------------------------------------------------- |
| userId             | `string`               | The ID of the user to whom the roles are assigned.       |
| admin              | `boolean \| undefined` | Indicates if the user has administrative privileges.     |
| expenseManagement  | `boolean \| undefined` | Indicates if the user has access to expense management.  |
| resourceManagement | `boolean \| undefined` | Indicates if the user has access to resource management. |
| userManagement     | `boolean \| undefined` | Indicates if the user has access to user management.     |

#### Errors

| Code                | Description                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `already-exists`    | The specified user already has roles associated.                                                         |
| `permission-denied` | The requester has attempted to create roles for another user and doesn't have the `userManagement` role. |
| `unauthenticated`   | The requester is not authenticated.                                                                      |

#### Response

This request does not return any data.

### Update User Profile

<kbd>users-updateUserProfile</kbd>

Updates the specified fields of an existing user profile.

#### Arguments

| Argument   | Type                  | Description                                                                                              |
| ---------- | --------------------- | -------------------------------------------------------------------------------------------------------- |
| userId     | `string \| undefined` | The ID of the user to whom the profile is assigned. If left blank, the id of the requester will be used. |
| firstName  | `string \| undefined` | Optional - A new first name for the user.                                                                |
| lastName   | `string \| undefined` | Optional - A new last name for the user.                                                                 |
| chosenName | `string \| undefined` | Optional - A new chosen name for the user.                                                               |
| email      | `string \| undefined` | Optional - A new email address for the user.                                                             |
| pictureId  | `string \| undefined` | Optional - A new ID referencing the user's picture.                                                      |

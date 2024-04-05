---
sidebar_position: 3
---

# Référence de l'API

Ce document fournit une référence pour les points de terminaison de l'API disponibles dans l'application. L'API est construite avec [Google Cloud Functions](https://cloud.google.com/functions) et sécurisée avec [Firebase Authentication](https://firebase.google.com/products/auth). L'API est accessible via le [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup) et le [Firebase Client SDK](https://firebase.google.com/docs/web/setup).

La plupart des requêtes ne retourneront aucune donnée, car UrbanNote utilise le client web pour demander et s'abonner aux données dans Firestore. Seules des lectures de données spécifiques seront effectuées via cette API, telles que les utilisateurs de Firebase Auth, qui nécessitent que le SDK Admin soit lu.

## Rôles

Les rôles sont associés aux utilisateurs et déterminent leurs permissions dans l'application. Les rôles sont stockés dans Firestore et sont gérés par l'API auth. Voici les différents rôles dans l'application :

| Rôle                 | Description                                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `admin`              | Le rôle d'administrateur accorde un accès complet à l'application.                                                                                                                               |
| `expenseManagement`  | Le rôle de gestion des dépenses permet aux utilisateurs de créer, modifier et supprimer les dépenses des autres utilisateurs.                                                                    |
| `resourceManagement` | Le rôle de gestion des ressources permet aux utilisateurs de créer, modifier et supprimer les ressources des autres utilisateurs (pas encore implémenté).                                        |
| `userManagement`     | Le rôle de gestion des utilisateurs permet aux utilisateurs de créer, modifier et supprimer des profils et des rôles d'utilisateurs, ainsi que de créer, activer et désactiver des utilisateurs. |

## Auth

Auth est une API utilisée par les utilisateurs ayant le rôle `admin` ou `userManagement` pour gérer les utilisateurs autorisés et leurs rôles dans l'application.

### Créer un utilisateur

<kbd>auth-createUser</kbd>

Crée un nouvel utilisateur avec les rôles et les informations de profil spécifiés.

#### Arguments

| Argument           | Type      | Description                                                     |
| ------------------ | --------- | --------------------------------------------------------------- |
| firstName          | `string`  | Le prénom de l'utilisateur.                                     |
| lastName           | `string`  | Le nom de famille de l'utilisateur.                             |
| email              | `string`  | L'adresse e-mail de l'utilisateur.                              |
| emailVerified      | `boolean` | Indique si l'adresse e-mail a été vérifiée.                     |
| language           | `string`  | La langue préférée de l'utilisateur.                            |
| chosenName         | `string`  | Un nom choisi facultatif pour l'utilisateur.                    |
| pictureId          | `string`  | Un identifiant facultatif référençant l'image de l'utilisateur. |
| disabled           | `boolean` | Indique si l'utilisateur est désactivé.                         |
| admin              | `boolean` | Indique si l'utilisateur a des privilèges administratifs.       |
| expenseManagement  | `boolean` | Indique si l'utilisateur a accès à la gestion des dépenses.     |
| resourceManagement | `boolean` | Indique si l'utilisateur a accès à la gestion des ressources.   |
| userManagement     | `boolean` | Indique si l'utilisateur a accès à la gestion des utilisateurs. |

#### Erreurs

| Code                | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `already-exists`    | L'adresse e-mail spécifiée est déjà utilisée.             |
| `permission-denied` | Le demandeur n'a pas le rôle `admin` ou `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                       |

#### Réponse

Cette requête ne retourne aucune donnée.

### Mettre à jour un utilisateur

<kbd>auth-updateUser</kbd>

Met à jour l'utilisateur Firebase Auth avec les champs spécifiés.

#### Arguments

| Argument      | Type      | Description                                        |
| ------------- | --------- | -------------------------------------------------- |
| uid           | `string`  | L'identifiant unique de l'utilisateur authentifié. |
| disabled      | `boolean` | Indique si l'utilisateur est désactivé.            |
| displayName   | `string`  | Un nom d'affichage facultatif pour l'utilisateur.  |
| email         | `string`  | Une adresse e-mail facultative de l'utilisateur.   |
| emailVerified | `boolean` | Indique si l'adresse e-mail a été vérifiée.        |

#### Erreurs

| Code                | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `not-found`         | L'utilisateur spécifié n'existe pas.                      |
| `permission-denied` | Le demandeur n'a pas le rôle `admin` ou `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                       |

#### Réponse

Cette requête ne retourne aucune donnée.

### Désactiver un utilisateur

<kbd>auth-disableUser</kbd>

Désactive l'authentification Firebase. Elle devra être réactivée pour permettre une nouvelle connexion.

#### Arguments

| Argument | Type     | Description                         |
| -------- | -------- | ----------------------------------- |
| id       | `string` | L'ID de l'utilisateur à désactiver. |

#### Erreurs

| Code                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `invalid- argument` | L'utilisateur spécifié est déjà désactivé.                  |
| `permission-denied` | Le demandeur n'a pas les rôles `admin` ou `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                         |

#### Réponse

Cette requête ne retourne aucune donnée.

### Activer un utilisateur

<kbd>auth-enableUser</kbd>

Active l'authentification Firebase pour permettre une nouvelle connexion.

#### Arguments

| Argument | Type     | Description                      |
| -------- | -------- | -------------------------------- |
| id       | `string` | L'ID de l'utilisateur à activer. |

#### Erreurs

| Code                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `invalid-argument`  | L'utilisateur spécifié est déjà activé.                     |
| `permission-denied` | Le demandeur n'a pas les rôles `admin` ou `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                         |

#### Réponse

Cette requête ne retourne aucune donnée.

### Obtenir des utilisateurs

<kbd>auth-getUsers</kbd>

Récupère les utilisateurs avec toutes leurs informations de profil et de rôle.

#### Arguments

| Argument        | Type      | Description                                                                             |
| --------------- | --------- | --------------------------------------------------------------------------------------- |
| ipp             | `number`  | Éléments par page.                                                                      |
| pageToken       | `string`  | Le jeton de la page suivante. Si non spécifié, retourne les utilisateurs sans décalage. |
| disabledFilter  | `boolean` | Indique si les utilisateurs désactivés doivent être filtrés.                            |
| searchBarFilter | `string`  | Une chaîne pour filtrer les utilisateurs via la barre de recherche.                     |

#### Erreurs

| Code                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `permission-denied` | Le demandeur n'a pas les rôles `admin` ou `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                         |

#### Réponse

| Argument  | Type                            | Description                                                                             |
| --------- | ------------------------------- | --------------------------------------------------------------------------------------- |
| users     | [`UserDetails[]`](#userdetails) | Un tableau contenant les détails des utilisateurs.                                      |
| pageToken | `string`                        | Le jeton de la page suivante. Si non spécifié, retourne les utilisateurs sans décalage. |

##### UserDetails

| Argument      | Type                                  | Description                                                        |
| ------------- | ------------------------------------- | ------------------------------------------------------------------ |
| id            | `string`                              | L'identifiant unique de l'utilisateur.                             |
| profile       | [`UserProfile \| null`](#userprofile) | Les détails du profil de l'utilisateur, ou null si non disponible. |
| roles         | [`UserRoles \| null`](#userroles)     | Les rôles attribués à l'utilisateur, ou null si non disponible.    |
| disabled      | `boolean`                             | Indique si l'utilisateur est désactivé.                            |
| email         | `string \| undefined`                 | L'adresse e-mail de l'utilisateur, si disponible.                  |
| emailVerified | `boolean`                             | Indique si l'adresse e-mail a été vérifiée.                        |

###### UserProfile

| Argument   | Type                  | Description                                                     |
| ---------- | --------------------- | --------------------------------------------------------------- |
| id         | `string`              | L'identifiant unique du profil de l'utilisateur.                |
| firstName  | `string`              | Le prénom de l'utilisateur.                                     |
| lastName   | `string`              | Le nom de famille de l'utilisateur.                             |
| chosenName | `string \| undefined` | Un nom choisi facultatif pour l'utilisateur.                    |
| email      | `string`              | L'adresse e-mail de l'utilisateur.                              |
| pictureId  | `string \| undefined` | Un identifiant facultatif référençant l'image de l'utilisateur. |
| language   | `string`              | La langue préférée de l'utilisateur.                            |

###### UserRoles

| Argument           | Type      | Description                                                     |
| ------------------ | --------- | --------------------------------------------------------------- |
| id                 | `string`  | L'identifiant unique des rôles de l'utilisateur.                |
| admin              | `boolean` | Indique si l'utilisateur possède des privilèges administratifs. |
| expenseManagement  | `boolean` | Indique si l'utilisateur a accès à la gestion des dépenses.     |
| resourceManagement | `boolean` | Indique si l'utilisateur a accès à la gestion des ressources.   |
| userManagement     | `boolean` | Indique si l'utilisateur a accès à la gestion des utilisateurs. |

### Obtenir les utilisateurs d'Auth

<kbd>auth-getAuthUsers</kbd>

Récupère les utilisateurs avec uniquement leurs informations d'Auth.

#### Arguments

| Argument        | Type      | Description                                                                             |
| --------------- | --------- | --------------------------------------------------------------------------------------- |
| ipp             | `number`  | Éléments par page.                                                                      |
| pageToken       | `string`  | Le jeton de la page suivante. Si non spécifié, retourne les utilisateurs sans décalage. |
| disabledFilter  | `boolean` | Indique si les utilisateurs désactivés doivent être filtrés.                            |
| searchBarFilter | `string`  | Une chaîne pour filtrer les utilisateurs via la barre de recherche.                     |

#### Erreurs

| Code                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `permission-denied` | Le demandeur n'a pas les rôles `admin` ou `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                         |

#### Réponse

| Argument  | Type                                    | Description                                                                             |
| --------- | --------------------------------------- | --------------------------------------------------------------------------------------- |
| users     | [`AuthUserDetails[]`](#authuserdetails) | Un tableau contenant les détails des utilisateurs authentifiés.                         |
| pageToken | `string`                                | Le jeton de la page suivante. Si non spécifié, retourne les utilisateurs sans décalage. |

##### AuthUserDetails

| Argument      | Type      | Description                                        |
| ------------- | --------- | -------------------------------------------------- |
| uid           | `string`  | L'identifiant unique de l'utilisateur authentifié. |
| disabled      | `boolean` | Indique si l'utilisateur est désactivé.            |
| displayName   | `string`  | Un nom d'affichage facultatif pour l'utilisateur.  |
| email         | `string`  | Une adresse e-mail facultative de l'utilisateur.   |
| emailVerified | `boolean` | Indique si l'adresse e-mail a été vérifiée.        |

## Dépenses

Expenses est une API qui permet aux utilisateurs de créer et de gérer leurs dépenses. Le rôle `expenseManagement` est nécessaire pour modifier les dépenses d'autres utilisateurs, ainsi que le statut des dépenses.

### Créer une dépense

<kbd>expenses-createExpense</kbd>

Crée une nouvelle dépense avec les détails spécifiés.

#### Arguments

| Argument     | Type       | Description                                                          |
| ------------ | ---------- | -------------------------------------------------------------------- |
| assignedToId | `string`   | L'ID de l'utilisateur auquel la dépense est assignée.                |
| title        | `string`   | Le titre de la dépense.                                              |
| description  | `string`   | Une description facultative de la dépense.                           |
| date         | `string`   | La date de la dépense au format `AAAA/MM/JJ`.                        |
| amount       | `number`   | Le montant de la dépense.                                            |
| category     | `string`   | La catégorie de la dépense.                                          |
| pictureURL   | `string[]` | Un tableau facultatif d'URLs pour les images associées à la dépense. |

#### Erreurs

| Code                | Description                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `invalid-argument`  | Le montant est inférieur ou égal à zéro, ou la date est dans le futur.                                      |
| `permission-denied` | Le demandeur a tenté de créer une dépense pour un autre utilisateur sans avoir le rôle `expenseManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                         |

#### Réponse

Cette requête ne retourne aucune donnée.

### Supprimer une dépense

<kbd>expenses-deleteExpense</kbd>

Supprime un enregistrement de dépense.

#### Arguments

| Argument  | Type     | Description                         |
| --------- | -------- | ----------------------------------- |
| expenseId | `string` | L'identifiant unique de la dépense. |

#### Erreurs

| Code                | Description                                                                                                 |
| ------------------- | ----------------------------------------------------------------------------------------------------------- |
| `not-found`         | La dépense spécifiée n'existe pas.                                                                          |
| `permission-denied` | Le demandeur a tenté de supprimer la dépense d'un autre utilisateur sans avoir le rôle `expenseManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                         |

#### Réponse

Cette requête ne retourne aucune donnée.

### Supprimer toutes les dépenses

<kbd>expenses-deleteAllExpenses</kbd>

Supprime toutes les dépenses d'un utilisateur.

#### Arguments

| Argument     | Type     | Description                                                      |
| ------------ | -------- | ---------------------------------------------------------------- |
| assignedToId | `string` | L'ID de l'utilisateur dont les dépenses doivent être supprimées. |

#### Erreurs

| Code                | Description                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `not-found`         | L'utilisateur spécifié n'existe pas.                                                                          |
| `permission-denied` | Le demandeur a tenté de supprimer les dépenses d'un autre utilisateur sans avoir le rôle `expenseManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                           |

#### Réponse

Cette requête ne retourne aucune donnée.

### Mettre à jour une dépense

<kbd>expenses-updateExpense</kbd>

Met à jour les champs spécifiés d'un enregistrement de dépense existant.

#### Arguments

| Argument  | Type                                                | Description                                    |
| --------- | --------------------------------------------------- | ---------------------------------------------- |
| expenseId | `string`                                            | L'identifiant unique de la dépense.            |
| updates   | [`ExpenseDetailsToUpdate`](#expensedetailstoupdate) | Un objet contenant les champs à mettre à jour. |

#### ExpenseDetailsToUpdate

Tous les champs sont facultatifs.

| Argument     | Type                                      | Description                                                          |
| ------------ | ----------------------------------------- | -------------------------------------------------------------------- |
| assignedToId | `string`                                  | L'ID de l'utilisateur auquel la dépense est assignée.                |
| title        | `string`                                  | Le titre de la dépense.                                              |
| description  | `string`                                  | Une description facultative de la dépense.                           |
| date         | `string`                                  | La date de la dépense au format `AAAA/MM/JJ`.                        |
| amount       | `number`                                  | Le montant de la dépense.                                            |
| pictureURL   | `string[]`                                | Un tableau facultatif d'URLs pour les images associées à la dépense. |
| category     | [`ExpenseCategories`](#expensecategories) | La catégorie de la dépense.                                          |

##### ExpenseCategories

| Clé           | Nom           |
| ------------- | ------------- |
| `travel`      | Déplacement   |
| `parking`     | Stationnement |
| `equipment`   | Équipement    |
| `restaurant`  | Restaurant    |
| `convenience` | Dépanneur     |
| `grocery`     | Épicerie      |

#### Erreurs

| Code                | Description                                                                                                                                                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `not-found`         | La dépense spécifiée n'existe pas.                                                                                                                                        |
| `invalid-argument`  | Le montant est inférieur ou égal à zéro, ou la date est dans le futur, ou la dépense est trop vieille (plus d'un an).                                                     |
| `permission-denied` | Le demandeur a tenté de mettre à jour la dépense d'un autre utilisateur sans avoir le rôle `expenseManagement`, ou la dépense est déjà acceptée et ne peut être modifiée. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                                                                                       |

#### Réponse

Cette requête ne retourne aucune donnée.

### Mettre à jour le statut d'une dépense

<kbd>expenses-updateExpenseStatus</kbd>

Met à jour le statut d'une dépense existante. Requiert le rôle `expenseManagement`.

#### Arguments

| Argument  | Type                              | Description                         |
| --------- | --------------------------------- | ----------------------------------- |
| expenseId | `string`                          | L'identifiant unique de la dépense. |
| status    | [`ExpenseStatus`](#expensestatus) | Le nouveau statut de la dépense.    |

##### ExpenseStatus

| Statut     | Description                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `archived` | Une dépense archivée n'apparaîtra plus dans les requêtes des utilisateurs.                            |
| `accepted` | Une dépense acceptée est considérée comme valide et sera remboursée.                                  |
| `pending`  | Une dépense en attente attend une approbation. C'est le statut par défaut.                            |
| `rejected` | Une dépense rejetée est considérée comme invalide et ne sera pas remboursée. Elle peut être modifiée. |

#### Erreurs

| Code                | Description                                       |
| ------------------- | ------------------------------------------------- |
| `not-found`         | La dépense spécifiée n'existe pas.                |
| `permission-denied` | Le demandeur n'a pas le rôle `expenseManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.               |

#### Réponse

Cette requête ne retourne aucune donnée.

## Stockage

L'API Stockage permet aux utilisateurs de manipuler des fichiers stockés dans Firebase Storage.

Les fichiers disposent d'un ensemble de clés de métadonnées personnalisées qui sont utilisées pour gérer les permissions :

- `userId` : cette clé est définie lors de la création. Si le fichier n'est associé à aucune autre entité, seul cet utilisateur peut le modifier ou le supprimer.

- `entityId` : cette clé est définie lors de l'association à une autre entité. Si le fichier est associé à une autre entité, seul l'utilisateur qui a créé l'entité, ou un utilisateur ayant le rôle de gestion de l'entité, peut le modifier ou le supprimer.

- `entityType` : cette clé est définie lors de l'association à une autre entité. Elle est utilisée pour déterminer le type de l'entité. Les valeurs possibles sont `expense` et `resource`.

### Supprimer un fichier

<kbd>storage-deleteFile</kbd>

Supprime un fichier de Firebase Storage.

#### Arguments

| Argument | Type                 | Description                                                         |
| -------- | -------------------- | ------------------------------------------------------------------- |
| paths    | `string[] \| string` | Le(s) chemin(s) du (des) fichier(s) à supprimer dans Cloud Storage. |

#### Erreurs

| Code                | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `not-found`         | Le fichier spécifié n'existe pas.                                           |
| `permission-denied` | Le demandeur n'a pas les permissions nécessaires pour supprimer le fichier. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                         |

#### Réponse

Cette requête ne retourne aucune donnée.

## Utilisateurs

L'API Utilisateurs permet de créer et de gérer ses propres profils et rôles. Le rôle `userManagement` est nécessaire pour modifier les profils et rôles d'autres utilisateurs, ou pour s'attribuer des rôles spécifiques. Le rôle `admin` est nécessaire pour attribuer le rôle `admin`.

### Créer un profil utilisateur

<kbd>users-createUserProfile</kbd>

Crée un nouveau profil utilisateur avec les détails spécifiés.

#### Arguments

| Argument   | Type                  | Description                                                                                         |
| ---------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| userId     | `string \| undefined` | L'ID de l'utilisateur auquel le profil est assigné. Si laissé vide, l'ID du demandeur sera utilisé. |
| firstName  | `string`              | Le prénom de l'utilisateur.                                                                         |
| lastName   | `string`              | Le nom de famille de l'utilisateur.                                                                 |
| chosenName | `string`              | Un nom choisi facultatif pour l'utilisateur.                                                        |
| email      | `string`              | L'adresse e-mail de l'utilisateur.                                                                  |
| pictureId  | `string`              | Un identifiant facultatif référençant l'image de l'utilisateur.                                     |
| language   | `string`              | La langue préférée de l'utilisateur.                                                                |

#### Erreurs

| Code                | Description                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| `already-exists`    | L'ID ou l'e-mail spécifié de l'utilisateur a déjà un profil associé.                                   |
| `permission-denied` | Le demandeur a tenté de créer un profil pour un autre utilisateur sans avoir le rôle `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                    |

#### Réponse

Cette requête ne retourne aucune donnée.

### Créer des rôles utilisateur

<kbd>users-createUserRoles</kbd>

Crée de nouveaux rôles utilisateur avec les détails spécifiés. Le rôle `admin` est nécessaire pour attribuer le rôle `admin`. Le rôle `userManagement` est nécessaire pour attribuer n'importe quel autre rôle ou créer le document de rôles d'un autre utilisateur.

#### Arguments

| Argument           | Type                   | Description                                                     |
| ------------------ | ---------------------- | --------------------------------------------------------------- |
| userId             | `string`               | L'ID de l'utilisateur auquel les rôles sont assignés.           |
| admin              | `boolean \| undefined` | Indique si l'utilisateur possède des privilèges administratifs. |
| expenseManagement  | `boolean \| undefined` | Indique si l'utilisateur a accès à la gestion des dépenses.     |
| resourceManagement | `boolean \| undefined` | Indique si l'utilisateur a accès à la gestion des ressources.   |
| userManagement     | `boolean \| undefined` | Indique si l'utilisateur a accès à la gestion des utilisateurs. |

#### Erreurs

| Code                | Description                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| `already-exists`    | L'utilisateur spécifié a déjà des rôles associés.                                                      |
| `permission-denied` | Le demandeur a tenté de créer des rôles pour un autre utilisateur sans avoir le rôle `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                    |

#### Réponse

Cette requête ne retourne aucune donnée.

### Mettre à jour un profil utilisateur

<kbd>users-updateUserProfile</kbd>

Met à jour les champs spécifiés d'un profil utilisateur existant.

#### Arguments

| Argument   | Type                  | Description                                                                                         |
| ---------- | --------------------- | --------------------------------------------------------------------------------------------------- |
| userId     | `string \| undefined` | L'ID de l'utilisateur auquel le profil est assigné. Si laissé vide, l'ID du demandeur sera utilisé. |
| firstName  | `string \| undefined` | Facultatif - Un nouveau prénom pour l'utilisateur.                                                  |
| lastName   | `string \| undefined` | Facultatif - Un nouveau nom de famille pour l'utilisateur.                                          |
| chosenName | `string \| undefined` | Facultatif - Un nouveau nom choisi pour l'utilisateur.                                              |
| email      | `string \| undefined` | Facultatif - Une nouvelle adresse e-mail pour l'utilisateur.                                        |
| pictureId  | `string \| undefined` | Facultatif - Un nouvel identifiant référençant l'image de l'utilisateur.                            |

#### Erreurs

| Code                | Description                                                                                                    |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `not-found`         | L'utilisateur spécifié n'existe pas.                                                                           |
| `permission-denied` | Le demandeur a tenté de mettre à jour un profil pour un autre utilisateur sans avoir le rôle `userManagement`. |
| `unauthenticated`   | Le demandeur n'est pas authentifié.                                                                            |

#### Réponse

Cette requête ne retourne aucune donnée.

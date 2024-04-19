# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-04-18

### Added

- Users with `userManagement` role may now update the userRoles of other users
- More enhanced permission management for user modification
- Add conditions for deleting images with the deleteFile function in the backend.
- Add unit tests for the storage module.
- Re-enabled the global test coverage minimums to ensure the effectiveness of our unit tests.
- Updated the documentation on Docusaurus to include the user guide.
- Add help center
- Integrate training videos for expenses creation and management
- Add condition to make sure you're presented with the onboarding page after loggin if you don't have a profile.
- Add greeting in the home page with your chosen name, or if you don't have one, your first and last name
- Integrate training videos for users management
- Add a UserObserver to optimise user's modification

### Fixed

- Add missing user selector in the mobile view of expenses management filters
- Fix the expenses query failing automatically and show an error message when the query fails
- Fix slideOut title format
- Fix the bug related to the expense slide-out opening. Previously, when adding a photo, the button to edit an expense remained disabled.
- Disable the submit button for user modification in case of no modification in the form
- Fix user modification when this user doesn't have a userProfile and/or userRoles
- Transform onboarding into Formik to prevent problems related to cold start

## [1.1.0] - 2024-04-05

### Added

- Add user settings interface
- Rework the user management interface with filters, spinner, no tabs in the Slide-Out UI
- Allow users to delete their expenses and its pictures
- Add a manifest so the app can be installed on mobile devices
- Add coverage report for the backend
- Display version in app's sign in and home page
- The splash screen now waits until all user data is retrieved before hiding
- Roles are now created by default if they don't exist upon app startup
- New filters were added to the Expenses view: time period, status, as well as user for users with the `expenseManagement` role.
- Users with the `expenseManagement` role may now update the status of expenses.

### Fixed

- Fix title overflow in expenses when title is too long
- Fix some error messages on the settings interface
- Adjust Slide-Out UI to normalize cancellation behavior
- Fix visual bugs with the amount input in the expense creation form

## [1.0.1] - 2024-02-16

### Added

- Add auto image compression upon upload

### Fixed

- Fixed a bug where the upload limit was too small. Bumped the limit to 20MB.

## [1.0.0] - 2024-02-15

### Added

- Initial release that lets users upload receipts and create expenses. There is also a really basic interface for creating and managing users, accessible for users with the `admin` or `userManagement` role.

[1.2.0]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.2.0
[1.1.0]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.1.0
[1.0.1]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.0.1
[1.0.0]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.0.0

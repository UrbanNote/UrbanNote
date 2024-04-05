# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1.1.0] - 2024-04-05

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

## [v1.0.1] - 2024-02-16

### Added

- Add auto image compression upon upload

### Fixed

- Fixed a bug where the upload limit was too small. Bumped the limit to 20MB.

## [v1.0.0] - 2024-02-15

### Added

- Initial release that lets users upload receipts and create expenses. There is also a really basic interface for creating and managing users, accessible for users with the `admin` or `userManagement` role.

[1.1.0]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.1.0
[1.0.1]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.0.1
[1.0.0]: https://github.com/UrbanNote/UrbanNote/releases/tag/v1.0.0

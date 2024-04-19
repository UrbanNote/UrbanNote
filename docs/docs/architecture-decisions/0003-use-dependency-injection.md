# 3. Use Dependency Injection

Date: 2024-01-19

## Context

The backend, while being developed with Firebase will still require testability and maintainability. We need to be able to mock services and repositories for unit tests and to be able to easily switch implementations of services and repositories.

## Decision

We will use [Microsoft's Dependency Injection library TSyringe](https://github.com/microsoft/tsyringe) to handle dependency injection in the backend. This library is very simple to use and has a lot of features that will help us with our testing and maintainability needs.

## Consequences

We will have to learn how to use TSyringe, but the documentation is very good and there is a lot of community support. We will also have to refactor the code to use dependency injection, but this will make the code more testable and maintainable in the long run.

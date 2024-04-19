# 1. Implement CLEAN Architecture

Date: 2024-01-08

## Context

The project requires a scalable, testable and maintanable architecture. When designing this project, we need to consider that the codebase will grow and that we will have to add new features and fix bugs. We also need to consider that the project will be maintained by different developers over time.

## Decision

We will implement the CLEAN Architecture. [Read more about it here](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). Our
implementation will be a simplified version that will connect entities directly to the database, since creating adapters for each entity would be overkill for this project's size.

## Consequences

The backend will use four main layers :

- **Entities**: which will consist of type definitions for the data that will be stored in the database.
- **Interactors**: which will contain the business logic of the application.
- **Controllers**: which will be responsible for handling the HTTP requests and responses.
- **Repositories**: which will be responsible for handling the database operations.

For now, we will only test the business logic through unit tests. If the application grows enough, we will consider integration and end-to-end tests.

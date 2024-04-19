# 2. Migrate backend from .NET to Firebase

Date: 2024-01-19

## Context

The base backend project was being developed in .NET, but the pricing scheme of related cloud providers didn't match the organization's budget. The code also required a lot of boilerplate and to get a MVP up and running, we needed a faster solution.

## Decision

We decided to migrate the backend from .NET to Firebase. Firebase is a backend as a service that provides a lot of features out of the box, such as authentication, database, and cloud functions. It is also pay by usage, which is more aligned with the organization's budget, since we don't see it scaling to a point where the free tier would be surpassed.

## Consequences

The migration will require a lot of code changes, but we expect to have a faster development cycle and a more stable backend. We will also have to learn how to use Firebase, but the documentation is very good and there is a lot of community support.

In order to keep the costs of the Firebase suite to a minimum, we will try to optimize the user experience to minimize queries. Thus, there will generally be one page per module and interactions with entities will take place in dynamic components such as a modal or a slide-out.

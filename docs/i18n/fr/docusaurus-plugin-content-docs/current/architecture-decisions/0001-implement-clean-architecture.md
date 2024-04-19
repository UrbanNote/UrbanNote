# 1. Implémenter l'architecture CLEAN

Date : 2024-01-08

## Contexte

Le projet nécessite une architecture évolutive, testable et maintenable. Lors de la conception de ce projet, nous devons considérer que la base de code va s'agrandir et que nous devrons ajouter de nouvelles fonctionnalités et corriger des bugs. Nous devons également prendre en compte que le projet sera maintenu par différents développeurs au fil du temps.

## Décision

Nous allons implémenter l'architecture CLEAN. [En savoir plus à ce sujet ici](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). Notre
mise en œuvre sera une version simplifiée qui reliera directement les entités à la base de données, car créer des adaptateurs pour chaque entité serait excessif pour la taille de ce projet.

## Conséquences

Le backend utilisera quatre couches principales :

- **Entités** : qui comprendront les définitions de type pour les données qui seront stockées dans la base de données.
- **Interacteurs** : qui contiendront la logique métier de l'application.
- **Contrôleurs** : qui seront responsables de la gestion des requêtes et des réponses HTTP.
- **Répertoires** : qui seront responsables de la gestion des opérations de la base de données.

Pour l'instant, nous testerons uniquement la logique métier à travers des tests unitaires. Si l'application se développe suffisamment, nous envisagerons des tests d'intégration et de bout en bout.

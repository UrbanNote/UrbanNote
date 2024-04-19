# 3. Utiliser l'Injection de Dépendances

Date : 2024-01-19

## Contexte

Le backend, bien qu'étant développé avec Firebase, nécessitera toujours d'être testable et maintenable. Nous devons pouvoir simuler des services et des dépôts pour les tests unitaires et pouvoir facilement changer les implémentations des services et des dépôts.

## Décision

Nous utiliserons la [bibliothèque d'Injection de Dépendances de Microsoft, TSyringe](https://github.com/microsoft/tsyringe) pour gérer l'injection de dépendances dans le backend. Cette bibliothèque est très simple à utiliser et offre de nombreuses fonctionnalités qui nous aideront pour nos besoins en tests et en maintenabilité.

## Conséquences

Nous devrons apprendre à utiliser TSyringe, mais la documentation est très bonne et il y a beaucoup de soutien communautaire. Nous devrons également refactoriser le code pour utiliser l'injection de dépendances, mais cela rendra le code plus testable et maintenable à long terme.

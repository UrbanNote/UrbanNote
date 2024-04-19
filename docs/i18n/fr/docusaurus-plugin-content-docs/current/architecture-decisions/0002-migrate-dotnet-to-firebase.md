# 2. Migration du backend de .NET à Firebase

Date : 2024-01-19

## Contexte

Le projet de backend de base était développé en .NET, mais le schéma tarifaire des fournisseurs de cloud associés ne correspondait pas au budget de l'organisation. Le code nécessitait également beaucoup de code standard et pour obtenir un MVP opérationnel, nous avions besoin d'une solution plus rapide.

## Décision

Nous avons décidé de migrer le backend de .NET à Firebase. Firebase est un backend en tant que service qui offre de nombreuses fonctionnalités prêtes à l'emploi, telles que l'authentification, la base de données et les fonctions cloud. De plus, il fonctionne sur un modèle de paiement à l'usage, ce qui correspond mieux au budget de l'organisation, puisque nous ne prévoyons pas une montée en charge dépassant le seuil gratuit.

## Conséquences

La migration nécessitera beaucoup de modifications de code, mais nous nous attendons à avoir un cycle de développement plus rapide et un backend plus stable. Nous devrons également apprendre à utiliser Firebase, mais la documentation est très bonne et il y a beaucoup de soutien communautaire.

Afin de garder les coûts de la suite Firebase au minimum, nous allons essayer d'optimiser l'expérience utilisateur afin de minimiser les requêtes. Ainsi, il y aura en général une page par module et les interactions avec les entités se feront dans des composantes dynamiques comme une modale ou un tiroir.

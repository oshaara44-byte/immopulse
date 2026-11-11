# ImmoPulse — Protection des données

## Objectif

ImmoPulse collecte et traite uniquement les données nécessaires au fonctionnement de la plateforme, à la gestion des essais, au suivi des biens, aux alertes et aux relations avec les utilisateurs.

## Principes

- Collecte minimale.
- Finalité claire.
- Consentement lorsque nécessaire.
- Accès limité.
- Sécurité raisonnable.
- Transparence.
- Export possible.
- Suppression possible.
- Durée de conservation définie.
- Séparation des organisations.

## Catégories d’utilisateurs

### Professionnels

- agents immobiliers ;
- collaborateurs d’agence ;
- administrateurs d’agence.

### Particuliers

- acheteurs ;
- locataires ;
- personnes créant une alerte ;
- visiteurs devenant prospects avec leur accord.

## Données des comptes professionnels

- nom ;
- email ;
- mot de passe chiffré ou géré par un fournisseur d’authentification ;
- téléphone facultatif ;
- langue ;
- pays facultatif ;
- agence ;
- rôle ;
- date de création ;
- statut d’essai ou d’abonnement.

## Données des biens

- titre ;
- type ;
- transaction ;
- prix ;
- zone ;
- caractéristiques ;
- description ;
- photos ;
- disponibilité ;
- statut ;
- date de création ;
- agence propriétaire.

## Données des prospects

- nom ou identifiant fourni ;
- email ;
- téléphone ;
- bien concerné ;
- source ;
- demande ;
- critères ;
- statut ;
- date du dernier contact ;
- prochaine action ;
- notes nécessaires au suivi ;
- consentement applicable.

## Données des alertes

- critères de recherche ;
- achat ou location ;
- zone ;
- budget ;
- type de bien ;
- pièces ;
- surface ;
- équipements ;
- fréquence des notifications ;
- langue ;
- adresse de notification ;
- statut de l’alerte.

## Visiteurs anonymes

ImmoPulse ne doit pas prétendre identifier un visiteur anonyme.

Les données agrégées éventuellement utilisées doivent respecter les règles applicables et ne pas être utilisées pour contourner le consentement.

## Consentements

Le système doit pouvoir enregistrer :

- le type de consentement ;
- le texte accepté ;
- la version du texte ;
- la date ;
- la source ;
- la langue ;
- la possibilité de retrait.

## Communications

Distinguer :

- messages nécessaires au fonctionnement du compte ;
- notifications liées à une alerte demandée ;
- messages de service ;
- messages commerciaux ;
- newsletters.

Les messages commerciaux nécessitent le consentement approprié.

## Accès aux données

Un utilisateur ne peut accéder qu’aux données :

- de son compte ;
- de son agence ;
- des biens autorisés ;
- des prospects autorisés ;
- des fonctions correspondant à son rôle.

## Séparation des agences

Les données de deux agences doivent être isolées.

Toute requête doit vérifier l’organisation de l’utilisateur avant de retourner des données.

## Export

L’utilisateur doit pouvoir demander ou effectuer l’export de :

- ses biens ;
- ses prospects ;
- ses interactions ;
- ses alertes ;
- ses données de compte, lorsque cela est applicable.

## Suppression

L’utilisateur doit pouvoir demander :

- la suppression d’une alerte ;
- la suppression d’un prospect ;
- la suppression d’un bien ;
- la suppression de son compte.

Les obligations légales de conservation éventuelles doivent être expliquées clairement.

## Données de paiement

ImmoPulse ne doit pas stocker directement les données bancaires sensibles.

Un prestataire de paiement doit gérer :

- les données de carte ;
- les paiements ;
- les renouvellements ;
- les remboursements ;
- les factures, selon ses capacités.

## Sécurité

Prévoir :

- HTTPS en production ;
- mots de passe gérés de manière sécurisée ;
- clés secrètes dans les variables d’environnement ;
- validation des entrées ;
- permissions côté serveur ;
- protection contre les abus ;
- sauvegardes ;
- journalisation des événements importants ;
- contrôle des fichiers envoyés.

## Photos et vidéos

Les utilisateurs doivent disposer des droits nécessaires sur les fichiers envoyés.

ImmoPulse ne doit pas réutiliser publiquement une photo ou une vidéo client sans autorisation appropriée.

## Conservation

Les durées de conservation doivent être définies selon :

- la catégorie de donnée ;
- la finalité ;
- le statut du compte ;
- les obligations applicables ;
- la demande de suppression.

## Incidents

Prévoir une procédure pour :

- détecter un incident ;
- limiter l’accès ;
- préserver les journaux ;
- informer les responsables ;
- traiter la demande ;
- corriger la cause.

## Limites du projet

ImmoPulse ne doit pas :

- vendre secrètement les coordonnées ;
- identifier les visiteurs anonymes ;
- envoyer des messages non sollicités ;
- partager un prospect sans base appropriée ;
- promettre une vente ;
- collecter des données sans finalité ;
- conserver indéfiniment des contacts inactifs.

## Vérification avant production

Avant le lancement :

- publier une politique de confidentialité adaptée ;
- publier les conditions d’utilisation ;
- vérifier les obligations du pays ciblé ;
- tester l’export ;
- tester la suppression ;
- tester l’isolation entre agences ;
- vérifier les formulaires de consentement ;
- faire relire les documents sensibles par un professionnel compétent.
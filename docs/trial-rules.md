# ImmoPulse — Règles de l’essai

## Durée

La durée standard de l’essai est de 14 jours calendaires.

## Modèle Découverte

- Essai gratuit.
- Aucun paiement préalable.
- Accès limité selon les règles du produit.
- Objectif : découvrir ImmoPulse et mesurer l’intérêt.
- Aucun abonnement automatique sans action claire du client.

## Modèle Complet

- Essai gratuit de 14 jours.
- Choix explicite d’un forfait.
- Engagement de paiement du premier mois après l’essai.
- Date et montant de facturation clairement affichés.
- Annulation simple avant la facturation.
- Rappel avant la fin de l’essai.
- Aucune ambiguïté sur le renouvellement.

## Début de l’essai

L’essai commence lorsque :

- le compte est créé ;
- l’adresse email est enregistrée ;
- les conditions applicables sont acceptées ;
- la date de début est enregistrée côté serveur.

## Fin de l’essai

L’essai se termine :

- après 14 jours calendaires ;
- à la date d’expiration enregistrée ;
- ou après annulation volontaire.

## Calcul

Le serveur détermine :

- la date de début ;
- la date de fin ;
- le nombre de jours restants ;
- le statut de l’essai.

L’utilisateur ne peut pas réinitialiser l’essai en changeant d’appareil.

## Statuts

- registered ;
- trial_active ;
- trial_expiring ;
- trial_expired ;
- plan_selected ;
- payment_pending ;
- active_subscriber ;
- cancelled ;
- data_deletion_requested.

## Messages

### Jour 0

Bienvenue et instructions de démarrage.

### Jour 3

Aide à créer le premier bien et à découvrir le tableau de suivi.

### Jour 7

Rappel de la valeur et présentation des fonctions principales.

### Jour 11

Information sur la fin prochaine de l’essai et les forfaits.

### Jour 13

Rappel clair de la date de fin et du paiement éventuel.

### Jour 14

Information sur l’expiration, les options de continuation et les données conservées.

## Données après expiration

- Le compte reste conservé selon la politique applicable.
- Les données restent exportables.
- Les fonctionnalités peuvent être limitées.
- Aucune donnée n’est supprimée sans information préalable.
- Le client peut demander la suppression.

## Principe de transparence

Les messages doivent distinguer :

- messages nécessaires au fonctionnement du compte ;
- messages de conversion ;
- messages marketing.

Les messages marketing nécessitent le consentement approprié.

## Limites techniques

- Un essai par utilisateur, sauf décision contraire.
- Vérification email possible.
- Détection des inscriptions abusives.
- Limitation du nombre de biens et prospects selon le mode choisi.
- Journalisation des changements de statut.

## Critère de réussite

L’utilisateur doit atteindre une première valeur rapidement :

1. Créer un compte.
2. Ajouter un bien.
3. Ajouter ou recevoir un prospect.
4. Voir une action recommandée.
5. Préparer une relance.
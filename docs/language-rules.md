# ImmoPulse — Règles linguistiques

## Langues disponibles

- English.
- Français.
- Español.

## Langue par défaut

L’anglais est la langue par défaut.

## Priorité de détection

1. Langue choisie explicitement par l’utilisateur.
2. Langue enregistrée dans son compte.
3. Langue du navigateur.
4. Anglais par défaut.

## Changement de langue

L’utilisateur peut changer de langue à tout moment.

La préférence doit être conservée dans :

- la session ;
- le compte utilisateur, si connecté ;
- les communications futures.

## Éléments à traduire

- page d’accueil ;
- navigation ;
- tarifs ;
- fonctionnalités ;
- formulaires ;
- erreurs ;
- notifications ;
- emails ;
- compteur de 14 jours ;
- messages d’expiration ;
- tableau de bord ;
- biens ;
- prospects ;
- alertes ;
- paiements ;
- conditions ;
- confidentialité ;
- support.

## Règles techniques

- Aucun texte important ne doit être écrit directement dans un composant.
- Les textes utilisent des clés de traduction.
- Chaque clé doit exister dans les trois langues.
- Une clé absente doit afficher un fallback contrôlé.
- Les textes doivent être testés dans les trois langues.
- Les dates, nombres et devises doivent être formatés selon la langue.

## Clés recommandées

- common.*
- navigation.*
- home.*
- pricing.*
- auth.*
- trial.*
- dashboard.*
- properties.*
- prospects.*
- alerts.*
- content.*
- billing.*
- legal.*
- errors.*
- emails.*

## Qualité

- Ne pas traduire mot à mot les textes commerciaux.
- Conserver le même sens et le même niveau de confiance.
- Utiliser un vocabulaire immobilier compréhensible.
- Éviter les promesses exagérées.
- Vérifier les textes juridiques séparément.
- Faire relire les textes importants avant la production.

## Test de conformité

La plateforme est conforme si :

- elle s’ouvre en anglais par défaut ;
- le français peut être sélectionné ;
- l’espagnol peut être sélectionné ;
- les principales pages existent dans les trois langues ;
- les emails utilisent la langue du compte ;
- aucune clé de traduction importante ne manque.
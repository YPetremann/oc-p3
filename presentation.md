---
presentation:
   width: 1280
   height: 1024
   theme: beige.css
---
<!-- slide -->

# OpenDeclic
# Projet 2
## Concevoir une carte intéractive de location de vélos
https://ypetremann.github.io/oc-p3/

<!-- slide -->
## Présentation du support

* Maitrise des librairies utilisées :
  * Leaflet
  * Leaflet.MarkerCluster
  * API JCDecaux

<!-- slide -->
## Présentation du support

* Interpretation de la maquette et création du support:
  * Orienté mobile
  * Découpage en 3 page pour chacune des fonctions
  * Détails s'affiche comme volet à droite lors du clic

<!-- slide -->
## Présentation du support

* Création de fonctions Générales :
  * Ajax.js :
    * Utilise les Promise pour simplifier l'écriture
  * Underscore.js
    * Permet la création d'élément du DOM
    * Syntaxe proche des selecteur CSS
    * Permet d'emboiter les elements du DOM


<!-- slide -->
## Présentation du support

* Création des objets utilisés
  * Généralités
    * Les objets doivent être crées puis associés pour fonctionner
    * La fonction bind à été utilisé pour utiliser des méthodes avec les evenements
  * Main
  * SignCanvas
  * Carousel
<!-- slide -->
## Présentation du support

* Création des objets utilisés
  * Généralités
  * Main
    * Gestion de la carte
      * zone automatiquement autour des stations disponibles
      * Utilisation de marqueurs personalisées avec DivIcon
      * Utilisation de marqueurs de cluster personalisées
      * Les marqueurs affiche le nombre de vélos disponible
      * Colorisation des marqueurs en fonctions des vélos disponibles en moyenne
    * Formulaire de details
    * Réservations
  * SignCanvas
  * Carousel

<!-- slide -->
## Présentation du support

* Création des objets utilisés
  * Généralités
  * Main
    * Gestion de la carte
    * Formulaire de details
      * S'affiche au click sur une station, sauf vide
      * Se cache avec la croix ou clic sur la carte
      * Le prénom et nom sont renseignée automatiquement a partir du localStorage
      * Envoit à la partie reservations à la validation
    * Réservations
  * SignCanvas
  * Carousel

<!-- slide -->
## Présentation du support

* Création des objets utilisés
  * Généralités
  * Main
    * Gestion de la carte
    * Formulaire de details
    * Réservations
      * Récupere la reservation depuis sessionStorage
      * Affiche la reservation en cours
      * Affiche un compte à rebours du temps restant en comparant avec le moment d'expiration
      * Si la diference est negative, il supprime la session et arrete le compte a rebours.
  * SignCanvas
  * Carousel

<!-- slide -->
## Présentation du support

* Création des objets utilisés
  * Généralités
  * Main
  * SignCanvas
    * Gere le canvas pour la signature avec les event :
      * Mousemove => canvas
      * Mousedown => document
      * Mouseup => document
    * le clic peut commencer et finir en dehors du canvas
  * Carousel

<!-- slide -->
## Présentation du support

* Création des objets utilisés
  * Généralités
  * Main
  * SignCanvas
  * Carousel
    * Initialisation des evenements du carousel
    * Gestion des boutons pour :
      * passer a une slide précise
      * passer a une slide precedente ou suivante
      * bouton lecture/pause
    * Gestion du clavier

<!-- slide -->
## Développeur Front-End

* Etudes des fonctions utilisable des navigateurs
* Intégration des fonctionnalité selon la maquette
* Création des fonctionnalité à l'aide du Html / Js / Css
* Validation sur les principaux navigateurs

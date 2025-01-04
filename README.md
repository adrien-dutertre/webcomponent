
# Web component Compteur

Création d'un composant web de type "compteur" basé sur un input nombre.




## Features

- Affichage d'un suffixe
- Boutons + et - plus accessibles
- Affichage d'un message d'assistance
- Affichage d'un message d'erreur


## Usage

```HTML
<input-counter>
    <input type="number" slot="input"></input>
    <span slot="suffixe"></span>
    <span slot="assistance-message"></span>
    <span slot="error-message"></span>
</input-counter>
```

<input> fonctionne comme une input classique, avec les attributs : value, min, max, step

Les autres slot sont optionnels.

Les attributs possibles de <input-counter> sont les suivants :
- disabled
- readonly
- required
Qui se répercutent automatiquement sur l'input nombre interne.

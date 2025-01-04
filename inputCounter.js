const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            font-family: monospace;
            --dark-high: #101920;
            --dark-medium: #63666B;
            --dark-low: #A2AAAD;
            --light-medium: #F4F4F4;
            --error: #CC0019;
            --info: #016AC6;
        }

        .container {
            display: inline-flex;
            border: 2px solid var(--dark-high);
            gap: 6px;
            align-items: center;
        }

        // Ne fonctionne pas
        ::slotted(input[type="number"]:focus) {
            outline: 2px solid var(--info);
            outline-offset: 1px;
        }

        .container.error {
            border: 2px solid var(--error);
        }

        :host([disabled]) .container {
            border: 2px solid var(--light-medium);
            background-color: var(--light-medium);
        }

        :host([readonly]) .container {
            border: 1px solid var(--dark-low);
            height: 40px;
        }
        
        ::slotted(input[type="number"]) {
            border: none;
            -webkit-appearance: textfield;
            -moz-appearance: textfield;
            appearance: textfield;
            text-align: right;
            font-family: inherit;
            background-color: transparent;
        }

        // Ne fonctionne pas (inaccessible via slot ?)
        // Fix : Ajouté dans le CSS principal
        // ::slotted(input[type="number"]::-webkit-inner-spin-button),
        // ::slotted(input[type="number"]::-webkit-outer-spin-button) {
        //   -webkit-appearance: none !important;
        // }

        ::slotted(input[type="number"]:focus) {
            border: none;
            outline: none;
        }

        ::slotted(span[slot="suffixe"]) {
            color: var(--dark-medium);
        }

        #buttoncontainer {
            display: flex;
            flex-direction: column;
        }

        button {
            background-color: var(--dark-low);
            font-weigth: bold;
            width: 32px;
            border-color: var(--dark-high);
            border-style: solid;
        }

        button:focus {
            outline: 2px solid var(--info);
        }

        button#inputbuttonplus {
            border-width: 0 0 2px 2px;
        }

        button#inputbuttonminus {
            border-width: 0 0 0 2px;
        }

        button:hover {
            background-color: var(--light-medium);
            cursor: pointer;
        }

        button:active {
            background-color: var(--dark-medium);
        }

        button:disabled {
            border-color: var(--light-medium);
            background-color: var(--light-medium);
            cursor: default;
        }

        :host([readonly]) button {
            display: none;
        }

        .assistance {
            display: flex;
            flex-direction: column;
        }

        ::slotted(span) {
            font-size: smaller;
        }

        ::slotted(span[slot="error-message"]) {
            display: none;
            color: var(--error);
        }

        .container.error+div>::slotted(span[slot="error-message"]) {
            display: inline;
        }
        
    </style>
    <div class="container" id="container">
        <slot name="input" id="inputbox"></slot>
        <slot name="suffixe"></slot>
        <div id="buttoncontainer">
            <button id="inputbuttonplus">+</button>
            <button id="inputbuttonminus">-</button>
        </div>
    </div>
    <div class="assistance">
        <slot name="assistance-message"></slot>
        <slot name="error-message"></slot>
    </div>
`;

class InputCounter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        // Récupération des éléments
        const container = this.shadowRoot.getElementById("container");
        const input = this.shadowRoot.getElementById("inputbox").assignedElements()[0];
        const buttonPlus = this.shadowRoot.getElementById("inputbuttonplus");
        const buttonMinus = this.shadowRoot.getElementById("inputbuttonminus");

        // Ajout des évènements
         // Clic sur +
        buttonPlus.addEventListener('click', () => {
            input.stepUp();
            validity();
        });
        // Clic sur -
        buttonMinus.addEventListener('click', () => { 
            input.stepDown();
            validity();
        }); 
        input.addEventListener('click', () => input.select()); // Sélectionner le contenu au clic
        // Vérification de la validité
        input.addEventListener('change', () => validity());

        function validity() {
            if (!input.checkValidity()) {
                container.classList.add("error");
            } else {
                container.classList.remove("error");
            }
        }
    }

    // Surveillance des attributs
    static get observedAttributes() {
        return ['required','readonly','disabled'];
    }

    // Getters et setters pour les attributs
    get readonly() {
        return this.getAttribute('readonly');
    }

    set readonly(value) {
        this.setAttribute('readonly', value);
    }

    get required() {
        return this.getAttribute('readonly');
    }

    set required(value) {
        this.setAttribute('required', value);
    }

    attributeChangedCallback(attributeName, oldValue, newValue) {
        const input = this.shadowRoot.getElementById("inputbox").assignedElements()[0];
        const buttonPlus = this.shadowRoot.getElementById("inputbuttonplus");
        const buttonMinus = this.shadowRoot.getElementById("inputbuttonminus");

        // Changement des valeurs des attributs
        // Valeur du champ
        if (attributeName.toLowerCase() === "value") {
            input.setAttribute("value", this.inputValue);
        }

        // Champ désactivé
        if (attributeName.toLowerCase() === "disabled") {
            input.setAttribute("disabled", "");
            buttonPlus.setAttribute("disabled", "");
            buttonMinus.setAttribute("disabled", "");
        }

        // Champ requis
        if (attributeName.toLowerCase() === "required") {
            input.setAttribute("required", "");
        }

        // Champ en lecture seule
        if (attributeName.toLowerCase() === "readonly") {
            input.setAttribute("readonly", "");
        }
    }
}

customElements.define("input-counter", InputCounter);
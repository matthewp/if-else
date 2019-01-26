const template = document.createElement('template');
template.innerHTML = /* html */ `
  <style>
    :host {
      display: contents;
    }

    #root {
      display: contents;
    }
  </style>
  <div id="root"></div>
  <slot name="none"></slot>
`;

function clone() {
  return document.importNode(template.content, true);
}

function clear(el) {
  while(el.lastChild) {
    el.removeChild(el.lastChild);
  }
}

class View {
  constructor() {
    this.frag = clone();
    this.value = null;
    this.rootNode = this.frag.querySelector('#root');
    this.slotNode = this.frag.querySelector('slot');
    this.slotNode.addEventListener('slotchange', this);
  }

  setSlotNode(value) {
    let name = value ? 'if' : 'else';
    this.slotNode.setAttribute('name', name);
  }

  setValue(value) {
    if(this.value !== value) {
      this.value = value;
      this.setSlotNode(value);
    }
  }

  stamp(template) {
    clear(this.rootNode);
    if(template) {
      let frag = document.importNode(template.content, true);
      this.rootNode.appendChild(frag);
    }
  }

  handleEvent(ev) {
    this.stamp(ev.target.assignedElements()[0]);
  }

  update(data = {}) {
    if(data.value != null) this.setValue(data.value);
    return this.frag;
  }
}

const VIEW = Symbol('if-else.view');

class IfElse extends HTMLElement {
  static get observedAttribute() {
    return ['true'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._value = this.hasAttribute('true');
  }

  connectedCallback() {
    if(!this[VIEW]) {
      let view = this[VIEW] = new View();
      let frag = view.update({ value: !!this.value });
      this.shadowRoot.appendChild(frag);
    }
  }

  attributeChangeCallback(name, _, newValue) {
    this[name] = newValue === '';
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if(this._value === value) return;
    this._value = value;

    if(this[VIEW]) {
      this[VIEW].update({ value });
    }
  }
}

customElements.define('if-else', IfElse);
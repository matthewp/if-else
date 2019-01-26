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
  static get observedAttributes() {
    return ['true'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    if(!this[VIEW]) {
      let view = this[VIEW] = new View();
      let value = this.hasAttribute('true');
      let frag = view.update({ value });
      this.shadowRoot.appendChild(frag);
    }
  }

  attributeChangedCallback(_, __, newValue) {
    let value = newValue === '';
    if(this[VIEW]) {
      this[VIEW].update({ value });
    }
  }

  get value() {
    return this[VIEW].value;
  }

  set value(value) {
    if(this[VIEW]) {
      this[VIEW].update({ value });
    }
  }
}

customElements.define('if-else', IfElse);
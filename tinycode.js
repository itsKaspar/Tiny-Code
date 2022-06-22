// const pako = require('pako');

class TinyCodeDOM extends window.HTMLElement {
  constructor(){
    super();
  }
  connectedCallback() {
    this.update();
  }

  update() {
    let code;
    let editor;
    let parent = this;
    setTimeout(() => code = this.innerHTML );
    setTimeout(() => editor = new TinyCode(parent, code) );
  }
}
window.customElements.define('tiny-code', TinyCodeDOM)

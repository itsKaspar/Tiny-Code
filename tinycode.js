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
    setTimeout(() => code = this.innerHTML ); // John (*)

    setTimeout(() =>
      this.innerHTML =  `
        <script src="./build/tc.js"></script>
        <div id="tiny-code">
           <script>
             let editor = new TinyCode(${code});
           </script>
         </div>
       `
    );

  }
}
window.customElements.define('tiny-code', TinyCodeDOM)

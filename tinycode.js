// const pako = require('pako');

class TinyCodeDOM extends window.HTMLElement {

  connectedCallback () {
    const layoutAttribute = this.getAttribute("layout") // get the layout
    this.update(this.textContent, layoutAttribute)
  }

  update(code, layout) {
    const c = code;
    //const c = btoa(code)
    // const c = btoa(unescape(encodeURIComponent(code)));
    // const c = btoa(pako.deflate(code, { to: 'string' }));
    // this.innerHTML = `<iframe src="https://itskaspar.github.io/Tiny-Code?layout=${layout}&code=${c}"></iframe>`;

    this.innerHTML = `
    <script src="./build/tc.js"></script>
      <div id="tiny-code">
        <script>
          let editor = new TinyCode(${c});
        </script>
        hello test
      </div>
    `;
    
  }
}
window.customElements.define('tiny-code', TinyCodeDOM)

class TinyCodeDOM extends window.HTMLElement {

  connectedCallback () {
    const layoutAttribute = this.getAttribute("layout") // get the layout
    this.update(this.textContent, layoutAttribute)
  }

  update(code, layout) {
    //const c = btoa(code)
    const c = btoa(unescape(encodeURIComponent(code)));
    this.innerHTML = `<iframe src="https://itskaspar.github.io/Tiny-Code?layout=${layout}&code=${c}"></iframe>`;
  }
}
window.customElements.define('tiny-code', TinyCodeDOM)

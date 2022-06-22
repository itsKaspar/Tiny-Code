

// editor.dispatch({
//   changes: {from: 0, insert: DEFAULT_CODE}
// });

import * as pako from 'pako'
import { nord } from 'cm6-theme-nord'
import { basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { EditorView, ViewUpdate } from "@codemirror/view"
import { javascript } from "@codemirror/lang-javascript"
import { tags } from "@lezer/highlight"
import { defaultHighlightStyle, HighlightStyle, syntaxHighlighting } from "@codemirror/language";

class TinyCode{
  constructor(code, layout = "side"){
    // set layout
    this.layout = this.hasLayout() || layout;
    this.setLayout(); // change/add the css of <style id="pageStyle"></style>

    //create divs
    let c = document.createElement("div")
    c.id = "editor";
    let v = document.createElement("div")
    v.id = "visual"
    document.body.appendChild(c)
    document.body.appendChild(v)

    // get code
    this.code = this.hasHashCode() || code;
    let context = this;
    this.editor = new EditorView({
      state: EditorState.create({
        doc: this.code,
        extensions: [
          basicSetup,
          javascript(),
          nord,
          EditorView.updateListener.of(function (v) {
              if (v.docChanged) {
                let sketch = document.querySelector("#p5");
                if(sketch) { sketch.remove(); } // # Delete old iframe
                let code = context.editor.state.doc.toString(); // # Get changes
                context.createIframe(code); // # Create New Iframe
              }
          }),
      ]
      }),
      parent: document.getElementById("editor")
    });

    this.createIframe(this.editor.state.doc.toString()); // write in iframe (interpreted code)
  }

  hasHashCode(){
    const queryString = window.location.search; // get url
    const urlParams = new URLSearchParams(queryString); // get url parameters
    let code = urlParams.get('code');
    if(code){
      return decodeURIComponent(escape(window.atob(code)));
      //return atob(code);
    }
    else {
      return false;
    }
  }

  hasLayout(){
    const queryString = window.location.search; // get url
    const urlParams = new URLSearchParams(queryString); // get url parameters
    return urlParams.get('layout');
  }

  setLayout(){
      const link = document.getElementById("layout");

      // # Define different style

      switch(this.layout){
        case "top":    link.setAttribute("href", "./css/layout-top.css"); break;
        case "bot":    link.setAttribute("href", "./css/layout-bottom.css"); break;
        case "left":   link.setAttribute("href", "./css/layout-left.css"); break;
        case "right":  link.setAttribute("href", "./css/layout-right.css"); break;
        case "code":   link.setAttribute("href", "./css/layout-code.css"); break;
        case "visual": link.setAttribute("href", "./css/layout-visual.css"); break;
        case "overlay":link.setAttribute("href", "./css/layout-overlay.css"); break;
        default :      link.setAttribute("href", "./css/layout-left.css"); break;
      }
  }


  createIframe(code){

        let iframe = document.createElement('iframe');
        iframe.setAttribute("id", "p5")
        iframe.setAttribute("scrolling", "no");
        let visual = document.querySelector("#visual");
        visual.appendChild(iframe);
        let html =  `<!DOCTYPE html>
                      <html>
                        <head>
                          <script src="./lib/p5.min.js"><\/script>
                          <style>*{margin:0;padding:0;border:0;box-sizing: border-box;overflow:hidden;}</style>
                        </head>
                        <body>
                          <script>
                            ${code}
                            function windowResized(){resizeCanvas(windowWidth, windowHeight);}
                          <\/script>
                        </body>
                      </html>`;

        iframe = iframe.contentWindow || iframe.contentDocument.document || iframe.contentDocument;
        iframe.document.open();
        iframe.document.write(html);
        iframe.document.close();
      }

      _decode (code) { return pako.inflate(window.atob(code), { to: 'string' }) }
      _encode (code) { return window.btoa(pako.deflate(code, { to: 'string' })) }
}

class TinyCodeDOM extends window.HTMLElement {

  connectedCallback () {
    const layoutAttribute = this.getAttribute("layout") // get the layout
    this.update(this.textContent, layoutAttribute)
  }

  update (code, layout) {
    //const c = btoa(code)
    const c = btoa(unescape(encodeURIComponent(code)));
    this.innerHTML = `<iframe src="https://itskaspar.github.io/Tiny-Code?layout=${layout}&code=${c}"></iframe>`;
  }
}
window.customElements.define('tiny-code', TinyCodeDOM)




if(typeof window !== 'undefined') window.TinyCode = TinyCode; // would change Q to the name of the library
else module.exports = TinyCode; // in node would create a context

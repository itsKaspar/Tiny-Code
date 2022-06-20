

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
  constructor(code){
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
      return atob(code);
    }
    else {
      return false;
    }
  }

  createIframe(code){
        let iframe = document.createElement('iframe');
        iframe.setAttribute("id", "p5") // set its id to p5
        iframe.setAttribute("scrolling", "no");
        document.body.appendChild(iframe);
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
}


if(typeof window !== 'undefined') window.TinyCode = TinyCode; // would change Q to the name of the library
else module.exports = TinyCode; // in node would create a context

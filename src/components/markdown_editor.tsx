import React, { useRef, useEffect } from "react"

import { Editor } from "@toast-ui/react-editor"
import codeSyntaxHighlight from "@toast-ui/editor-plugin-code-syntax-highlight"
import uml from "@toast-ui/editor-plugin-uml"

import hljs from "highlight.js/lib/highlight"
import javascript from "highlight.js/lib/languages/javascript"
import java from "highlight.js/lib/languages/java"
import python from "highlight.js/lib/languages/python"
import hlcss from "highlight.js/lib/languages/css"
import php from "highlight.js/lib/languages/php"
import ruby from "highlight.js/lib/languages/ruby"
import shell from "highlight.js/lib/languages/shell"
import csharp from "highlight.js/lib/languages/cs"
import objectivec from "highlight.js/lib/languages/objectivec"
import swift from "highlight.js/lib/languages/swift"
import go from "highlight.js/lib/languages/go"
import scala from "highlight.js/lib/languages/scala"
import lisp from "highlight.js/lib/languages/lisp"
import lua from "highlight.js/lib/languages/lua"
import clojure from "highlight.js/lib/languages/clojure"
import groovy from "highlight.js/lib/languages/groovy"
import rust from "highlight.js/lib/languages/rust"
import powershell from "highlight.js/lib/languages/powershell"
import erlang from "highlight.js/lib/languages/erlang"
import typescript from "highlight.js/lib/languages/typescript"
import dart from "highlight.js/lib/languages/dart"
import fsharp from "highlight.js/lib/languages/fsharp"
import elixir from "highlight.js/lib/languages/elixir"
import scss from "highlight.js/lib/languages/scss"

import "codemirror/lib/codemirror.css"
import "@toast-ui/editor/dist/toastui-editor.css"
import "highlight.js/styles/github.css"

import { useStoreActions, useStoreState } from "../utils/hooks"
import css from "./markdown_editor.module.scss"

hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("java", java)
hljs.registerLanguage("python", python)
hljs.registerLanguage("css", hlcss)
hljs.registerLanguage("php", php)
hljs.registerLanguage("ruby", ruby)
hljs.registerLanguage("shell", shell)
hljs.registerLanguage("csharp", csharp)
hljs.registerLanguage("objectivec", objectivec)
hljs.registerLanguage("swift", swift)
hljs.registerLanguage("go", go)
hljs.registerLanguage("scala", scala)
hljs.registerLanguage("lisp", lisp)
hljs.registerLanguage("lua", lua)
hljs.registerLanguage("clojure", clojure)
hljs.registerLanguage("groovy", groovy)
hljs.registerLanguage("rust", rust)
hljs.registerLanguage("powershell", powershell)
hljs.registerLanguage("erlang", erlang)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("dart", dart)
hljs.registerLanguage("fsharp", fsharp)
hljs.registerLanguage("elixir", elixir)
hljs.registerLanguage("scss", scss)

const MarkdownEditor: React.FC = (): JSX.Element => {
  const editorRef = useRef<Editor | null>(null)

  const setExpandView = useStoreActions((actions) => actions.search.setExpandView)
  const setExpandWidthView = useStoreActions((actions) => actions.search.setExpandWidthView)

  useEffect(() => {
    setExpandView(true)
    setExpandWidthView(true)
  }, [setExpandView, setExpandWidthView])

  return (
    <div className={css.editorWapper}>
      <Editor
        initialValue="### hello. We support markdown, code-highlight and [UML render](https://github.com/nhn/tui.editor/tree/master/plugins/uml)."
        previewStyle="vertical"
        height="100%"
        initialEditType="markdown"
        useCommandShortcut
        ref={editorRef}
        // https://github.com/nhn/tui.editor/issues/909#issuecomment-615859187
        plugins={[codeSyntaxHighlight.bind(hljs), uml]}
      />
    </div>
  )
}

export default MarkdownEditor

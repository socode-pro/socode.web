import React, { useState, useRef, useEffect, useCallback } from "react"
import Editor from "@monaco-editor/react"
import cs from "classnames"
import { useStoreActions, useStoreState } from "../utils/hooks"
import examples from "../utils/editor_examples"
import languages from "../utils/editor_language"
import css from "./editor.module.scss"
import Loader1 from "./loader/loader1"

const EditorComponent: React.FC = (): JSX.Element => {
  const setExpandView = useStoreActions((actions) => actions.search.setExpandView)
  const [language, setLanguage] = useState(19)
  // setExpandView(true)

  const editorDidMount = useCallback(() => {
    setExpandView(true)
  }, [setExpandView])

  return (
    <div className="mgt5">
      <select value={language} onChange={(e) => setLanguage(parseInt(e.target.value, 10))}>
        {languages.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <div className={cs(css.editorWapper)}>
        <Editor
          // height="90vh" // By default, it fully fits with its parent
          theme="vs"
          language={languages.find((o) => o.id === language)?.name}
          loading={<Loader1 type={2} />}
          value={examples[language].trim().replace(/^ {4}/gm, "")}
          options={{
            selectOnLineNumbers: true,
            scrollBeyondLastLine: false,
          }}
          editorDidMount={editorDidMount}
        />
      </div>
    </div>
  )
}

export default EditorComponent

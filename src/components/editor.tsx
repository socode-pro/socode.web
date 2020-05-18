import React, { useState, useRef, useEffect, useCallback } from "react"
import Editor, { DiffEditor } from "@monaco-editor/react"
import cs from "classnames"
import { useStoreActions, useStoreState } from "../utils/hooks"
import examples from "../utils/editor_examples"
import languages from "../utils/editor_language"
import css from "./editor.module.scss"
import Loader1 from "./loader/loader1"

const EditorComponent: React.FC = (): JSX.Element => {
  const setExpandView = useStoreActions((actions) => actions.search.setExpandView)
  const setExpandWidthView = useStoreActions((actions) => actions.search.setExpandWidthView)
  const [language, setLanguage] = useState(19)
  const [wordWrap, setWordWrap] = useState(false)
  const valueGetter = useRef<() => string>()
  const [isDiff, setIsDiff] = useState(false)
  const [value, setValue] = useState("")

  const editorDidMount = useCallback(
    (_valueGetter) => {
      setExpandView(true)
      setExpandWidthView(true)
      valueGetter.current = _valueGetter
    },
    [setExpandView, setExpandWidthView]
  )

  const enableDiff = useCallback((e) => {
    if (!valueGetter.current) return
    setValue(valueGetter.current())
    setIsDiff(e.target.checked)
  }, [])

  const runJs = useCallback((e) => {
    if (!valueGetter.current) return
    try {
      eval(valueGetter.current())
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <>
      <div className={css.controllers}>
        <select value={language} onChange={(e) => setLanguage(parseInt(e.target.value, 10))}>
          {languages.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <div className="mgl1r">
          <input
            id="editor_wordwrap"
            type="checkbox"
            checked={wordWrap}
            onChange={(e) => setWordWrap(e.target.checked)}
          />
          <label htmlFor="editor_wordwrap">Word Wrap</label>
        </div>
        <div className="mgl1r">
          <input id="editor_diff" type="checkbox" checked={isDiff} onChange={enableDiff} />
          <label htmlFor="editor_diff">Diff</label>
        </div>

        {language === 19 && (
          <div className="mgl1r">
            <button onClick={runJs} type="button">
              Run JS
            </button>
            (F12/Open Console to view the output)
          </div>
        )}
      </div>

      <div className={cs(css.editorWapper)}>
        {!isDiff && (
          <Editor
            // height="90vh" // By default, it fully fits with its parent
            theme="vs"
            language={languages.find((o) => o.id === language)?.name}
            loading={<Loader1 type={2} />}
            value={examples[language].trim().replace(/^ {4}/gm, "")}
            options={{
              scrollBeyondLastLine: false,
              wordWrap,
            }}
            editorDidMount={editorDidMount}
          />
        )}
        {isDiff && (
          <DiffEditor
            theme="dark"
            loading={<Loader1 type={2} />}
            original={value}
            modified=""
            originalLanguage={languages.find((o) => o.id === language)?.name}
            modifiedLanguage={languages.find((o) => o.id === language)?.name}
            options={{
              scrollBeyondLastLine: false,
              wordWrap,
            }}
            editorDidMount={editorDidMount}
          />
        )}
      </div>
    </>
  )
}

export default EditorComponent

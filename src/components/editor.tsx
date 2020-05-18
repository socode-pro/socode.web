import React, { useState, useRef, useEffect } from "react"
// https://github.com/react-monaco-editor/react-monaco-editor/blob/master/src/editor.js
import MonacoEditor from "react-monaco-editor"
import cs from "classnames"
import { useStoreActions, useStoreState } from "../utils/hooks"
import { ProgramLanguage } from "../utils/language"
import { IntEnumObjects } from "../utils/assist"
import css from "./editor.module.scss"

const programLanguageOptions = IntEnumObjects(ProgramLanguage)
const options = {
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
}

const Editor: React.FC = (): JSX.Element => {
  const programLanguage = useStoreState<ProgramLanguage>((state) => state.storage.programLanguage)
  const setProgramLanguage = useStoreActions((actions) => actions.storage.setProgramLanguage)

  // useEffect(() => {
  //   const dom = document.getElementById("editor")
  //   if (!dom) return

  //   if (editor.current) {
  //     dom.innerHTML = ""
  //   }

  //   editor.current = monaco.editor.create(dom, {
  //     // value: "",
  //     value: "// First line\nfunction hello() {\n\talert('Hello world!');\n}\n// Last line",
  //     // language: ProgramLanguage[programLanguage].toLowerCase(),
  //     language: "javascript",
  //     scrollBeyondLastLine: false,
  //     theme: "vs-dark",
  //   })
  // }, [programLanguage])

  return (
    <div className={cs(css.editor)}>
      <div>
        <select value={programLanguage} onChange={(e) => setProgramLanguage(parseInt(e.target.value, 10))}>
          {programLanguageOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <MonacoEditor
        // width="800"
        height="600"
        language="javascript"
        theme="vs-dark"
        // value={code}
        options={options}
      />
    </div>
  )
}

export default Editor

// Issus:
// https://github.com/react-monaco-editor/react-monaco-editor/issues/179
// 不要使用 react-app-rewired, 或其它脚手架方案，破坏cra项目可维护性。https://github.com/microsoft/monaco-editor/issues/82#issuecomment-441501302
// 优雅的方案：https://github.com/microsoft/monaco-editor/issues/82#issuecomment-504898526
// 但需要监控包大小变化

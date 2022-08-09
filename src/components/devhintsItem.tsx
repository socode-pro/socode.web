import React, { useState, useEffect } from "react"
import cs from "classnames"
import { Markup } from "interweave"

import hljs from "highlight.js"
import javascript from "highlight.js/lib/languages/javascript"
import java from "highlight.js/lib/languages/java"
import python from "highlight.js/lib/languages/python"
import hlcss from "highlight.js/lib/languages/css"
import php from "highlight.js/lib/languages/php"
import ruby from "highlight.js/lib/languages/ruby"
import shell from "highlight.js/lib/languages/shell"
import csharp from "highlight.js/lib/languages/csharp"
import swift from "highlight.js/lib/languages/swift"
import go from "highlight.js/lib/languages/go"
import scala from "highlight.js/lib/languages/scala"
import lisp from "highlight.js/lib/languages/lisp"
import lua from "highlight.js/lib/languages/lua"
import clojure from "highlight.js/lib/languages/clojure"
import rust from "highlight.js/lib/languages/rust"
import erlang from "highlight.js/lib/languages/erlang"
import typescript from "highlight.js/lib/languages/typescript"
import dart from "highlight.js/lib/languages/dart"
import elixir from "highlight.js/lib/languages/elixir"
import scss from "highlight.js/lib/languages/scss"
import xml from "highlight.js/lib/languages/xml"
import yaml from "highlight.js/lib/languages/yaml"
import sql from "highlight.js/lib/languages/sql"

import addClass from "dom101/add-class"
import { useStoreState } from "../Store"
import Loader1 from "./loader/loader1"
import wrapify from "../utils/wrapify"

import css from "./devhintsItem.module.scss"
import "highlight.js/styles/github.css"

// https://github.com/highlightjs/highlight.js/blob/master/SUPPORTED_LANGUAGES.md
hljs.registerLanguage("javascript", javascript)
hljs.registerLanguage("js", javascript)
hljs.registerLanguage("jsx", javascript)
hljs.registerLanguage("java", java)
hljs.registerLanguage("python", python)
hljs.registerLanguage("css", hlcss)
hljs.registerLanguage("php", php)
hljs.registerLanguage("ruby", ruby)
hljs.registerLanguage("shell", shell)
hljs.registerLanguage("csharp", csharp)
hljs.registerLanguage("swift", swift)
hljs.registerLanguage("go", go)
hljs.registerLanguage("scala", scala)
hljs.registerLanguage("lisp", lisp)
hljs.registerLanguage("lua", lua)
hljs.registerLanguage("clojure", clojure)
hljs.registerLanguage("rust", rust)
hljs.registerLanguage("erlang", erlang)
hljs.registerLanguage("typescript", typescript)
hljs.registerLanguage("dart", dart)
hljs.registerLanguage("elixir", elixir)
hljs.registerLanguage("scss", scss)
hljs.registerLanguage("html", xml)
hljs.registerLanguage("yml", yaml)
hljs.registerLanguage("sql", sql)

const bodyHtmlRegExp = /<body.*?>([\s\S]*)<\/body>/

const DevhintsItem: React.FC = (): JSX.Element => {
  const [markup, setMarkup] = useState<string | null>(null)

  const loading = useStoreState<boolean>((state) => state.devhints.loading)
  const html = useStoreState<string>((state) => state.devhints.itemHtml)

  useEffect(() => {
    const bodyHtmlReg = bodyHtmlRegExp.exec(html)
    if (bodyHtmlReg && bodyHtmlReg.length > 1) {
      const bodyDoc = new DOMParser().parseFromString(bodyHtmlReg[1], "text/html")
      const mainDoc = bodyDoc.querySelector("main")
      if (mainDoc) {
        wrapify(mainDoc)
        mainDoc.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightBlock(block as HTMLElement)
        })
        setMarkup(mainDoc.outerHTML)
      } else {
        const postDoc = bodyDoc.querySelector(".post-content")
        if (postDoc) {
          addClass(postDoc, "single")
          postDoc.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightBlock(block as HTMLElement)
          })
          setMarkup(postDoc.outerHTML)
        }
      }
    }
  }, [html])

  if (loading) {
    return <Loader1 type={2} />
  }

  return (
    <>
      <Markup content={markup} tagName="div" attributes={{ className: cs(css.cheatsheets) }} />
      <p className={cs(css.devhints)}>
        <a href="https://devhints.io/" target="_blank" rel="noopener noreferrer">
          powered by devhints
        </a>
      </p>
    </>
  )
}

export default DevhintsItem

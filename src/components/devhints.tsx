import React, { useState, useEffect } from "react"
import cs from "classnames"
import matches from "dom101/matches"
import { Markup } from "interweave"
import { useStoreActions, useStoreState } from "../Store"
import { splitwords, permutateString } from "../utils/permutate"
import { nextUntil } from "../utils/dom"
import Loader1 from "./loader/loader1"
import css from "./devhints.module.scss"

interface Props {
  query: string
}

const hrefRegExp = /href="\./g

function permutate(data: { slug?: string; category?: string }): string[] {
  let words: string[] = []
  if (data.slug) {
    words = words.concat(permutateString(data.slug))
  }
  if (data.category) {
    words = words.concat(permutateString(data.category))
  }
  return words
}

const Devhints: React.FC<Props> = ({ query }: Props): JSX.Element => {
  const [element, setElement] = useState<Element | null>(null)
  const [markup, setMarkup] = useState<string | null>(null)

  const loading = useStoreState<boolean>((state) => state.devhints.loading)
  const devhintsHtml = useStoreState<string>((state) => state.devhints.html)
  const getDevhintsHtml = useStoreActions((actions) => actions.devhints.getHtml)
  useEffect(() => {
    getDevhintsHtml()
  }, [getDevhintsHtml])

  useEffect(() => {
    if (element) {
      // https://github.com/rstacruz/cheatsheets/blob/master/_js/behaviors/searchable-item.js
      element.querySelectorAll("[data-js-searchable-item]").forEach((el) => {
        const data = JSON.parse(el.getAttribute("data-js-searchable-item") || "{}")
        const words = permutate(data)

        el.setAttribute("data-search-index", words.join(" "))
      })

      // https://github.com/rstacruz/cheatsheets/blob/master/_js/behaviors/searchable-header.js
      element.querySelectorAll("[data-js-searchable-header]").forEach((el) => {
        const els = nextUntil(el, "[data-js-searchable-header]").filter((e) => matches(e, "[data-search-index]"))

        const keywords = els
          .map((n) => n.getAttribute("data-search-index"))
          .join(" ")
          .split(" ")

        el.setAttribute("data-search-index", keywords.join(" "))
      })

      const missing = element.querySelector<HTMLElement>(".missing-message")
      if (missing) missing.style.display = "none"
    }
  }, [element])

  useEffect(() => {
    if (element) {
      // https://github.com/rstacruz/cheatsheets/blob/master/_js/helpers/search.js
      const keywords = splitwords(query)
      if (!keywords.length) {
        element.querySelectorAll("[data-search-index]").forEach((el) => {
          el.removeAttribute("aria-hidden")
        })
      } else {
        const selectors = keywords.map((k) => `[data-search-index~=${JSON.stringify(k)}]`).join("")

        element.querySelectorAll("[data-search-index]").forEach((el) => {
          el.setAttribute("aria-hidden", "true")
        })

        element.querySelectorAll(selectors).forEach((el) => {
          el.removeAttribute("aria-hidden")
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const bodyHtmlReg = /<body.*?>([\s\S]*)<\/body>/.exec(devhintsHtml)
    if (bodyHtmlReg && bodyHtmlReg.length > 1) {
      const bodyDoc = new DOMParser().parseFromString(bodyHtmlReg[1], "text/html")
      const pageDoc = bodyDoc.querySelector(".pages-list")
      if (pageDoc) {
        const html = pageDoc.outerHTML.replace(hrefRegExp, 'target="_blank" href="https://devhints.io/')
        setMarkup(html)
        setTimeout(() => {
          setElement(document.querySelector(`.${css.cheatsheets} .pages-list`))
        }, 0) // setTimeout avoid black box when switching
      }
    }
  }, [devhintsHtml])

  if (loading) {
    return <Loader1 type={2} />
  }

  // https://www.reddit.com/r/reactjs/comments/8k49m3/can_i_render_a_dom_element_inside_jsx/dz5cexl/
  return (
    <>
      {/* <div
        className={cs(css.cheatsheets, { [css.loaddone]: element })}
        ref={(ref) => element && ref?.appendChild(element)}
      /> */}
      {markup && (
        <Markup content={markup} attributes={{ className: cs(css.cheatsheets, { [css.loaddone]: element }) }} />
      )}
      <p className={cs(css.devhints, { "dis-none": !element })}>
        <a href="https://devhints.io/" target="_blank" rel="noopener noreferrer">
          powered by devhints
        </a>
      </p>
    </>
  )
}

export default Devhints

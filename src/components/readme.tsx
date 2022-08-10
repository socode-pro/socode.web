import React, { useState, useEffect } from "react"
import cs from "classnames"
import { marked } from "marked"
import Fuse from "fuse.js"
import { Markup } from "interweave"
import { isRelationHref, transRelationHref } from "../utils/assist"
import { useStoreActions, useStoreState } from "../Store"
import Language from "../utils/language"
import css from "./readme.module.scss"
import Loader from "./loader/loader1"

interface Item {
  index: number
  text: string
  description?: string
}

const fuseOptions: Fuse.IFuseOptions<Item> = {
  keys: ["text", "description"],
  threshold: 0.3,
  minMatchCharLength: 2,
  useExtendedSearch: true,
}

interface Props {
  base: string
  paths: ReadonlyArray<{
    path: string
    lang: Language
  }>
  query: string
}

const getTags = (base: string, body: Element): NodeListOf<HTMLElement> => {
  if (base.endsWith("public-apis")) {
    return body.querySelectorAll("table td>a[href]") as NodeListOf<HTMLElement>
  }
  return body.querySelectorAll("ul>li>a[href]") as NodeListOf<HTMLElement>
}

const getDescription = (base: string, tag: HTMLElement): string | undefined => {
  if (base.endsWith("public-apis")) {
    if (tag.parentElement?.nextElementSibling) {
      return tag.parentElement.nextElementSibling.textContent || undefined
    }
  }
  return undefined
}

const changeTag = (base: string, tag: HTMLElement, display: string): void => {
  if (base.endsWith("public-apis")) {
    if (tag.parentElement?.parentElement) {
      tag.parentElement.parentElement.style.display = display
    }
  } else if (tag.parentElement) {
    tag.parentElement.style.display = display
  }
}

const changeTags = (base: string, body: Element, tags: NodeListOf<HTMLElement>, display: string): void => {
  tags.forEach((tag) => changeTag(base, tag, display))
  if (base.endsWith("public-apis")) {
    const items = body.querySelectorAll("ul>li, h3, thead, strong") as NodeListOf<HTMLElement>
    items.forEach((tag) => {
      tag.style.display = display
    })
  } else if (base.endsWith("free-programming-books")) {
    const items = body.querySelectorAll("h3, h4") as NodeListOf<HTMLElement>
    items.forEach((tag) => {
      tag.style.display = display
    })
  }
}

const Readme: React.FC<Props> = ({ base, paths, query }: Props): JSX.Element => {
  const [markup, setMarkup] = useState<string | null>(null)
  const [path, setPath] = useState<string>("")

  const docLanguage = useStoreState<Language>((state) => state.search.docLanguage)
  const setDocLanguage = useStoreActions((actions) => actions.search.setDocLanguage)

  const loading = useStoreState<boolean>((state) => state.readme.loading)
  const markdown = useStoreState<string>((state) => state.readme.markdown)
  const getMarkdown = useStoreActions((actions) => actions.readme.getMarkdown)

  useEffect(() => {
    const readme = paths.find((r) => r.lang === docLanguage)
    setPath(readme?.path || paths[0].path)
  }, [docLanguage, paths])

  useEffect(() => {
    getMarkdown({ base, path })
  }, [getMarkdown, base, path])

  useEffect(() => {
    const markedHtml = marked(markdown)
    setMarkup(markedHtml)
  }, [markdown])

  useEffect(() => {
    if (!path) return
    const body = document.querySelector(".markdown-body")
    if (!body) return

    body.querySelectorAll("a[href]").forEach((tag) => {
      const href = tag.getAttribute("href")
      if (href && isRelationHref(href)) {
        const nHref = transRelationHref(href, path)
        tag.setAttribute("href", `https://github.com/${base}/raw/master/${nHref}`)
      }
    })

    body.querySelectorAll("img[src]").forEach((tag) => {
      const href = tag.getAttribute("src")
      if (href && isRelationHref(href)) {
        const nHref = transRelationHref(href, path)
        tag.setAttribute("src", `https://github.com/${base}/raw/master/${nHref}`)
      }
    })
  }, [base, markup, path])

  useEffect(() => {
    const body = document.querySelector(".markdown-body")
    if (!body) return
    const tags = getTags(base, body)

    if (query) {
      changeTags(base, body, tags, "none")

      const items = Array.from(tags).map((tag, i) => ({
        index: i,
        text: tag.textContent || "",
        description: getDescription(base, tag),
      }))
      const fuse = new Fuse(items, fuseOptions)
      const result = fuse.search<Item>(query).map((r) => r.item)

      result.forEach((r) => {
        const tag = tags[r.index] as HTMLElement
        changeTag(base, tag, "block")
      })
    } else {
      changeTags(base, body, tags, "")
    }
  }, [base, query])

  if (loading) {
    return <Loader type={2} />
  }

  return (
    <>
      {paths.length > 1 && (
        <div className={cs("select is-rounded", css.selector)}>
          <select value={docLanguage} onChange={(e) => setDocLanguage(e.target.value as Language)}>
            {paths.map((d) => (
              <option key={d.lang} value={d.lang}>
                {Object.keys(Language).filter((e) => Language[e] === d.lang)}
              </option>
            ))}
          </select>
        </div>
      )}
      {markup && <Markup content={markup} tagName="div" attributes={{ className: "markdown-body" }} />}
    </>
  )
}

export default Readme

import React, { useState, useEffect } from "react"
import cs from "classnames"
import marked from "marked"
import Fuse from "fuse.js"
import { Markup } from "interweave"
import { transRelationHref } from "../utils/assist"
import { useStoreActions, useStoreState } from "../utils/hooks"
import css from "./awesome.module.scss"
import Loader from "./loader/loader1"

interface SearchItem {
  index: number
  text: string
  description?: string
}

const fuseOptions: Fuse.IFuseOptions<SearchItem> = {
  keys: ["text", "description"],
  threshold: 0.6,
}

const getTags = (body: Element): NodeListOf<HTMLElement> => {
  return body.querySelectorAll("ul>li a[href]") as NodeListOf<HTMLElement>
}

const changeTag = (tag: HTMLElement, display: string): void => {
  if (tag.parentElement) {
    tag.parentElement.style.display = display
  }
}

const changeTags = (body: Element, tags: NodeListOf<HTMLElement>, display: string): void => {
  tags.forEach((tag) => changeTag(tag, display))
  const items = body.querySelectorAll("h1,h2,h3,h4,h5,h6,em") as NodeListOf<HTMLElement>
  items.forEach((tag) => {
    tag.style.display = display
  })
}

interface Props {
  name: string
  awesome: string
  query: string
}

const Awesome: React.FC<Props> = ({ name, awesome, query }: Props): JSX.Element => {
  const [markup, setMarkup] = useState<string | null>(null)
  const [querying, setQuerying] = useState<boolean>(false)

  const loading = useStoreState<boolean>((state) => state.awesome.loading)
  const markdown = useStoreState<string>((state) => state.awesome.markdown)
  const getMarkdown = useStoreActions((actions) => actions.awesome.getMarkdown)

  useEffect(() => {
    getMarkdown({ name, awesome })
  }, [getMarkdown, awesome, name])

  useEffect(() => {
    const markedHtml = marked(markdown)
    setMarkup(markedHtml)
  }, [markdown])

  useEffect(() => {
    if (!awesome) return
    const body = document.querySelector(".markdown-body")
    if (!body) return

    body.querySelectorAll("a[href]").forEach((tag) => {
      const href = tag.getAttribute("href")
      const nPath = transRelationHref(href, "/README.md")
      if (nPath) {
        tag.setAttribute("href", `https://github.com/${awesome}/raw/master/${nPath}`)
      }
    })

    body.querySelectorAll("img[src]").forEach((tag) => {
      const href = tag.getAttribute("src")
      const nPath = transRelationHref(href, "/README.md")
      if (nPath) {
        tag.setAttribute("src", `https://github.com/${awesome}/raw/master/${nPath}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markup])

  useEffect(() => {
    const body = document.querySelector(".markdown-body")
    if (!body) return
    const tags = getTags(body)

    if (query) {
      changeTags(body, tags, "none")

      const items = Array.from(tags).map((tag, i) => ({
        index: i,
        text: tag.textContent || "",
      }))
      const fuse = new Fuse(items, fuseOptions)
      const result = fuse.search<SearchItem>(query).map((r) => r.item)

      result.forEach((r) => {
        const tag = tags[r.index] as HTMLElement
        changeTag(tag, "block")
      })
    }
    setQuerying(!!query)
  }, [query])

  if (loading) {
    return <Loader type={2} />
  }

  // https://www.re[markdown]it.com/r/reactjs/comments/8k49m3/can_i_render_a_dom_element_inside_jsx/dz5cexl/
  return (
    <>
      {markup && <Markup content={markup} attributes={{ className: "markdown-body" }} />}
      <p className={cs(css.powered, { "dis-none": !markup })}>
        <a href={`https://github.com/${awesome}`} target="_blank" rel="noopener noreferrer">
          powered by {awesome}
        </a>
      </p>
    </>
  )
}

export default Awesome

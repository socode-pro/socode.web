import React, { useEffect, useCallback, useRef } from "react"
import cs from "classnames"
import { Markup } from "interweave"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useStoreActions, useStoreState } from "../Store"
import { DevdocEntrie } from "../models/devdocs"
import { isRelationHref, transRelationHref } from "../utils/assist"
import { getPathParam, setPathParam } from "../utils/pathParam"
import useHotkeys from "../utils/useHotkeys"
import Loader1 from "./loader/loader1"
import css from "./devdocs.module.scss"

const Devdocs: React.FC = (): JSX.Element => {
  const docContainer = useRef<HTMLDivElement>(null)

  const version = useStoreState<string>((state) => state.devdocs.version)
  const menuLoading = useStoreState<boolean>((state) => state.devdocs.menuLoading)
  const docLoading = useStoreState<boolean>((state) => state.devdocs.docLoading)

  const menus = useStoreState<Array<{ group: string; entries: Array<DevdocEntrie> }>>((state) => state.devdocs.menus)

  const queryItems = useStoreState<Array<DevdocEntrie>>((state) => state.devdocs.queryItems)
  const queryIndex = useStoreState<number>((state) => state.devdocs.queryIndex)
  const setQueryIndex = useStoreActions((actions) => actions.devdocs.setQueryIndex)

  const expandings = useStoreState<{ [index: string]: boolean }>((state) => state.devdocs.expandings)
  const toggleExpanding = useStoreActions((actions) => actions.devdocs.toggleExpanding)

  const docs = useStoreState<string>((state) => state.devdocs.docs)
  const currentPath = useStoreState<string>((state) => state.devdocs.currentPath)
  const selectPath = useStoreActions((actions) => actions.devdocs.selectPath)

  const popstateSelect = useCallback(async () => {
    const path = getPathParam("docspath")
    if (path) {
      selectPath(path)
    }
  }, [selectPath])

  useEffect(() => {
    window.addEventListener("popstate", popstateSelect)
    return () => {
      window.removeEventListener("popstate", popstateSelect)
    }
  }, [popstateSelect])

  useEffect(() => {
    if (!docs || !docContainer.current) return

    if (currentPath.includes("#")) {
      const anchorId = currentPath.split("#").slice(-1).pop()
      const anchor = document.getElementById(anchorId || currentPath)
      if (anchor) {
        anchor.scrollIntoView()
        // docContainer.current.scrollTop -= 220
      }
    }

    const atags = docContainer.current.querySelectorAll("a[href]")
    atags.forEach((tag) => {
      const href = tag.getAttribute("href")
      if (href && isRelationHref(href)) {
        const nhref = transRelationHref(href, currentPath)
        const searchParams = new URLSearchParams(window.location.search)
        setPathParam(searchParams, "docspath", nhref)
        tag.setAttribute("href", `/?${searchParams.toString()}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docs])

  useHotkeys(
    "down",
    () => {
      if (queryItems.length) {
        if (queryItems.length - 1 >= queryIndex + 1) {
          setQueryIndex(queryIndex + 1)
        } else {
          setQueryIndex(0)
        }
        return false
      }
      return true
    },
    [queryItems, queryIndex],
    ["main_input"]
  )

  useHotkeys(
    "up",
    () => {
      if (queryItems.length && queryIndex > 0) {
        setQueryIndex(queryIndex - 1)
        return false
      }
      return true
    },
    [queryItems, queryIndex],
    ["main_input"]
  )

  useHotkeys(
    "enter",
    () => {
      if (queryItems.length) {
        selectPath(queryItems[queryIndex].path)
        return false
      }
      return true
    },
    [queryItems, queryIndex],
    ["main_input"]
  )

  if (menuLoading) {
    return <Loader1 type={2} />
  }

  return (
    <>
      {!!queryItems.length && (
        <div className={cs(css.searchItems)}>
          {queryItems.map((item, i) => (
              <a
                className={cs(css.item, { [css.selected]: i === queryIndex })}
                key={item.id}
                onClick={() => selectPath(item.path)}>
                <Markup tagName="span" attributes={{ className: css.typename }} content={`${item.type}:`} />
                <Markup tagName="span" content={item.name} />
              </a>
            ))}
        </div>
      )}
      {!queryItems.length && (
        <div className={cs("columns", "container", css.devdocs)}>
          <div className={cs("column", "is-one-quarter")}>
            {!!version && <p className={css.version}>version:{version}</p>}
            {menus.map((result) => {
              const { group, entries } = result
              return (
                <div key={group} className={cs(css.typegroup, { [css.expanding]: expandings[group] })}>
                  <div className={css.typename} onClick={() => toggleExpanding(group)}>
                    <FontAwesomeIcon icon={faAngleRight} className={css.icon} />
                    <span>{group}</span>
                  </div>
                  <ul className={css.childrens}>
                    {entries.map((item) => (
                        <li key={item.id}>
                          <a
                            title={item.name}
                            className={cs(css.item, { [css.current]: currentPath === item.path })}
                            onClick={() => selectPath(item.path)}>
                            {item.name}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className={cs("column", css.docContainer)} ref={docContainer}>
            {docLoading && <Loader1 type={1} />}
            {/* {docs && <Markup content={docs} attributes={{ className: "_page pd10" }} />} */}
            {docs && <div className="_page pd10" dangerouslySetInnerHTML={{ __html: docs }} />}
          </div>
        </div>
      )}
    </>
  )
}

export default Devdocs

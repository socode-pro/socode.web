import React, { useEffect, useCallback, useRef } from "react"
import cs from "classnames"
import { Markup } from "interweave"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { useStoreActions, useStoreState } from "../Store"
import { DevdocEntrieWithKey } from "../models/devdocs_united"
import { DevdocMeta } from "../models/storage"
import { isRelationHref, transRelationHref } from "../utils/assist"
import useHotkeys from "../utils/useHotkeys"
import Loader1 from "./loader/loader1"
import { Settings } from "../models/profile"
import css from "./devdocs_united.module.scss"

const DevdocsUnited: React.FC = (): JSX.Element => {
  const docContainer = useRef<HTMLDivElement>(null)
  const { addressBarKeys } = useStoreState<Settings>((state) => state.profile.settings)
  const loadIndexsByKeys = useStoreActions((actions) => actions.devdocsUnited.loadIndexsByKeys)

  const menuLoading = useStoreState<boolean>((state) => state.devdocsUnited.menuLoading)
  const docLoading = useStoreState<boolean>((state) => state.devdocsUnited.docLoading)

  const currentMenus = useStoreState<Array<{ group: string; entries: Array<DevdocEntrieWithKey> }>>(
    (state) => state.devdocsUnited.currentMenus
  )
  const currentMeta = useStoreState<DevdocMeta | null>((state) => state.devdocsUnited.currentMeta)

  const query = useStoreState<string>((state) => state.search.query)
  const queryItems = useStoreState<Array<DevdocEntrieWithKey>>((state) => state.devdocsUnited.queryItems)
  const queryIndex = useStoreState<number>((state) => state.devdocsUnited.queryIndex)
  const setQueryIndex = useStoreActions((actions) => actions.devdocsUnited.setQueryIndex)

  const expandings = useStoreState<{ [index: string]: boolean }>((state) => state.devdocsUnited.expandings)
  const toggleExpanding = useStoreActions((actions) => actions.devdocsUnited.toggleExpanding)

  const docs = useStoreState<string>((state) => state.devdocsUnited.docs)
  const currentPath = useStoreState<string>((state) => state.devdocsUnited.currentPath)
  const selectPath = useStoreActions((actions) => actions.devdocsUnited.selectPath)

  useEffect(() => {
    addressBarKeys && loadIndexsByKeys(addressBarKeys)
  }, [addressBarKeys, loadIndexsByKeys])

  const popstateSelect = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get("docscode")
    const path = searchParams.get("docspath")
    if (code && path) {
      selectPath({ code, path })
    }
  }, [selectPath])

  useEffect(() => {
    popstateSelect()
  }, [popstateSelect])

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
        searchParams.set("devdocs", nhref)
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
        const item = queryItems[queryIndex]
        selectPath({ code: item.key, path: item.path })
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
      {!!query && (
        <div className={cs(css.searchItems)}>
          {queryItems.map((item, i) => {
            return (
              <a
                className={cs(css.item, { [css.selected]: i === queryIndex })}
                key={item.name + item.path}
                onClick={() => selectPath({ code: item.key, path: item.path })}>
                <span className={css.keyname}>{item.key}</span>
                <Markup tagName="span" attributes={{ className: css.typename }} content={`${item.type}:`} />
                <Markup tagName="span" content={item.name} />
              </a>
            )
          })}
        </div>
      )}
      {!query && (
        <div className={cs("columns", "container", css.devdocs)}>
          <div className={cs("column", "is-one-quarter")}>
            {!!currentMeta && (
              <div className={css.currentMeta}>
                <p className={css.metaName}>{currentMeta.name}</p>
                <p className={css.metaVersion}>version:{currentMeta.release}</p>
              </div>
            )}
            {currentMenus.map((result) => {
              const { group, entries } = result
              return (
                <div key={group} className={cs(css.typegroup, { [css.expanding]: expandings[group] })}>
                  <div className={css.typename} onClick={() => toggleExpanding(group)}>
                    <FontAwesomeIcon icon={faAngleRight} className={css.icon} />
                    <span>{group}</span>
                  </div>
                  <ul className={css.childrens}>
                    {entries.map((item) => {
                      return (
                        <li key={item.name + item.path}>
                          <a
                            title={item.name}
                            className={cs(css.item, { [css.current]: currentPath === item.path })}
                            onClick={() => selectPath({ code: item.key, path: item.path })}>
                            {item.name}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )
            })}
          </div>
          <div className={cs("column", css.docContainer)} ref={docContainer}>
            {docLoading && <Loader1 type={1} />}
            {docs && <Markup content={docs} attributes={{ className: "_page pd10" }} />}
          </div>
        </div>
      )}
    </>
  )
}

export default DevdocsUnited

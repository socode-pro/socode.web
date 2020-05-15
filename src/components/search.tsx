import React, { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from "react"
import { useSpring, animated } from "react-spring"
import dayjs from "dayjs"
import debounce from "lodash/debounce"
import docsearch from "docsearch.js"
import algoliasearch from "algoliasearch"
import autocomplete from "autocomplete.js"
import cs from "classnames"
import Highlighter from "react-highlight-words"
import Brand from "./brand"
import CheatSheets from "./cheatsheets"
import Rework from "./rework"
import Tools from "./tools"
import Awesome from "./awesome"
import Readme from "./readme"
import Devdocs from "./devdocs"
import Slogan from "./slogan"
import Trending from "./trending"
import Region from "./region"
import Encode from "./encode"
import Language, { ProgramLanguage, InterfaceLanguage } from "../utils/language"
import { SKey, IsUnSearchableKey, SKeyCategory, KeyPlaceholder } from "../utils/searchkeys"
import useSKeyCategoryIntl from "../utils/searchkeysIntl"
import { getAutocompleteTemplate, getAutocompleteUrl } from "../utils/algolia_template"
import useHotkeys from "../utils/useHotkeys"
import { StringEnumObjects, IntEnumObjects, winSearchParams, isFirefox, isInStandaloneMode } from "../utils/assist"
import { useStoreActions, useStoreState } from "../utils/hooks"
import { SearchTimeRange, SocodeResult } from "../services/socode.service"
import { NpmsResult } from "../services/npms.service"
import { SettingsType } from "../models/storage"
import { SMError } from "../models/search"
import { Suggester, SuggestItem } from "../services/suggest.service"
import css from "./search.module.scss"
import Loader1 from "./loader/loader1"
import { ReactComponent as Github } from "../images/github.svg"

const GithubStars = lazy(() => import("./stars"))

const languageOptions = StringEnumObjects(Language)
const programLanguageOptions = IntEnumObjects(ProgramLanguage)
const timeRangeOptions = StringEnumObjects(SearchTimeRange)

const SearchInput: React.FC = (): JSX.Element => {
  const inputEl = useRef<HTMLInputElement & { onsearch: (e: InputEvent) => void }>(null)
  const pinnedTabEl = useRef<HTMLDivElement>(null)
  const searchTabEl = useRef<HTMLDivElement>(null)
  const cheatSheetsTabEl = useRef<HTMLDivElement>(null)
  const collectionTabEl = useRef<HTMLDivElement>(null)
  const learnTabEl = useRef<HTMLDivElement>(null)
  const toolsTabEl = useRef<HTMLDivElement>(null)
  const documentTabEl = useRef<HTMLDivElement>(null)

  const [focus, setFocus] = useState(true)
  const [suggeste, setSuggeste] = useState<{ words: Array<SuggestItem>; key: string } | null>(null)
  const [suggesteIndex, setSuggesteIndex] = useState(-1)
  const [keyIndex, setKeyIndex] = useState(-1)
  const [tabIndex, setTabIndex] = useState(0)

  const keys = useStoreState<Array<SKey>>((state) => state.searchKeys.keys)
  const pinKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.pinKeys)
  const searchKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.searchKeys)
  const cheatSheetsKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.cheatSheetsKeys)
  const collectionKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.collectionKeys)
  const learnKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.learnKeys)
  const toolsKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.toolsKeys)
  const documentKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.documentKeys)
  const searchedKeys = useStoreState<Array<SKey>>((state) => state.searchKeys.searchedKeys)

  const kquery = useStoreState<string>((state) => state.searchKeys.kquery)
  const setKquery = useStoreActions((actions) => actions.searchKeys.setKquery)
  const currentKey = useStoreState<SKey>((state) => state.searchKeys.currentKey)
  const setCurrentKey = useStoreActions((actions) => actions.searchKeys.setCurrentKey)
  const addPin = useStoreActions((actions) => actions.searchKeys.addPin)
  const removePin = useStoreActions((actions) => actions.searchKeys.removePin)
  const displayKeys = useStoreState<boolean>((state) => state.searchKeys.displayKeys)
  const setDisplayKeys = useStoreActions((actions) => actions.searchKeys.setDisplayKeys)

  const squery = useStoreState<string>((state) => state.search.query)
  const setSquery = useStoreActions((actions) => actions.search.setQuery)
  const timeRange = useStoreState<SearchTimeRange>((state) => state.search.timeRange)
  const setTimeRange = useStoreActions((actions) => actions.search.setTimeRangeThunk)
  const pageno = useStoreState<ProgramLanguage>((state) => state.search.pageno)
  const nextPage = useStoreActions((actions) => actions.search.nextPageThunk)
  const prevPage = useStoreActions((actions) => actions.search.prevPageThunk)
  const searchLanguage = useStoreState<Language>((state) => state.search.searchLanguage)
  const setSearchLanguage = useStoreActions((actions) => actions.search.setSearchLanguageThunk)
  const docLanguage = useStoreState<Language>((state) => state.search.docLanguage)
  const setDocLanguage = useStoreActions((actions) => actions.search.setDocLanguage)

  const programLanguage = useStoreState<ProgramLanguage>((state) => state.storage.programLanguage)
  const setProgramLanguage = useStoreActions((actions) => actions.storage.setProgramLanguage)
  const { language, displayTrending } = useStoreState<SettingsType>((state) => state.storage.settings)
  const [awesomeOrDevdoc, setAwesomeOrDevdoc] = useState<boolean>(false)

  const searchIntl = useSKeyCategoryIntl(SKeyCategory.Search)
  const toolsIntl = useSKeyCategoryIntl(SKeyCategory.Tools)
  const cheatSheetsIntl = useSKeyCategoryIntl(SKeyCategory.CheatSheets)
  const documentIntl = useSKeyCategoryIntl(SKeyCategory.Document)
  const collectionIntl = useSKeyCategoryIntl(SKeyCategory.Collection)
  const learnIntl = useSKeyCategoryIntl(SKeyCategory.Learn)
  const pinnedIntl = language === InterfaceLanguage.中文 ? "置顶" : "PINNED"

  const result = useStoreState<SocodeResult | null>((state) => state.search.result)
  const npmResult = useStoreState<NpmsResult | null>((state) => state.search.npmResult)
  const wapperTop = useStoreState<number>((state) => state.search.wapperTop)
  const loading = useStoreState<boolean>((state) => state.search.loading)
  const error = useStoreState<SMError | null>((state) => state.search.error)
  const search = useStoreActions((actions) => actions.search.search)
  const clearResult = useStoreActions((actions) => actions.search.clearResult)
  const lunchUrlAction = useStoreActions((actions) => actions.search.lunchUrl)

  // const initialKeys = useStoreActions(actions => actions.searchKeys.initialKeys)
  const initialCurrentKey = useStoreActions((actions) => actions.searchKeys.initialCurrentKey)
  const estimateRegion = useStoreActions((actions) => actions.storage.estimateRegion)
  useEffect(() => {
    // initialKeys()
    initialCurrentKey()
    estimateRegion()
  }, [initialCurrentKey, estimateRegion])

  const dsConfig = useMemo(() => {
    if (currentKey && currentKey.docsearch) {
      const target = currentKey.docsearch.find((k) => k.lang === docLanguage)
      if (target) return target
      return currentKey.docsearch[0]
    }
    return null
  }, [currentKey, docLanguage])

  // to refresh input dom, until uninstall api: https://github.com/algolia/docsearch/issues/927
  const [docsearchHack, setDocsearchHack] = useState(true)
  // --------------------------------------------

  const spring = useSpring({ wapperTop })

  const debounceSuggeste = useCallback(
    debounce<(value: string) => Promise<void>>(async (value) => {
      setSuggesteIndex(-1)
      if (!value || IsUnSearchableKey(currentKey)) {
        setSuggeste(null)
        return
      }
      const words = await Suggester(value, currentKey.code)
      setSuggeste({ words, key: currentKey.code })
    }, 500),
    [currentKey]
  )

  const handleQueryChange = useCallback(
    (e) => {
      if (displayKeys) {
        setKquery(e.target.value)
      } else {
        setSquery(e.target.value)
        debounceSuggeste?.cancel()
        debounceSuggeste(e.target.value)
      }
    },
    [debounceSuggeste, displayKeys, setKquery, setSquery]
  )

  const clearResultAll = useCallback(() => {
    setSuggesteIndex(-1)
    setSuggeste(null)
    clearResult()
  }, [clearResult])

  const focusInput = useCallback(
    (key?: SKey) => {
      const ckey = key || currentKey
      if (ckey.docsearch) {
        document?.getElementById(`docsearch_${ckey.code}`)?.focus()
      } else {
        inputEl.current?.focus()
      }
    },
    [currentKey]
  )

  useHotkeys(
    "/",
    () => {
      focusInput()
      if (document.activeElement?.tagName !== "INPUT") {
        return false
      }
      return true
    },
    [focusInput],
    ["BODY"]
  )

  useHotkeys(
    "down",
    () => {
      if (displayKeys && kquery) {
        if (searchedKeys.length > keyIndex + 1) {
          setKeyIndex(keyIndex + 1)
        } else {
          setKeyIndex(0)
        }
      } else if (suggeste && suggeste.words.length > suggesteIndex + 1) {
        setSuggesteIndex(suggesteIndex + 1)
        setSquery(suggeste.words[suggesteIndex + 1].name) // warn: suggesteIndex must '-1' when autocomplate arr init
      }
      return false
    },
    [suggesteIndex, suggeste, displayKeys, keyIndex, searchedKeys],
    [css.input]
  )

  useHotkeys(
    "up",
    () => {
      if (displayKeys && kquery) {
        if (searchedKeys.length >= keyIndex + 1 && keyIndex > 0) {
          setKeyIndex(keyIndex - 1)
        } else {
          setKeyIndex(0)
        }
      } else if (suggeste && suggesteIndex > 0) {
        setSuggesteIndex(suggesteIndex - 1)
        setSquery(suggeste.words[suggesteIndex - 1].name)
      }
      return false
    },
    [suggesteIndex, suggeste, displayKeys, keyIndex, searchedKeys],
    [css.input]
  )

  const suggesteClick = useCallback(
    (q, url?: string) => {
      clearResultAll()

      if (url) {
        lunchUrlAction(url)
      } else {
        setSquery(q)
        search()
      }
    },
    [clearResultAll, lunchUrlAction, search, setSquery]
  )

  useEffect(() => {
    const popstateSearch = (): void => {
      search()
    }
    window.addEventListener("popstate", popstateSearch)
    return () => {
      window.removeEventListener("popstate", popstateSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!dsConfig || !docsearchHack) return

    if (dsConfig.byAutocomplete) {
      const client = algoliasearch(dsConfig.appId, dsConfig.apiKey)
      const index = client.initIndex(dsConfig.indexName)

      autocomplete(
        `#docsearch_${currentKey.code}`,
        {
          hint: false,
          autoselect: true,
          // debug: true
        },
        [
          {
            source: autocomplete.sources.hits(index, { ...dsConfig.algoliaOptions, hitsPerPage: 5 }),
            templates: { suggestion: getAutocompleteTemplate(currentKey.code) },
          },
        ]
      ).on("autocomplete:selected", (event, data) => {
        window.open(getAutocompleteUrl(currentKey.code, data), "_blank")?.focus()
      })
      return
    }

    let customConfig = {}
    if (currentKey.code === "eslint" && dsConfig.lang === Language.中文_简体) {
      customConfig = {
        transformData: (hits) => {
          return hits.map((hit) => {
            hit.url = hit.url.replace("https://eslint.org", "https://cn.eslint.org")
            return hit
          })
        },
      }
    } else if (currentKey.code === "gradle") {
      customConfig = {
        transformData: (hits) => {
          return hits.map((hit) => {
            if (hit.anchor.substring(0, 10) === "org.gradle") {
              hit.hierarchy.lvl0 = "DSL Reference"
            }
            return hit
          })
        },
      }
    }

    docsearch({
      appId: dsConfig.appId,
      apiKey: dsConfig.apiKey,
      indexName: dsConfig.indexName,
      inputSelector: `#docsearch_${currentKey.code}`,
      algoliaOptions: { ...dsConfig.algoliaOptions, hitsPerPage: 7 },
      handleSelected: (input, event, data) => {
        window.open(data.url, "_blank")?.focus()
      },
      autocompleteOptions: {
        tabAutocomplete: false,
        hint: false,
      },
      debug: false,
      ...customConfig,
    })
  }, [currentKey.code, docsearchHack, dsConfig])

  const changeKey = useCallback(
    (key: SKey) => {
      clearResultAll()
      setSquery("")
      setKquery("")
      setCurrentKey(key)
      winSearchParams({ keyname: key.code, query: "" })
      setDisplayKeys(false)
      setKeyIndex(-1)
      setTimeout(() => focusInput(key), 200)
    },
    [clearResultAll, focusInput, setCurrentKey, setDisplayKeys, setKquery, setSquery]
  )

  const handlerSearch = useCallback(
    (e?) => {
      if (displayKeys) {
        if (keyIndex >= 0 && searchedKeys.length >= keyIndex + 1) {
          changeKey(searchedKeys[keyIndex])
        }
      } else {
        clearResultAll()
        search()
        e?.target?.blur()
      }
    },
    [changeKey, clearResultAll, displayKeys, keyIndex, search, searchedKeys]
  )

  if (inputEl.current !== null) inputEl.current.onsearch = handlerSearch

  const handleQueryKeyPress = useCallback(
    (e) => {
      if (isFirefox && e.key === "Enter") {
        handlerSearch()
      }
    },
    [handlerSearch]
  )

  const keysDom = useCallback(
    (gkeys: SKey[]) => {
      return gkeys.map((key, i) => {
        let tooltipProps = {}
        if (key.tooltipsCN && language === InterfaceLanguage.中文) {
          tooltipProps = { "data-tooltip": key.tooltipsCN }
        } else if (key.tooltips) {
          tooltipProps = { "data-tooltip": key.tooltips }
        }
        return (
          <div
            key={key.code}
            className={cs(css.skeybox, "has-tooltip-multiline has-tooltip-warning", { [css.index]: keyIndex === i })}
            {...tooltipProps}
            onClick={() => changeKey(key)}>
            <div className={css.skey}>
              <div className={cs(css.skname)} style={{ backgroundImage: `url(/keys/${key.icon})`, ...key.iconProps }}>
                {key.hideName ? <>&nbsp;</> : key.name}
              </div>
              <div className={css.shortkeys}>
                {key.shortkeys}
                <span className={css.plus}>+</span>
                <span className={css.tab}>tab</span>
              </div>
            </div>
            <div>
              {key.devdocs && <i onClick={() => setAwesomeOrDevdoc(false)} className={cs("fa-devdocs", css.kicon)} />}
              {key.awesome && <i onClick={() => setAwesomeOrDevdoc(true)} className={cs("fa-cubes", css.kicon)} />}
              <i
                onClick={(e) => {
                  e.stopPropagation()
                  if (key.pin) {
                    removePin(key.code)
                  } else {
                    addPin(key.code)
                  }
                }}
                className={cs("fa-thumbtack", css.thumbtack, { [css.usage]: key.pin })}
              />
            </div>
          </div>
        )
      })
    },
    [language, keyIndex, changeKey, removePin, addPin]
  )

  useHotkeys(
    "tab",
    () => {
      const key = displayKeys ? keys.find((k) => k.shortkeys === kquery) : keys.find((k) => k.shortkeys === squery)
      if (key) {
        changeKey(key)
        return false
      }
      if (displayKeys ? kquery.endsWith("`") : squery.endsWith("`")) {
        setDisplayKeys(!displayKeys)
        setTimeout(focusInput, 0)
        return false
      }
      return true
    },
    [keys, squery, kquery, focusInput],
    [css.input]
  )

  useHotkeys(
    "backspace",
    () => {
      if (!displayKeys && !squery.length) {
        setDisplayKeys(true)
      }
    },
    [displayKeys, squery],
    [css.input]
  )

  useHotkeys(
    "`",
    () => {
      if (document.activeElement?.tagName !== "INPUT") {
        setDisplayKeys(true)
        setTimeout(focusInput, 0)
        return false
      }
      return true
    },
    [displayKeys, focusInput],
    ["BODY"]
  )

  const switchTab = useCallback((index: number) => {
    setTabIndex(index)
    switch (index) {
      case 0:
        pinnedTabEl.current?.scrollIntoView()
        break
      case SKeyCategory.Search:
        searchTabEl.current?.scrollIntoView()
        break
      case SKeyCategory.Tools:
        toolsTabEl.current?.scrollIntoView()
        break
      case SKeyCategory.Collection:
        collectionTabEl.current?.scrollIntoView()
        break
      case SKeyCategory.CheatSheets:
        cheatSheetsTabEl.current?.scrollIntoView()
        break
      case SKeyCategory.Learn:
        learnTabEl.current?.scrollIntoView()
        break
      case SKeyCategory.Document:
        documentTabEl.current?.scrollIntoView()
        break
      default:
        break
    }
    window.scrollBy(0, -88)
  }, [])

  const scrollPositionTab = useCallback(
    debounce(() => {
      const tabHeight = 115
      if ((documentTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(SKeyCategory.Document)
        return
      }
      if ((learnTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(SKeyCategory.Learn)
        return
      }
      if ((cheatSheetsTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(SKeyCategory.CheatSheets)
        return
      }
      if ((collectionTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(SKeyCategory.Collection)
        return
      }
      if ((toolsTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(SKeyCategory.Tools)
        return
      }
      if ((searchTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(SKeyCategory.Search)
        return
      }
      if ((pinnedTabEl.current?.getBoundingClientRect().top || 999) <= tabHeight) {
        setTabIndex(0)
      }
    }, 10),
    []
  )

  useEffect(() => {
    window.addEventListener("scroll", scrollPositionTab)
    return () => {
      window.removeEventListener("scroll", scrollPositionTab)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="container">
        <Brand />
        <animated.div
          className={cs(css.searchWapper, { [css.focus]: focus })}
          style={{
            top: spring.wapperTop,
          }}>
          <div className={cs(css.searchInput)}>
            <span className={css.sep}>$</span>
            {!displayKeys && (
              <span
                className={cs(css.prefix, { [css.displayKeys]: displayKeys })}
                onClick={() => setDisplayKeys(!displayKeys)}>
                {currentKey.name}
              </span>
            )}

            {!currentKey.docsearch && (
              <input
                type="search"
                className={css.input}
                spellCheck={false}
                value={displayKeys ? kquery : squery}
                autoFocus
                // name="q"
                onBlur={() => {
                  setTimeout(() => setFocus(false), 100) // fix autocomplateClick
                }}
                onFocus={() => {
                  setFocus(true)
                }}
                onChange={handleQueryChange}
                placeholder={displayKeys ? "select resources..." : KeyPlaceholder(currentKey, awesomeOrDevdoc)}
                ref={inputEl} // https://stackoverflow.com/a/48656310/346701
                onKeyPress={isFirefox ? handleQueryKeyPress : () => undefined}
              />
            )}

            {currentKey.docsearch && docsearchHack && (
              <div key={currentKey.code} className={cs(css.docsearch)}>
                <input
                  type="search"
                  placeholder="search..."
                  className={cs(css.input, { "dis-none": displayKeys })}
                  spellCheck={false}
                  autoFocus
                  value={squery}
                  onChange={(e) => setSquery(e.target.value)}
                  id={`docsearch_${currentKey.code}`}
                />
              </div>
            )}

            {!displayKeys && currentKey.docsearch && currentKey.docsearch.length > 1 && (
              <div className="select is-rounded mgr10">
                <select
                  value={docLanguage}
                  onChange={async (e) => {
                    setDocsearchHack(false)
                    setDocLanguage(e.target.value as Language)
                    setTimeout(() => setDocsearchHack(true), 0)
                  }}>
                  {currentKey.docsearch.map((d) => (
                    <option key={d.lang} value={d.lang}>
                      {Object.keys(Language).filter((e) => Language[e] === d.lang)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && currentKey.homelink && (
              <a
                href={currentKey.homelink}
                onClick={(e) => e.stopPropagation()}
                className={cs("fa-home", css.kicon)}
                aria-label="home"
                target="_blank"
                rel="noopener noreferrer"
              />
            )}
            {!displayKeys && currentKey.devdocs && (
              <i
                onClick={(e) => setAwesomeOrDevdoc(false)}
                className={cs("fa-devdocs", css.kicon, { [css.active]: !awesomeOrDevdoc })}
              />
            )}
            {!displayKeys && currentKey.awesome && (
              <i
                onClick={(e) => setAwesomeOrDevdoc(true)}
                className={cs("fa-cubes", css.kicon, { [css.active]: awesomeOrDevdoc })}
              />
            )}

            {result !== null && (
              <div className="select is-rounded mgl10">
                {/* https://www.typescriptlang.org/docs/handbook/jsx.html#the-as-operator */}
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value as SearchTimeRange)}>
                  {timeRangeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && currentKey.bylang && (
              <div className="select is-rounded mgl10">
                <select value={searchLanguage} onChange={(e) => setSearchLanguage(e.target.value as Language)}>
                  {languageOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && currentKey.bypglang && (
              <div className="select is-rounded mgl10">
                <select value={programLanguage} onChange={(e) => setProgramLanguage(parseInt(e.target.value, 10))}>
                  {programLanguageOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && !currentKey.docsearch && !currentKey.devdocs && (
              <i className={cs(css.sicon, "fa-search")} onClick={() => search()} />
            )}
          </div>

          {focus &&
            !displayKeys &&
            suggeste !== null &&
            suggeste.words.length > 0 &&
            suggeste.key === currentKey.code &&
            !IsUnSearchableKey(currentKey) && (
              <div
                className={cs(css.suggeste, "dropdown is-active")}
                style={{ marginLeft: currentKey.name.length * 7 + 45 }}>
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    {suggeste &&
                      suggeste.words.map((s, i) => {
                        if (currentKey.code === "github") {
                          return (
                            <div
                              key={`${s.owner}/${s.name}`}
                              onClick={() => suggesteClick(s.name, `https://github.com/${s.owner}/${s.name}`)}
                              className={cs("dropdown-item", css.sgitem, { [css.sgactive]: suggesteIndex === i })}>
                              <a>{`${s.owner}/${s.name}`}</a>
                              <span className={css.stars}>&#9733; {s.watchers}</span>
                              <p>{s.description}</p>
                            </div>
                          )
                        }
                        if (currentKey.code === "npm") {
                          return (
                            <div
                              key={s.name}
                              onClick={() => suggesteClick(s.name, `https://www.npmjs.com/package/${s.name}`)}
                              className={cs("dropdown-item", css.sgitem, { [css.sgactive]: suggesteIndex === i })}>
                              <a dangerouslySetInnerHTML={{ __html: s.highlight || "" }} />
                              <span className={css.publisher}>{s.publisher}</span>
                              <span className={css.version}>{s.version}</span>
                              <p>{s.description}</p>
                            </div>
                          )
                        }
                        if (currentKey.code === "bundlephobia") {
                          return (
                            <div
                              key={s.name}
                              onClick={() => suggesteClick(s.name, `https://bundlephobia.com/result?p=${s.name}`)}
                              className={cs("dropdown-item", css.sgitem, { [css.sgactive]: suggesteIndex === i })}>
                              <a dangerouslySetInnerHTML={{ __html: s.highlight || "" }} />
                              <span className={css.publisher}>{s.publisher}</span>
                              <span className={css.version}>{s.version}</span>
                              <p>{s.description}</p>
                            </div>
                          )
                        }
                        return (
                          <a
                            key={s.name}
                            onClick={() => suggesteClick(s.name)}
                            className={cs("dropdown-item", { "is-active": suggesteIndex === i })}>
                            {s.name}
                          </a>
                        )
                      })}
                    {currentKey.code === "github" && (
                      <>
                        <hr className="dropdown-divider" />
                        <a
                          href="https://github.algolia.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cs(css.algolia)}>
                          powered by algolia for github
                        </a>
                      </>
                    )}
                    {currentKey.code === "npm" && (
                      <>
                        <hr className="dropdown-divider" />
                        <a href="https://npms.io/" target="_blank" rel="noopener noreferrer" className={cs(css.npms)}>
                          powered by npms.io
                        </a>
                      </>
                    )}
                    {currentKey.code === "bundlephobia" && (
                      <>
                        <hr className="dropdown-divider" />
                        <a
                          href="https://bundlephobia.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cs(css.bundlephobia)}>
                          powered by bundlephobia.com
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

          {displayKeys && (
            <div className="mgl10 mgb10 mgr10">
              {kquery && <div className={cs(css.searchedKeys)}>{keysDom(searchedKeys)}</div>}
              {!kquery && (
                <div className={css.tabs}>
                  <a className={cs({ [css.current]: tabIndex === 0 })} onClick={() => switchTab(0)}>
                    {pinnedIntl}
                  </a>
                  <a
                    className={cs({ [css.current]: tabIndex === SKeyCategory.Search })}
                    onClick={() => switchTab(SKeyCategory.Search)}>
                    {searchIntl}
                  </a>
                  <a
                    className={cs({ [css.current]: tabIndex === SKeyCategory.Tools })}
                    onClick={() => switchTab(SKeyCategory.Tools)}>
                    {toolsIntl}
                  </a>
                  <a
                    className={cs({ [css.current]: tabIndex === SKeyCategory.Collection })}
                    onClick={() => switchTab(SKeyCategory.Collection)}>
                    {collectionIntl}
                  </a>
                  <a
                    className={cs({ [css.current]: tabIndex === SKeyCategory.CheatSheets })}
                    onClick={() => switchTab(SKeyCategory.CheatSheets)}>
                    {cheatSheetsIntl}
                  </a>
                  <a
                    className={cs({ [css.current]: tabIndex === SKeyCategory.Learn })}
                    onClick={() => switchTab(SKeyCategory.Learn)}>
                    {learnIntl}
                  </a>
                  <a
                    className={cs({ [css.current]: tabIndex === SKeyCategory.Document })}
                    onClick={() => switchTab(SKeyCategory.Document)}>
                    {documentIntl}
                  </a>
                </div>
              )}
              {!kquery && pinKeys.length > 0 && (
                <div ref={pinnedTabEl} className={cs(css.skgroup, css.pinnned)}>
                  {keysDom(pinKeys)}
                </div>
              )}
              {!kquery && searchKeys.length > 0 && (
                <div ref={searchTabEl} className={cs(css.skgroup)}>
                  {keysDom(searchKeys)}
                  <div className={css.kdesc}>{searchIntl}</div>
                </div>
              )}
              {!kquery && toolsKeys.length > 0 && (
                <div ref={toolsTabEl} className={cs(css.skgroup)}>
                  {keysDom(toolsKeys)}
                  <div className={css.kdesc}>{toolsIntl}</div>
                </div>
              )}
              {!kquery && collectionKeys.length > 0 && (
                <div ref={collectionTabEl} className={cs(css.skgroup)}>
                  {keysDom(collectionKeys)}
                  <div className={css.kdesc}>{collectionIntl}</div>
                </div>
              )}
              {!kquery && cheatSheetsKeys.length > 0 && (
                <div ref={cheatSheetsTabEl} className={cs(css.skgroup)}>
                  {keysDom(cheatSheetsKeys)}
                  <div className={css.kdesc}>{cheatSheetsIntl}</div>
                </div>
              )}
              {!kquery && learnKeys.length > 0 && (
                <div ref={learnTabEl} className={cs(css.skgroup)}>
                  {keysDom(learnKeys)}
                  <div className={css.kdesc}>{learnIntl}</div>
                </div>
              )}
              {!kquery && documentKeys.length > 0 && (
                <div ref={documentTabEl} className={cs(css.skgroup)}>
                  {keysDom(documentKeys)}
                  <div className={css.kdesc}>{documentIntl}</div>
                </div>
              )}
            </div>
          )}

          {!displayKeys && currentKey.code === "cheatsheets" && <CheatSheets query={squery} />}
          {!displayKeys && currentKey.code === "rework" && <Rework />}
          {!displayKeys && currentKey.code === "tools" && <Tools query={squery} />}
          {!displayKeys && currentKey.code === "github_stars" && (
            <Suspense fallback={<Loader1 type={2} />}>
              <GithubStars query={squery} />
            </Suspense>
          )}
          {!displayKeys && !awesomeOrDevdoc && currentKey.devdocs && (
            <Devdocs slug={currentKey.devdocs} query={squery} />
          )}
          {!displayKeys && awesomeOrDevdoc && currentKey.awesome && (
            <Awesome name={currentKey.shortkeys} awesome={currentKey.awesome} query={squery} />
          )}
          {!displayKeys && currentKey.readmes && (
            <Readme
              base={currentKey.readmes.base}
              paths={currentKey.readmes.paths}
              query={currentKey.readmes.searched ? squery : undefined}
            />
          )}
          {!displayKeys && currentKey.code === "get_ip" && <Region />}
          {!displayKeys && currentKey.code === "encode" && <Encode />}
          {!displayKeys && currentKey.code === "qrcode" && (
            <div className="tac">
              <canvas id="qrcode" />
            </div>
          )}

          {error !== null && <div className={css.error}>{error instanceof String ? error : error.message}</div>}

          {result !== null && (
            <div className={css.searchResult}>
              {result.results.map((r) => (
                <div key={r.url} className={css.result}>
                  <h4 className={css.header}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer">
                      {r.title}
                    </a>
                  </h4>
                  <p className={css.external}>{r.pretty_url}</p>
                  <Highlighter
                    className={css.content}
                    highlightClassName={css.highlighter}
                    searchWords={squery.split(" ")}
                    autoEscape
                    textToHighlight={r.content}
                  />
                </div>
              ))}

              <div className={cs(css.pagination, "field has-addons")}>
                {pageno !== 1 && (
                  <p className="control">
                    <button type="button" className="button is-rounded" onClick={() => prevPage()}>
                      <span className="icon">
                        <i className="fa-angle-left" />
                      </span>
                      <span>Previous Page</span>
                    </button>
                  </p>
                )}
                {result.paging && (
                  <p className="control">
                    <button type="button" className="button is-rounded" onClick={() => nextPage()}>
                      <span>Next Page</span>
                      <span className="icon">
                        <i className="fa-angle-right" />
                      </span>
                    </button>
                  </p>
                )}
              </div>

              {result.results.length === 0 && <div className={css.notFound} />}
            </div>
          )}

          {npmResult !== null && (
            <div className={css.searchResult}>
              {npmResult.results.map((r) => (
                <div key={r.package.links.npm} className={css.result}>
                  <h4 className={css.header}>
                    <a href={r.package.links.npm} target="_blank" rel="noopener noreferrer">
                      {r.package.name}
                    </a>
                  </h4>
                  <p className={css.content}>{r.package.description}</p>
                  <p className={css.infos}>
                    <a className="mgr10" href={r.package.links.repository} target="_blank" rel="noopener noreferrer">
                      <Github className={css.github} />
                    </a>
                    <span className="mgr10">{r.package.version}</span>
                    <span className="mgr10">{r.package.publisher.username}</span>
                    <span>{dayjs(r.package.date).format("YYYY-M-D")}</span>
                  </p>
                </div>
              ))}

              <div className={cs(css.pagination, "field has-addons")}>
                {pageno !== 1 && (
                  <p className="control">
                    <button type="button" className="button is-rounded" onClick={() => prevPage()}>
                      <span className="icon">
                        <i className="fa-angle-left" />
                      </span>
                      <span>Previous Page</span>
                    </button>
                  </p>
                )}
                {npmResult.total > pageno * 10 && (
                  <p className="control">
                    <button type="button" className="button is-rounded" onClick={() => nextPage()}>
                      <span>Next Page</span>
                      <span className="icon">
                        <i className="fa-angle-right" />
                      </span>
                    </button>
                  </p>
                )}
              </div>

              {npmResult.results.length === 0 && <div className={css.notFound} />}
            </div>
          )}

          {loading && <Loader1 type={2} />}

          {result !== null && (
            <div className={css.closer} onClick={clearResultAll}>
              <a className="delete is-medium" />
            </div>
          )}

          {!isInStandaloneMode && result === null && currentKey.name === "socode" && <Slogan />}
        </animated.div>

        {displayTrending && !displayKeys && !loading && (currentKey.template || currentKey.devdocs) && <Trending />}
      </div>
    </>
  )
}

export default SearchInput

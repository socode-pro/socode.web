import React, { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from 'react'
import { useSpring, animated } from 'react-spring'
import dayjs from 'dayjs'
import debounce from 'lodash/debounce'
import docsearch from 'docsearch.js'
import cs from 'classnames'
import Highlighter from 'react-highlight-words'
import Brand from './brand'
import CheatSheets from './cheatsheets'
import Tools from './tools'
import Awesome from './awesome'
import Readme from './readme'
import Devdocs from './devdocs'
import Slogan from './slogan'
import Language, { ProgramLanguage } from '../utils/language'
import { SKey, isAvoidKey } from '../utils/searchkeys'
import useHotkeys from '../utils/useHotkeys'
import { StringEnumObjects, IntEnumObjects, winSearchParams } from '../utils/assist'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { SearchTimeRange, SocodeResult } from '../services/socode.service'
import { NpmsResult } from '../services/npms.service'
import { SettingsType } from '../models/storage'
import { SMError } from '../models/search'
import { Suggester, SuggestItem } from '../services/suggest.service'
import css from './search.module.scss'
import Loader1 from './loader/loader1'
import { ReactComponent as Github } from '../images/github.svg'

const GithubStars = lazy(() => import('./stars'))

const languageOptions = StringEnumObjects(Language)
const programLanguageOptions = IntEnumObjects(ProgramLanguage)
const timeRangeOptions = StringEnumObjects(SearchTimeRange)

const SearchInput: React.FC = (): JSX.Element => {
  const inputEl = useRef<HTMLInputElement & { onsearch: (e: InputEvent) => void }>(null)

  const [focus, setFocus] = useState(true)
  const [dquery, setDquery] = useState('')
  const [suggeste, setSuggeste] = useState<{ words: Array<SuggestItem>; key: string } | null>(null)
  const [suggesteIndex, setSuggesteIndex] = useState(-1)
  const [displayKeys, setDisplayKeys] = useState(false)

  const keys = useStoreState<Array<SKey>>(state => state.searchKeys.keys)
  const pinKeys = useStoreState<Array<SKey>>(state => state.searchKeys.pinKeys)
  const usageKeys = useStoreState<Array<SKey>>(state => state.searchKeys.usageKeys)
  const moreKeys = useStoreState<Array<SKey>>(state => state.searchKeys.moreKeys)

  const kquery = useStoreState<string>(state => state.searchKeys.kquery)
  const setKquery = useStoreActions(actions => actions.searchKeys.setKquery)
  const currentKey = useStoreState<SKey>(state => state.searchKeys.currentKey)
  const setCurrentKey = useStoreActions(actions => actions.searchKeys.setCurrentKey)
  const addPin = useStoreActions(actions => actions.searchKeys.addPin)
  const removePin = useStoreActions(actions => actions.searchKeys.removePin)
  const displayMore = useStoreState<boolean>(state => state.searchKeys.displayMore)
  const setDisplayMore = useStoreActions(actions => actions.searchKeys.setDisplayMore)

  const squery = useStoreState<string>(state => state.search.query)
  const setSquery = useStoreActions(actions => actions.search.setQuery)
  const timeRange = useStoreState<SearchTimeRange>(state => state.search.timeRange)
  const setTimeRange = useStoreActions(actions => actions.search.setTimeRangeThunk)
  const pageno = useStoreState<ProgramLanguage>(state => state.search.pageno)
  const nextPage = useStoreActions(actions => actions.search.nextPageThunk)
  const prevPage = useStoreActions(actions => actions.search.prevPageThunk)
  const searchLanguage = useStoreState<Language>(state => state.search.searchLanguage)
  const setSearchLanguage = useStoreActions(actions => actions.search.setSearchLanguageThunk)
  const docLanguage = useStoreState<Language>(state => state.search.docLanguage)
  const setDocLanguage = useStoreActions(actions => actions.search.setDocLanguage)
  const programLanguage = useStoreState<ProgramLanguage>(state => state.search.programLanguage)
  const setProgramLanguage = useStoreActions(actions => actions.search.setProgramLanguage)

  const result = useStoreState<SocodeResult | null>(state => state.search.result)
  const npmResult = useStoreState<NpmsResult | null>(state => state.search.npmResult)
  const wapperTop = useStoreState<number>(state => state.search.wapperTop)
  const loading = useStoreState<boolean>(state => state.search.loading)
  const error = useStoreState<SMError | null>(state => state.search.error)
  const search = useStoreActions(actions => actions.search.search)
  const clearResult = useStoreActions(actions => actions.search.clearResult)
  const lunchUrlAction = useStoreActions(actions => actions.search.lunchUrl)

  const { language, displayAwesome } = useStoreState<SettingsType>(state => state.storage.settings)

  // const initialKeys = useStoreActions(actions => actions.searchKeys.initialKeys)
  const initialCurrentKey = useStoreActions(actions => actions.searchKeys.initialCurrentKey)
  useEffect(() => {
    // initialKeys()
    initialCurrentKey()
  }, [initialCurrentKey])

  const dsConfig = useMemo(() => {
    if (currentKey && currentKey.docsearch) {
      const target = currentKey.docsearch.find(k => k.lang === docLanguage)
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
    debounce<(value: string) => Promise<void>>(async value => {
      setSuggesteIndex(-1)
      if (!value || isAvoidKey(currentKey)) {
        setSuggeste(null)
        return
      }
      const words = await Suggester(value, currentKey.code)
      setSuggeste({ words, key: currentKey.code })
    }, 500),
    [currentKey]
  )

  const handleQueryChange = useCallback(
    e => {
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

  // const handleQueryKeyPress = useCallback((e) => {
  //   if (e.key === 'Enter') {
  //   }
  // }, [searchSubmit])

  const clearResultAll = useCallback(() => {
    setSuggesteIndex(-1)
    setSuggeste(null)
    clearResult()
  }, [clearResult])

  const handlerSearch = useCallback(
    e => {
      clearResultAll()
      search()
      e.target?.blur()
    },
    [clearResultAll, search]
  )

  if (inputEl.current !== null) inputEl.current.onsearch = handlerSearch

  const focusInput = useCallback(() => {
    if (currentKey.docsearch && !!currentKey.devdocs) {
      document?.getElementById(`docsearch_${currentKey.code}`)?.focus()
    } else {
      inputEl.current?.focus()
    }
  }, [currentKey.code, currentKey.devdocs, currentKey.docsearch])

  useHotkeys(
    '`',
    () => {
      if (document.activeElement?.tagName !== 'INPUT') {
        setDisplayKeys(!displayKeys)
        if (!displayKeys) {
          setTimeout(focusInput, 0)
        }
        return false
      }
    },
    [displayKeys],
    ['BODY']
  )

  useHotkeys(
    '/',
    () => { focusInput(); return false },
    [currentKey],
    ['BODY']
  )

  useHotkeys(
    'down',
    () => {
      if (suggeste && suggeste.words.length > suggesteIndex + 1) {
        setSuggesteIndex(suggesteIndex + 1)
        setSquery(suggeste.words[suggesteIndex + 1].name) // warn: suggesteIndex must '-1' when autocomplate arr init
      }
    },
    [suggesteIndex, suggeste],
    ['with_suggeste']
  )

  useHotkeys(
    'up',
    () => {
      if (suggeste && suggesteIndex >= 0) {
        setSuggesteIndex(suggesteIndex - 1)
        setSquery(suggeste.words[suggesteIndex - 1].name)
      }
    },
    [suggesteIndex],
    ['with_suggeste']
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
    window.addEventListener('popstate', popstateSearch)
    return () => {
      window.removeEventListener('popstate', popstateSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (dsConfig && docsearchHack) {
      let customConfig = {}
      if (currentKey.code === 'eslint' && dsConfig.lang === Language.中文_简体) {
        customConfig = {
          transformData: hits => {
            return hits.map(hit => {
              hit.url = hit.url.replace('https://eslint.org', 'https://cn.eslint.org')
              return hit
            })
          }
        }
      } else if (currentKey.code === 'gradle') {
        customConfig = {
          transformData: hits => {
            return hits.map(hit => {
              if (hit.anchor.substring(0, 10) === 'org.gradle') {
                hit.hierarchy.lvl0 = 'DSL Reference'
              }
              return hit
            })
          }
        }
      }
      docsearch({
        appId: dsConfig.appId,
        apiKey: dsConfig.apiKey,
        indexName: dsConfig.indexName,
        inputSelector: `#docsearch_${currentKey.code}`,
        algoliaOptions: { ...dsConfig.algoliaOptions, hitsPerPage: 10 },
        handleSelected: (input, event, suggestion) => {
          window.open(suggestion.url, '_blank')?.focus()
        },
        autocompleteOptions: {
          tabAutocomplete: false,
        },
        debug: false,
        ...customConfig
      })
    }
  }, [currentKey.code, docsearchHack, dsConfig])

  const changeKey = useCallback(
    (key: SKey) => {
      clearResultAll()
      setSquery('')
      setKquery('')
      setCurrentKey(key)
      winSearchParams({ keyname: key.code, query: '' })
      setDisplayKeys(false)
      setTimeout(focusInput, 200)
    },
    [clearResultAll, focusInput, setCurrentKey, setKquery, setSquery]
  )

  const getKeysDom = useCallback(
    (gkeys: SKey[]) => {
      return gkeys
        .filter(key => {
          if (key.availableLang) {
            return key.availableLang === language
          }
          if (key.disableLang) {
            return key.disableLang !== language
          }
          return true
        })
        .map(key => {
          let styles: object = { backgroundImage: `url(/keys/${key.icon})` }
          if (key.backgroundSize) {
            styles = { ...styles, backgroundSize: key.backgroundSize }
          }
          if (key.backgroundPosition) {
            styles = { ...styles, backgroundPosition: key.backgroundPosition }
          }
          if (key.width) {
            styles = { ...styles, width: key.width }
          }
          const moreprops = key.tooltips? { 'data-tooltip': key.tooltips}: {}
          return (
            <div key={key.code} className={cs(css.skeybox, 'has-tooltip-multiline has-tooltip-warning')} {...moreprops} onClick={() => changeKey(key)}>
              <div className={css.skey}>
                <div className={cs(css.skname)} style={styles}>
                  {key.hideName ? <>&nbsp;</> : key.name}
                </div>
                <div className={css.shortkeys}>
                  {key.shortkeys}
                  <span className={css.plus}>+</span>
                  <span className={css.tab}>tab</span>
                </div>
              </div>
              <div>
                {key.homelink && (
                  <a
                    href={key.homelink}
                    onClick={e => e.stopPropagation()}
                    className={cs('fa-home', css.kicon)}
                    aria-label='home'
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                )}
                {key.devdocs && (
                  <a
                    href={`https://devdocs.io/${key.devdocs}`}
                    onClick={e => e.stopPropagation()}
                    className={cs('fa-devdocs', css.kicon)}
                    aria-label='awesome'
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                )}
                {key.awesome && (
                  <a
                    href={`https://github.com/${key.awesome}`}
                    onClick={e => e.stopPropagation()}
                    className={cs('fa-cubes', css.kicon)}
                    aria-label='awesome'
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                )}
                <i
                  onClick={e => {
                    e.stopPropagation()
                    if (key.pin) {
                      removePin(key.code)
                    } else {
                      addPin(key.code)
                    }
                  }}
                  className={cs('fa-thumbtack', css.thumbtack, { [css.usage]: key.pin })}
                />
              </div>
            </div>
          )
        })
    },
    [language, changeKey, addPin, removePin]
  )

  useHotkeys(
    'tab',
    () => {
      const key = displayKeys
        ? keys.find(k => k.shortkeys === kquery)
        : keys.find(k => k.shortkeys === squery || k.shortkeys === dquery)
      if (key) {
        changeKey(key)
      } else if (displayKeys ? kquery.endsWith('`') : squery.endsWith('`') || dquery.endsWith('`')) {
        setDisplayKeys(!displayKeys)
      }
    },
    [keys, squery, kquery, dquery],
    [css.input]
  )

  return (
    <>
      <div className='container'>
        <Brand />
        <animated.div
          className={cs(css.searchWapper, { [css.focus]: focus })}
          style={{
            top: spring.wapperTop,
          }}>
          <div className={cs(css.searchInput)}>
            <span className={cs(css.prefix, { [css.displayKeys]: displayKeys })} onClick={() => setDisplayKeys(!displayKeys)}>
              {currentKey.name}
            </span>
            <span className={css.sep}>$</span>

            {(displayKeys ||
              currentKey.devdocs ||
              currentKey.template ||
              currentKey.readmes ||
              currentKey.code === 'github_stars' ||
              currentKey.code === 'socode' ||
              currentKey.code === 'tools' ||
              currentKey.code === 'cheatsheets') && (
              <input
                type='search'
                className={cs(css.input, 'with_suggeste')}
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
                placeholder={
                  displayKeys
                    ? 'filter...'
                    : currentKey.devdocs
                    ? 'menu search...'
                    : currentKey.readmes
                    ? currentKey.readmes.searched
                      ? 'content search...'
                      : 'no search...'
                    : ''
                }
                ref={inputEl} // https://stackoverflow.com/a/48656310/346701
                // onKeyPress={handleQueryKeyPress}
              />
            )}

            {!displayKeys && dsConfig && docsearchHack && (
              <div key={currentKey.code} className={cs(css.docsearch)}>
                <input
                  type='search'
                  placeholder='document search...'
                  className={cs(css.input)}
                  spellCheck={false}
                  autoFocus
                  value={dquery}
                  onChange={e => setDquery(e.target.value)}
                  id={`docsearch_${currentKey.code}`}
                />
              </div>
            )}

            {!displayKeys && currentKey.docsearch && currentKey.docsearch.length > 1 && (
              <div className='select is-rounded mgr10'>
                <select
                  value={docLanguage}
                  onChange={async e => {
                    setDocsearchHack(false)
                    setDocLanguage(e.target.value as Language)
                    setTimeout(() => setDocsearchHack(true), 0)
                  }}>
                  {currentKey.docsearch.map(d => (
                    <option key={d.lang} value={d.lang}>
                      {Object.keys(Language).filter(e => Language[e] === d.lang)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && currentKey.homelink && (
              <a
                href={currentKey.homelink}
                onClick={e => e.stopPropagation()}
                className={cs('fa-home', css.kicon)}
                aria-label='home'
                target='_blank'
                rel='noopener noreferrer'
              />
            )}
            {!displayKeys && currentKey.devdocs && (
              <a
                href={`https://devdocs.io/${currentKey.devdocs}`}
                onClick={e => e.stopPropagation()}
                className={cs('fa-devdocs', css.kicon)}
                aria-label='devdocs'
                target='_blank'
                rel='noopener noreferrer'
              />
            )}
            {!displayKeys && currentKey.awesome && (
              <a
                href={`https://github.com/${currentKey.awesome}`}
                onClick={e => e.stopPropagation()}
                className={cs('fa-cubes', css.kicon)}
                aria-label='awesome'
                target='_blank'
                rel='noopener noreferrer'
              />
            )}

            {result !== null && (
              <div className='select is-rounded mgl10'>
                {/* https://www.typescriptlang.org/docs/handbook/jsx.html#the-as-operator */}
                <select value={timeRange} onChange={e => setTimeRange(e.target.value as SearchTimeRange)}>
                  {timeRangeOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && currentKey.bylang && (
              <div className='select is-rounded mgl10'>
                <select value={searchLanguage} onChange={e => setSearchLanguage(e.target.value as Language)}>
                  {languageOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && currentKey.bypglang && (
              <div className='select is-rounded mgl10'>
                <select value={programLanguage} onChange={e => setProgramLanguage(parseInt(e.target.value, 10))}>
                  {programLanguageOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!displayKeys && !currentKey.docsearch && !currentKey.devdocs && (
              <i className={cs(css.sicon, 'fa-search')} onClick={() => search()} />
            )}
          </div>

          {focus &&
            !displayKeys &&
            suggeste !== null &&
            suggeste.words.length > 0 &&
            suggeste.key === currentKey.code &&
            !isAvoidKey(currentKey) && (
              <div className={cs(css.suggeste, 'dropdown is-active')} style={{ marginLeft: currentKey.name.length * 7 + 45 }}>
                <div className='dropdown-menu'>
                  <div className='dropdown-content'>
                    {suggeste &&
                      suggeste.words.map((s, i) => {
                        if (currentKey.code === 'github') {
                          return (
                            <div
                              key={`${s.owner}/${s.name}`}
                              onClick={() => suggesteClick(s.name, `https://github.com/${s.owner}/${s.name}`)}
                              className={cs('dropdown-item', css.sgitem, { [css.sgactive]: suggesteIndex === i })}>
                              <a>{`${s.owner}/${s.name}`}</a>
                              <span className={css.stars}>&#9733; {s.watchers}</span>
                              <p>{s.description}</p>
                            </div>
                          )
                        }
                        if (currentKey.code === 'npm') {
                          return (
                            <div
                              key={s.name}
                              onClick={() => suggesteClick(s.name, `https://www.npmjs.com/package/${s.name}`)}
                              className={cs('dropdown-item', css.sgitem, { [css.sgactive]: suggesteIndex === i })}>
                              <a dangerouslySetInnerHTML={{ __html: s.highlight || '' }} />
                              <span className={css.publisher}>{s.publisher}</span>
                              <span className={css.version}>{s.version}</span>
                              <p>{s.description}</p>
                            </div>
                          )
                        }
                        if (currentKey.code === 'bundlephobia') {
                          return (
                            <div
                              key={s.name}
                              onClick={() => suggesteClick(s.name, `https://bundlephobia.com/result?p=${s.name}`)}
                              className={cs('dropdown-item', css.sgitem, { [css.sgactive]: suggesteIndex === i })}>
                              <a dangerouslySetInnerHTML={{ __html: s.highlight || '' }} />
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
                            className={cs('dropdown-item', { 'is-active': suggesteIndex === i })}>
                            {s.name}
                          </a>
                        )
                      })}
                    {currentKey.code === 'github' && (
                      <>
                        <hr className='dropdown-divider' />
                        <a
                          href='https://github.algolia.com/'
                          target='_blank'
                          rel='noopener noreferrer'
                          className={cs(css.algolia)}>
                          powered by algolia for github
                        </a>
                      </>
                    )}
                    {currentKey.code === 'npm' && (
                      <>
                        <hr className='dropdown-divider' />
                        <a href='https://npms.io/' target='_blank' rel='noopener noreferrer' className={cs(css.npms)}>
                          powered by npms.io
                        </a>
                      </>
                    )}
                    {currentKey.code === 'bundlephobia' && (
                      <>
                        <hr className='dropdown-divider' />
                        <a
                          href='https://bundlephobia.com/'
                          target='_blank'
                          rel='noopener noreferrer'
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
            <div className='mgl10 mgb10 mgr10'>
              {pinKeys.length > 0 && (
                <div className={css.skgroup}>
                  {getKeysDom(pinKeys)}
                  <div className={css.kdesc}>PINNED</div>
                </div>
              )}
              {usageKeys.length > 0 && (
                <div className={cs(css.skgroup)}>
                  {getKeysDom(usageKeys)}
                </div>
              )}
              {(displayMore || kquery) && moreKeys.length > 0 && (
                <div className={cs(css.skgroup)}>
                  {getKeysDom(moreKeys)}
                </div>
              )}
              {!displayMore && !kquery && (
                <button type='button' className='button is-text w100' onClick={() => setDisplayMore(true)}>
                  More
                </button>
              )}
              {displayMore && (
                <button type='button' className='button is-text w100' onClick={() => setDisplayMore(false)}>
                  Less
                </button>
              )}
            </div>
          )}

          {!displayKeys && currentKey.code === 'cheatsheets' && <CheatSheets query={squery} />}
          {!displayKeys && currentKey.code === 'tools' && <Tools query={squery} />}
          {!displayKeys && currentKey.code === 'github_stars' && (
            <Suspense fallback={<Loader1 type={2} />}>
              <GithubStars query={squery} />
            </Suspense>
          )}
          {!displayKeys && displayAwesome && currentKey.awesome && !currentKey.devdocs && (
            <Awesome name={currentKey.shortkeys} awesome={currentKey.awesome} />
          )}
          {!displayKeys && currentKey.readmes && (
            <Readme
              base={currentKey.readmes.base}
              paths={currentKey.readmes.paths}
              query={currentKey.readmes.searched ? squery : undefined}
            />
          )}
          {!displayKeys && currentKey.devdocs && <Devdocs slug={currentKey.devdocs} query={squery} />}

          {error !== null && <div className={css.error}>{error instanceof String ? error : error.message}</div>}

          {result !== null && (
            <div className={css.searchResult}>
              {result.results.map(r => (
                <div key={r.url} className={css.result}>
                  <h4 className={css.header}>
                    <a href={r.url} target='_blank' rel='noopener noreferrer'>
                      {r.title}
                    </a>
                  </h4>
                  <p className={css.external}>{r.pretty_url}</p>
                  <Highlighter
                    className={css.content}
                    highlightClassName={css.highlighter}
                    searchWords={squery.split(' ')}
                    autoEscape
                    textToHighlight={r.content}
                  />
                </div>
              ))}

              <div className={cs(css.pagination, 'field has-addons')}>
                {pageno !== 1 && (
                  <p className='control'>
                    <button
                      type='button'
                      className='button is-rounded'
                      onClick={() => prevPage()}>
                      <span className='icon'>
                        <i className='fa-angle-left' />
                      </span>
                      <span>Previous Page</span>
                    </button>
                  </p>
                )}
                {result.paging && (
                  <p className='control'>
                    <button
                      type='button'
                      className='button is-rounded'
                      onClick={() => nextPage()}>
                      <span>Next Page</span>
                      <span className='icon'>
                        <i className='fa-angle-right' />
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
              {npmResult.results.map(r => (
                <div key={r.package.links.npm} className={css.result}>
                  <h4 className={css.header}>
                    <a href={r.package.links.npm} target='_blank' rel='noopener noreferrer'>
                      {r.package.name}
                    </a>
                  </h4>
                  <p className={css.content}>{r.package.description}</p>
                  <p className={css.infos}>
                    <a className='mgr10' href={r.package.links.repository} target='_blank' rel='noopener noreferrer'>
                      <Github className={css.github} />
                    </a>
                    <span className='mgr10'>{r.package.version}</span>
                    <span className='mgr10'>{r.package.publisher.username}</span>
                    <span>{dayjs(r.package.date).format('YYYY-M-D')}</span>
                  </p>
                </div>
              ))}

              <div className={cs(css.pagination, 'field has-addons')}>
                {pageno !== 1 && (
                  <p className='control'>
                    <button
                      type='button'
                      className='button is-rounded'
                      onClick={() => prevPage()}>
                      <span className='icon'>
                        <i className='fa-angle-left' />
                      </span>
                      <span>Previous Page</span>
                    </button>
                  </p>
                )}
                {npmResult.total > pageno * 10 && (
                  <p className='control'>
                    <button
                      type='button'
                      className='button is-rounded'
                      onClick={() => nextPage()}>
                      <span>Next Page</span>
                      <span className='icon'>
                        <i className='fa-angle-right' />
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
              <a className='delete is-medium' />
            </div>
          )}

          {result === null && currentKey.name === 'socode' && <Slogan />}
        </animated.div>
      </div>
    </>
  )
}

export default SearchInput

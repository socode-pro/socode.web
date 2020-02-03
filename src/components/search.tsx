import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import { Link } from 'react-router-dom'
import throttle from 'lodash/throttle'
import cs from 'classnames'
import Highlighter from 'react-highlight-words'
import Brand from './brand'
import CheatSheets from './cheatsheets'
import Language, { ProgramLanguage } from '../utils/language'
import useIntl, { Words } from '../utils/useIntl'
import useHotkeys from '../utils/useHotkeys'
import {
  SKey,
  SearchKeys,
  SearchKeysCN,
  PackageKeys,
  ToolKeys,
  DocKeys,
  GetKeyByName,
  GetKeyByShortkeys,
} from '../utils/skeys'
import { StringEnumObjects, IntEnumObjects, winSearchParams } from '../utils/assist'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { SearchTimeRange, SocodeResult } from '../services/socode.service'
import { StorageType } from '../models/storage'
import { SMError, SearchParam } from '../models/search'
import { Suggester, SuggestItem } from '../services/suggest.service'
import css from './search.module.scss'
import Loader1 from './loader/loader1'

const languageOptions = StringEnumObjects(Language)
const programLanguageOptions = IntEnumObjects(ProgramLanguage)
const timeRangeOptions = StringEnumObjects(SearchTimeRange)

const SearchInput: React.FC = (): JSX.Element => {
  const [displaySubtitle, setDisplaySubtitle] = useState(false)
  const [displayTips, setDisplayTips] = useState(false)

  const [focus, setFocus] = useState(false)
  const [squery, setSquery] = useState('')
  const [timeRange, setTimeRange] = useState<SearchTimeRange>(SearchTimeRange.Anytime)
  const [pageno, setPageno] = useState(1)
  const [suggeste, setSuggeste] = useState<Array<SuggestItem>>([])
  const [suggesteIndex, setSuggesteIndex] = useState(-1)
  const inputEl = useRef<HTMLInputElement & { onsearch: (e: InputEvent) => void }>(null)

  const slogon = useIntl(Words.ASearchEngineForProgrammers)
  const privacyPolicy = useIntl(Words.PrivacyPolicy)

  const searchAction = useStoreActions(actions => actions.search.search)
  const setResultAction = useStoreActions(actions => actions.search.setResult)
  const lunchUrlAction = useStoreActions(actions => actions.search.lunchUrl)
  const result = useStoreState<SocodeResult | null>(state => state.search.result)
  const loading = useStoreState<boolean>(state => state.search.loading)
  const error = useStoreState<SMError | null>(state => state.search.error)

  const setStorage = useStoreActions(actions => actions.storage.setStorage)
  const { language, searchLanguage } = useStoreState<StorageType>(state => state.storage.values)
  const [porogramLanguage, setPorogramLanguage] = useState(ProgramLanguage.All)

  const [displayKeys, setDisplayKeys] = useState(false)
  const [currentKey, setCurrentKey] = useState<SKey>(
    language === Language.中文 ? SearchKeysCN.socode : SearchKeys.github
  )

  const { wapperTop } = useSpring({
    wapperTop: result?.results.length ? -5 : displaySubtitle ? 150 : 130,
  })

  const searchSubmit = useCallback(
    async (q?: string) => {
      let query: string | null = null
      let skey = currentKey
      if (q !== undefined) {
        query = q
        setSquery(q)
      } else if (squery) {
        query = squery
      } else {
        const searchParams = new URLSearchParams(window.location.search)
        if (searchParams.has('q')) {
          query = searchParams.get('q') || ''
          setSquery(query)
        }
        if (searchParams.has('k')) {
          const key = GetKeyByName(searchParams.get('k') || '')
          if (key) {
            skey = key
            setCurrentKey(key)
          }
        }
      }

      if (!query) {
        setResultAction(null)
        return
      }
      const param = { query, searchLanguage, porogramLanguage, timeRange, pageno } as SearchParam
      await searchAction({ ...param, ...skey })
    },
    [currentKey, squery, searchLanguage, porogramLanguage, timeRange, pageno, searchAction, setResultAction]
  )

  const throttleSuggeste = useCallback(
    throttle<(value: any) => Promise<void>>(async value => {
      setSuggesteIndex(-1)
      if (value) {
        const words = await Suggester(value, currentKey.name)
        setSuggeste(words)
      } else {
        setSuggeste([])
      }
    }, 500),
    [currentKey]
  )

  const handleQueryChange = useCallback(
    e => {
      setSquery(e.target.value)
      throttleSuggeste(e.target.value)
    },
    [throttleSuggeste]
  )

  // const handleQueryKeyPress = useCallback((e) => {
  //   if (e.key === 'Enter') {
  //   }
  // }, [searchSubmit])

  const closeResult = useCallback(() => {
    setSuggesteIndex(-1)
    setSuggeste([])
    setPageno(1)
    searchSubmit('')
    winSearchParams('', currentKey.name)
  }, [currentKey.name, searchSubmit])

  const handlerSearch = useCallback(
    e => {
      setSuggesteIndex(-1)
      setSuggeste([])
      setPageno(1)
      searchSubmit(e.target?.value)
      winSearchParams(e.target?.value, currentKey.name)
      e.target?.blur()
    },
    [currentKey.name, searchSubmit]
  )

  if (inputEl.current !== null) inputEl.current.onsearch = handlerSearch

  useHotkeys(
    '`',
    () => {
      if (inputEl.current !== document.activeElement) {
        setDisplayKeys(!displayKeys)
      }
    },
    [displayKeys],
    ['BODY']
  )

  useHotkeys(
    '/',
    () => {
      inputEl.current?.focus()
      return false
    },
    [],
    ['BODY']
  )

  useHotkeys(
    'down',
    () => {
      if (suggeste.length > suggesteIndex + 1) setSuggesteIndex(suggesteIndex + 1)
    },
    [suggesteIndex, suggeste],
    [css.input]
  )

  useHotkeys(
    'up',
    () => {
      if (suggesteIndex >= 0) setSuggesteIndex(suggesteIndex - 1)
    },
    [suggesteIndex],
    [css.input]
  )

  const suggesteClick = useCallback(
    (a, url?: string) => {
      setSuggesteIndex(-1)
      setSuggeste([])
      setPageno(1)

      if (url) {
        lunchUrlAction({ url, ...currentKey })
      } else {
        searchSubmit(a)
        winSearchParams(a, currentKey.name)
      }
    },
    [currentKey, lunchUrlAction, searchSubmit]
  )

  useEffect(() => {
    if (suggesteIndex >= 0 && suggeste.length > 0) setSquery(suggeste[suggesteIndex].name) // warn: acIndex must '-1' when autocomplate arr init
  }, [suggesteIndex, suggeste])

  useEffect(() => {
    searchSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageno])

  useEffect(() => {
    if (result !== null) {
      setPageno(1)
      searchSubmit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchLanguage, timeRange])

  useEffect(() => {
    const popstateSearch = (): void => {
      searchSubmit()
    }
    window.addEventListener('popstate', popstateSearch)
    return () => {
      window.removeEventListener('popstate', popstateSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getKeysDom = useCallback(
    (Keys: { [key: string]: SKey }) => {
      return Object.entries(Keys).map(([key, value]) => {
        let styles = { backgroundImage: `url(/keys/${value.icon})` } as object
        if (value.backgroundSize) {
          styles = { ...styles, backgroundSize: value.backgroundSize }
        }
        if (value.width) {
          styles = { ...styles, width: value.width }
        }
        return (
          <div
            key={key}
            className={css.skey}
            onClick={() => {
              setCurrentKey(value)
              setDisplayKeys(false)
              winSearchParams('', value.name)

              setSuggesteIndex(-1)
              setSuggeste([])
              setPageno(1)
              setResultAction(null)

              inputEl.current?.focus()
            }}>
            <div className={cs(css.skname)} style={styles}>
              {value.hideName ? <>&nbsp;</> : value.name}
            </div>
            <div className={css.shortkeys}>{value.shortkeys} +</div>
          </div>
        )
      })
    },
    [setResultAction]
  )

  useHotkeys(
    'tab',
    () => {
      const key = GetKeyByShortkeys(squery)
      if (key) {
        setSquery('')
        setCurrentKey(key)
        setDisplayKeys(false)
        winSearchParams('', key.name)

        setSuggesteIndex(-1)
        setSuggeste([])
        setPageno(1)
        setResultAction(null)

        setTimeout(() => inputEl.current?.focus(), 0) // tab have to blur
        setTimeout(() => setFocus(true), 200) // wait input onBlur
      }
    },
    [squery],
    [css.input]
  )

  return (
    <>
      <div className='container'>
        <Brand onDisplaySubtitle={setDisplaySubtitle} />
        <animated.div
          className={cs(css.searchWapper, { [css.focus]: focus })}
          style={{
            top: wapperTop,
          }}>
          <div className={css.searchInput}>
            <span className={css.prefix} onClick={() => setDisplayKeys(!displayKeys)}>
              {currentKey.name}
            </span>
            <span className={css.sep}>$</span>

            <input
              type='search'
              className={css.input}
              spellCheck={false}
              value={squery}
              autoFocus
              // name="q"
              onBlur={() => {
                setTimeout(() => setFocus(false), 100) // fix autocomplateClick
              }}
              onFocus={() => {
                setFocus(true)
              }}
              onChange={handleQueryChange}
              ref={inputEl} // https://stackoverflow.com/a/48656310/346701
              // onKeyPress={handleQueryKeyPress}
            />

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

            {currentKey.bylang && (
              <div className='select is-rounded mgl10'>
                <select
                  value={searchLanguage}
                  onChange={e => setStorage({ searchLanguage: e.target.value as Language })}>
                  {languageOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentKey.bypglang && (
              <div className='select is-rounded mgl10'>
                <select value={porogramLanguage} onChange={e => setPorogramLanguage(parseInt(e.target.value, 10))}>
                  {programLanguageOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <i className={css.sicon} onClick={() => searchSubmit()} />
          </div>

          <div
            className={cs(css.suggeste, 'dropdown', {
              'is-active': suggeste.length && focus && currentKey.name !== 'CheatSheets',
            })}
            style={{ marginLeft: currentKey.name.length * 7 + 45 }}>
            <div className='dropdown-menu'>
              <div className='dropdown-content'>
                {suggeste.map((s, i) => {
                  if (currentKey.name === 'Github') {
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
                  return (
                    <a
                      key={s.name}
                      onClick={() => suggesteClick(s.name)}
                      className={cs('dropdown-item', { 'is-active': suggesteIndex === i })}>
                      {s.name}
                    </a>
                  )
                })}
                {currentKey.name === 'Github' && (
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
              </div>
            </div>
          </div>

          {displayKeys && (
            <div className={css.skeys}>
              <div className={css.skgroup}>{getKeysDom(language === Language.中文 ? SearchKeysCN : SearchKeys)}</div>
              <div className={css.skgroup}>{getKeysDom(ToolKeys)}</div>
              <div className={css.skgroup}>{getKeysDom(PackageKeys)}</div>
              <div className={css.skgroup}>{getKeysDom(DocKeys)}</div>
            </div>
          )}

          {!displayKeys && currentKey.name === 'CheatSheets' && <CheatSheets query={squery} />}

          {loading && <Loader1 type={2} />}

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

              {result.paging && (
                <div className={cs(css.pagination, 'field has-addons')}>
                  {pageno !== 1 && (
                    <p className='control'>
                      <button
                        type='button'
                        className='button is-rounded'
                        onClick={() => {
                          setPageno(pageno - 1)
                          window.scrollTo({ top: 0 })
                        }}>
                        <span className='icon'>
                          <i className={css.pagePrevious} />
                        </span>
                        <span>Previous Page</span>
                      </button>
                    </p>
                  )}
                  <p className='control'>
                    <button
                      type='button'
                      className='button is-rounded'
                      onClick={() => {
                        setPageno(pageno + 1)
                        window.scrollTo({ top: 0 })
                      }}>
                      <span>Next Page</span>
                      <span className='icon'>
                        <i className={css.pageNext} />
                      </span>
                    </button>
                  </p>
                </div>
              )}

              {result.results.length === 0 && <div className={css.notFound} />}
            </div>
          )}

          {result !== null && (
            <div className={css.closer} onClick={closeResult}>
              <a className='delete is-medium' />
            </div>
          )}

          {result === null && currentKey.name === 'socode' && (
            <div className={css.slogan}>
              <span className={cs({ [css.zh]: language === Language.中文 })}>{slogon}</span>
              <div className={cs('dropdown is-right', css.scdropdown, { 'is-active': displayTips })}>
                <i className={css.scicon} onClick={() => setDisplayTips(!displayTips)} />
                <div className='dropdown-menu' style={{ width: 300 }}>
                  <div className='dropdown-content'>
                    <div className='dropdown-item'>
                      {language !== Language.中文 ? (
                        <p>
                          socode.pro is a privacy-respecting, hackable google search by{' '}
                          <a href='https://github.com/asciimoo/searx' target='_blank' rel='noopener noreferrer'>
                            searx
                          </a>
                          . convenient for users who do not have access to google.com (such as Chinese users).
                        </p>
                      ) : (
                        <p>
                          socode.pro 是一个使用
                          <a href='https://github.com/asciimoo/searx' target='_blank' rel='noopener noreferrer'>
                            searx
                          </a>
                          构建的google搜索代理，限定了搜索范围。仅用于给无法访问google.com的用户方便地搜索编程问答信息，请不要用于其它需求场合。
                        </p>
                      )}
                    </div>
                    <hr className='dropdown-divider' />
                    <Link to='/Privacy' className={cs(css.navlink, css.privacy, 'dropdown-item')}>
                      <h3>{privacyPolicy}</h3>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </animated.div>
      </div>
      <div
        className={cs('mask', { 'dis-none': !displayKeys && !displayTips })}
        onClick={() => {
          setDisplayKeys(false)
          setDisplayTips(false)
        }}
      />
    </>
  )
}

export default SearchInput

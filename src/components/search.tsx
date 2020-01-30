import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import { Link } from 'react-router-dom'
import throttle from 'lodash/throttle'
import cs from 'classnames'
import Highlighter from 'react-highlight-words'
import Brand from './brand'
import Language from '../utils/language'
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
import { EnumObjects, winSearchParams } from '../utils/assist'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { SocodeParam, SearchTimeRange, Autocompleter, SocodeResult } from '../services/socode.service'
import { StorageType } from '../models/storage'
import { SError } from '../models/search'
import css from './search.module.scss'
import Loader1 from './loader/loader1'

const languageOptions = EnumObjects(Language)
const timeRangeOptions = EnumObjects(SearchTimeRange)

const SearchInput: React.FC = (): JSX.Element => {
  const [displaySubtitle, setDisplaySubtitle] = useState(false)
  const [displayTips, setDisplayTips] = useState(false)

  const [focus, setFocus] = useState(false)
  const [squery, setSquery] = useState('')
  const [timeRange, setTimeRange] = useState<SearchTimeRange>(SearchTimeRange.Anytime)
  const [pageno, setPageno] = useState(1)
  const [autocomplate, setAutocomplate] = useState<Array<string>>([])
  const [acIndex, setAcIndex] = useState(-1)
  const [acDisplay, setAcDisplay] = useState(false)
  const inputEl = useRef<HTMLInputElement & { onsearch: (e: InputEvent) => void }>(null)

  const slogon = useIntl(Words.ASearchEngineForProgrammers)
  const privacyPolicy = useIntl(Words.PrivacyPolicy)

  const searchAction = useStoreActions(actions => actions.search.search)
  const setResultAction = useStoreActions(actions => actions.search.setResult)
  const result = useStoreState<SocodeResult | null>(state => state.search.result)
  const loading = useStoreState<boolean>(state => state.search.loading)
  const error = useStoreState<SError | null>(state => state.search.error)

  const setStorage = useStoreActions(actions => actions.storage.setStorage)
  const { language, searchLanguage } = useStoreState<StorageType>(state => state.storage.values)

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
      const param = { query, language: searchLanguage, timeRange, pageno } as SocodeParam
      await searchAction({ ...param, ...skey })
    },
    [squery, searchLanguage, timeRange, pageno, searchAction, currentKey, setResultAction]
  )

  const throttleAutocomplate = useCallback(
    throttle<(value: any) => Promise<void>>(async value => {
      setAcIndex(-1)
      if (value) {
        const words = await Autocompleter(value)
        setAutocomplate(words)
      } else {
        setAutocomplate([])
      }
    }, 500),
    []
  )

  const handleQueryChange = useCallback(
    e => {
      setSquery(e.target.value)
      throttleAutocomplate(e.target.value)
    },
    [throttleAutocomplate]
  )

  // const handleQueryKeyPress = useCallback((e) => {
  //   if (e.key === 'Enter') {
  //   }
  // }, [searchSubmit])

  const closeResult = useCallback(() => {
    setAcIndex(-1)
    setAutocomplate([])
    setPageno(1)
    searchSubmit('')
    winSearchParams('', currentKey.name)
  }, [currentKey.name, searchSubmit])

  const handlerSearch = useCallback(
    e => {
      setAcIndex(-1)
      setAutocomplate([])
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
      if (autocomplate.length > acIndex + 1) setAcIndex(acIndex + 1)
    },
    [acIndex, autocomplate],
    [css.input]
  )

  useHotkeys(
    'up',
    () => {
      if (acIndex >= 0) setAcIndex(acIndex - 1)
    },
    [acIndex],
    [css.input]
  )

  const autocomplateClick = useCallback(
    a => {
      setAcIndex(-1)
      setAutocomplate([])
      setPageno(1)
      searchSubmit(a)
      winSearchParams(a, currentKey.name)
    },
    [currentKey.name, searchSubmit]
  )

  useEffect(() => {
    if (acIndex >= 0 && autocomplate.length > 0) setSquery(autocomplate[acIndex]) // warn: acIndex must '-1' when autocomplate arr init
  }, [acIndex, autocomplate])

  useEffect(() => {
    searchSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageno])

  useEffect(() => {
    setPageno(1)
    searchSubmit()
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

  const getKeysDom = useCallback((Keys: { [key: string]: SKey }) => {
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
            inputEl.current?.focus()
          }}>
          <div className={cs(css.skname)} style={styles}>
            {value.hideName ? <>&nbsp;</> : value.name}
          </div>
          <div className={css.shortkeys}>{value.shortkeys} +</div>
        </div>
      )
    })
  }, [])

  useHotkeys(
    'tab',
    () => {
      const key = GetKeyByShortkeys(squery)
      if (key) {
        setSquery('')
        setCurrentKey(key)
        setAcIndex(-1)
        setAutocomplate([])
        setTimeout(() => inputEl.current?.focus(), 0)
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
                setFocus(false)
                setTimeout(() => setAcDisplay(false), 500)
              }} // fix autocomplateClick
              onFocus={() => {
                setFocus(true)
                setAcDisplay(true)
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

            <i className={css.sicon} onClick={() => searchSubmit()} />
          </div>

          <div className={cs(css.autocomplate, 'dropdown', { 'is-active': autocomplate.length && acDisplay })}>
            <div className='dropdown-menu'>
              <div className='dropdown-content'>
                {autocomplate.map((a, i) => {
                  return (
                    <a
                      key={a}
                      onClick={() => autocomplateClick(a)}
                      className={cs('dropdown-item', { 'is-active': acIndex === i })}>
                      {a}
                    </a>
                  )
                })}
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

          {result === null && currentKey.name === 'socode.pro' && (
            <div className={cs(css.slogan, { [css.zh]: language === Language.中文 })}>
              {slogon}
              <div className={cs('dropdown is-right', css.scdropdown, { 'is-active': displayTips })}>
                <i className={css.scicon} onClick={() => setDisplayTips(!displayTips)}></i>
                <div className='dropdown-menu' style={{ width: 300 }}>
                  <div className='dropdown-content'>
                    <div className='dropdown-item'>
                      {language !== Language.中文 ? (
                        <p>
                          socode.pro is a privacy-respecting, hackable google search by{' '}
                          <a href='https://github.com/asciimoo/searx' target='_blank'>
                            searx
                          </a>
                          . convenient for users who do not have access to google.com (such as Chinese users).
                        </p>
                      ) : (
                        <p>
                          socode.pro 只是一个使用
                          <a href='https://github.com/asciimoo/searx' target='_blank'>
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
        className={cs('mask', { 'dis-none': displayKeys && displayTips })}
        onClick={() => {
          setDisplayKeys(false)
          setDisplayTips(false)
        }}
      />
    </>
  )
}

export default SearchInput

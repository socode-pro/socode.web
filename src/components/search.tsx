import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import Fuse from 'fuse.js'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import without from 'lodash/without'
import docsearch from 'docsearch.js'
import cs from 'classnames'
import Highlighter from 'react-highlight-words'
import Brand from './brand'
import CheatSheets from './cheatsheets'
import Awesome from './awesome'
import Devdocs from './devdocs'
import Slogan from './slogan'
import Language, { ProgramLanguage } from '../utils/language'
import useHotkeys from '../utils/useHotkeys'
import { SKey, Keys, IsDocsearchKeys, IsDevdocsKeys, IsAvoidKeys } from '../utils/skeys'
import { StringEnumObjects, IntEnumObjects, winSearchParams } from '../utils/assist'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { SearchTimeRange, SearchParam, SocodeResult } from '../services/socode.service'
import { StorageType } from '../models/storage'
import { SMError } from '../models/search'
import { Suggester, SuggestItem } from '../services/suggest.service'
import css from './search.module.scss'
import Loader1 from './loader/loader1'

const fuseOptions: Fuse.FuseOptions<SKey> = {
  keys: ['name'],
  threshold: 0.3,
  maxPatternLength: 8,
}

const languageOptions = StringEnumObjects(Language)
const programLanguageOptions = IntEnumObjects(ProgramLanguage)
const timeRangeOptions = StringEnumObjects(SearchTimeRange)

const SearchInput: React.FC = (): JSX.Element => {
  const [displaySubtitle, setDisplaySubtitle] = useState(false)
  const [isFloat, setIsFloat] = useState(false)
  const inputEl = useRef<HTMLInputElement & { onsearch: (e: InputEvent) => void }>(null)

  const [focus, setFocus] = useState(true)
  const [squery, setSquery] = useState('')
  const [kquery, setKquery] = useState('')
  const [pageno, setPageno] = useState(1)
  const [timeRange, setTimeRange] = useState<SearchTimeRange>(SearchTimeRange.Anytime)
  const [suggeste, setSuggeste] = useState<{ words: Array<SuggestItem>; key: string } | null>(null)
  const [suggesteIndex, setSuggesteIndex] = useState(-1)
  const [porogramLanguage, setPorogramLanguage] = useState(ProgramLanguage.All)
  const [displayKeys, setDisplayKeys] = useState(false)

  const result = useStoreState<SocodeResult | null>(state => state.search.result)
  const searchAction = useStoreActions(actions => actions.search.search)
  const setResultAction = useStoreActions(actions => actions.search.setResult)
  const lunchUrlAction = useStoreActions(actions => actions.search.lunchUrl)
  const loading = useStoreState<boolean>(state => state.search.loading)
  const error = useStoreState<SMError | null>(state => state.search.error)
  const setStorage = useStoreActions(actions => actions.storage.setStorage)
  const { language, searchLanguage, pinKeys, displayAwesome, displayMoreKeys } = useStoreState<StorageType>(
    state => state.storage.values
  )

  let keys = Keys
  if (displayKeys && kquery) {
    const fuse = new Fuse(keys, fuseOptions)
    keys = fuse.search<SKey, false, false>(kquery)
  }

  keys.forEach(k => {
    k.pin = pinKeys?.includes(k.code)
  })

  const PinKeys = keys.filter(k => k.pin)
  const UsageKeys = keys.filter(k => !k.pin && k.usage)
  const MoreKeys = keys.filter(k => !k.pin && !k.usage)
  const DocsearchKeys = keys.filter(k => k.docsearch)

  const initKey =
    language === Language.中文_简体 ? keys.find(k => k.code === 'github') : keys.find(k => k.code === 'socode')
  const [currentKey, setCurrentKey] = useState<SKey>(initKey || keys[0])

  const useWapperTop = result?.results.length // || currentKey.code === 'cheatSheets'
  const { wapperTop } = useSpring({
    wapperTop: useWapperTop ? -5 : displaySubtitle ? 150 : 130,
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
          const key = Keys.find(k => k.code === searchParams.get('k'))
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

  const debounceSuggeste = useCallback(
    debounce<(value: any) => Promise<void>>(async value => {
      setSuggesteIndex(-1)
      if (value) {
        const words = await Suggester(value, currentKey.code)
        setSuggeste({ words, key: currentKey.code })
      } else {
        setSuggeste(null)
      }
    }, 500),
    [currentKey]
  )

  const handleQueryChange = useCallback(
    e => {
      if (displayKeys) {
        setKquery(e.target.value)
      } else {
        debounceSuggeste?.cancel()
        setSquery(e.target.value)
        debounceSuggeste(e.target.value)
      }
    },
    [debounceSuggeste, displayKeys]
  )

  // const handleQueryKeyPress = useCallback((e) => {
  //   if (e.key === 'Enter') {
  //   }
  // }, [searchSubmit])

  const closeResult = useCallback(() => {
    setSuggesteIndex(-1)
    setSuggeste(null)
    setPageno(1)
    searchSubmit('')
    winSearchParams({ keyname: currentKey.code, query: '' })
  }, [currentKey.code, searchSubmit])

  const handlerSearch = useCallback(
    e => {
      setSuggesteIndex(-1)
      setSuggeste(null)
      setPageno(1)
      searchSubmit(e.target?.value)
      winSearchParams({ keyname: currentKey.code, query: e.target?.value })
      e.target?.blur()
    },
    [currentKey.code, searchSubmit]
  )

  if (inputEl.current !== null) inputEl.current.onsearch = handlerSearch

  useHotkeys(
    '`',
    () => {
      if (document.activeElement?.tagName !== 'INPUT') {
        setDisplayKeys(!displayKeys)
      }
    },
    [displayKeys],
    ['BODY']
  )

  useHotkeys(
    '/',
    () => {
      if (IsDocsearchKeys(currentKey.code)) {
        document?.getElementById(`docsearch_${currentKey.code}`)?.focus()
      } else {
        inputEl.current?.focus()
      }
      return false
    },
    [currentKey],
    ['BODY']
  )

  useHotkeys(
    'down',
    () => {
      if (suggeste && suggeste.words.length > suggesteIndex + 1) setSuggesteIndex(suggesteIndex + 1)
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
      setSuggeste(null)
      setPageno(1)

      if (url) {
        lunchUrlAction({ url, ...currentKey })
      } else {
        searchSubmit(a)
        winSearchParams({ keyname: currentKey.code, query: a })
      }
    },
    [currentKey, lunchUrlAction, searchSubmit]
  )

  useEffect(() => {
    if (suggesteIndex >= 0 && suggeste && suggeste?.words.length > 0) setSquery(suggeste.words[suggesteIndex].name) // warn: acIndex must '-1' when autocomplate arr init
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

  useEffect(() => {
    const throttleFloat = throttle<() => void>(() => {
      // brand height 112
      if (document.body.scrollTop > 112) {
        setIsFloat(true)
      } else {
        setIsFloat(false)
      }
    }, 50)

    document.body.addEventListener('scroll', throttleFloat, false)
    return () => {
      document.body.removeEventListener('scroll', throttleFloat)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    for (const key of DocsearchKeys) {
      docsearch({
        appId: key.docsearch?.appId,
        apiKey: key.docsearch?.apiKey,
        indexName: key.docsearch?.indexName,
        inputSelector: `#docsearch_${key.code}`,
        algoliaOptions: key.docsearch?.algoliaOptions,
        handleSelected: (input, event, suggestion) => {
          window.open(suggestion.url, '_blank')?.focus()
        },
        autocompleteOptions: {
          tabAutocomplete: false,
        },
        debug: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          return (
            <div
              key={key.code}
              className={css.skeybox}
              onClick={() => {
                setCurrentKey(key)
                setDisplayKeys(false)
                winSearchParams({ keyname: key.code, query: '' })

                setSuggesteIndex(-1)
                setSuggeste(null)
                setPageno(1)
                setResultAction(null)

                if (IsDocsearchKeys(key.code)) {
                  setTimeout(() => {
                    document?.getElementById(`docsearch_${key.code}`)?.focus()
                  }, 200)
                } else {
                  inputEl.current?.focus()
                }
              }}>
              <div className={css.skey}>
                <div className={cs(css.skname)} style={styles}>
                  {key.hideName ? <>&nbsp;</> : key.name}
                </div>
                <div className={css.shortkeys}>
                  {key.shortkeys} <span>+</span>
                </div>
              </div>
              <div>
                {key.homelink && (
                  <a
                    href={key.homelink}
                    onClick={e => e.stopPropagation()}
                    className={cs('fa-home', css.home)}
                    aria-label='home'
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                )}
                {key.awesome && (
                  <a
                    href={`https://github.com/${key.awesome}`}
                    onClick={e => e.stopPropagation()}
                    className={cs('fa-cubes', css.awesome)}
                    aria-label='awesome'
                    target='_blank'
                    rel='noopener noreferrer'
                  />
                )}
                <i
                  onClick={e => {
                    e.stopPropagation()
                    if (key.pin) {
                      setStorage({ pinKeys: without(pinKeys, key.code) })
                    } else {
                      setStorage({ pinKeys: pinKeys ? [key.code, ...pinKeys] : [key.code] })
                    }
                  }}
                  className={cs('fa-thumbtack', css.thumbtack, { [css.usage]: key.pin })}
                />
              </div>
            </div>
          )
        })
    },
    [language, setResultAction, setStorage, pinKeys]
  )

  useHotkeys(
    'tab',
    () => {
      const key = Keys.find(k => k.shortkeys === squery)
      if (key) {
        setSquery('')
        setCurrentKey(key)
        setDisplayKeys(false)
        winSearchParams({ keyname: key.code, query: '' })

        setSuggesteIndex(-1)
        setSuggeste(null)
        setPageno(1)
        setResultAction(null)

        if (IsDocsearchKeys(key.code)) {
          setTimeout(() => {
            document?.getElementById(`docsearch_${key.code}`)?.focus()
          }, 200)
        } else {
          setTimeout(() => inputEl.current?.focus(), 0) // tab have to blur
          setTimeout(() => setFocus(true), 200) // wait input onBlur
        }
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
          className={cs(css.searchWapper, { [css.focus]: focus, [css.hasfloat]: isFloat })}
          style={{
            top: wapperTop,
          }}>
          <div className={cs(css.searchInput, 'container', { [css.float]: isFloat })}>
            <span
              className={cs(css.prefix, { [css.displayKeys]: displayKeys })}
              onClick={() => setDisplayKeys(!displayKeys)}>
              {currentKey.name}
            </span>
            <span className={css.sep}>$</span>

            <input
              type='search'
              className={cs(css.input, { 'dis-none': IsDocsearchKeys(currentKey.code) && !displayKeys })}
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
              placeholder={displayKeys ? 'filter...' : ''}
              ref={inputEl} // https://stackoverflow.com/a/48656310/346701
              // onKeyPress={handleQueryKeyPress}
            />

            {DocsearchKeys.map(key => {
              return (
                <div
                  key={key.code}
                  className={cs(css.docsearch, { 'dis-none': currentKey.code !== key.code || displayKeys })}>
                  <input
                    type='search'
                    className={cs(css.input)}
                    spellCheck={false}
                    value={squery}
                    autoFocus
                    onChange={handleQueryChange}
                    id={`docsearch_${key.code}`}
                  />
                </div>
              )
            })}

            {!displayKeys && currentKey.homelink && (
              <a
                href={currentKey.homelink}
                onClick={e => e.stopPropagation()}
                className={cs('fa-home', css.home)}
                aria-label='home'
                target='_blank'
                rel='noopener noreferrer'
              />
            )}
            {!displayKeys && currentKey.awesome && (
              <a
                href={`https://github.com/${currentKey.awesome}`}
                onClick={e => e.stopPropagation()}
                className={cs('fa-cubes', css.awesome)}
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

            {!displayKeys && currentKey.bypglang && (
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

            {!displayKeys && !IsDocsearchKeys(currentKey.code) && !IsDevdocsKeys(currentKey.code) && (
              <i className={cs(css.sicon, 'fa-search')} onClick={() => searchSubmit()} />
            )}
          </div>

          {focus &&
            suggeste !== null &&
            suggeste.words.length > 0 &&
            suggeste.key === currentKey.code &&
            !IsAvoidKeys(currentKey.code) && (
              <div
                className={cs(css.suggeste, 'dropdown is-active')}
                style={{ marginLeft: currentKey.name.length * 7 + 45 }}>
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
              <div className={css.skgroup}>{getKeysDom(PinKeys)}</div>
              <div className={cs(css.skgroup)}>
                <div className={css.kdesc}>USAGING</div>
                {getKeysDom(UsageKeys)}
              </div>
              {displayMoreKeys && (
                <div className={cs(css.skgroup)}>
                  <div className={css.kdesc}>MORE</div>
                  {getKeysDom(MoreKeys)}
                </div>
              )}
              {!displayMoreKeys && (
                <button
                  type='button'
                  className='button is-text w100'
                  onClick={() => setStorage({ displayMoreKeys: true })}>
                  More
                </button>
              )}
              {displayMoreKeys && (
                <button
                  type='button'
                  className='button is-text w100'
                  onClick={() => setStorage({ displayMoreKeys: false })}>
                  Less
                </button>
              )}
            </div>
          )}

          {!displayKeys && currentKey.code === 'cheatsheets' && <CheatSheets query={squery} />}
          {!displayKeys && displayAwesome && currentKey.awesome && (
            <Awesome name={currentKey.shortkeys} awesome={currentKey.awesome} />
          )}
          {!displayKeys && currentKey.devdocs && <Devdocs slug={currentKey.devdocs} query={squery} />}

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
                          <i className='fa-angle-left' />
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
                        <i className='fa-angle-right' />
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

          {result === null && currentKey.name === 'socode' && <Slogan />}
        </animated.div>
      </div>
      <div
        className={cs('mask', { 'dis-none': !displayKeys })}
        onClick={() => {
          setDisplayKeys(false)
        }}
      />
    </>
  )
}

export default SearchInput

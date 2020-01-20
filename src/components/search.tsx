import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useSpring, animated } from 'react-spring'
import throttle from 'lodash/throttle'
import { AxiosError } from 'axios'
import cs from 'classnames'
import Highlighter from 'react-highlight-words'
import Brand from './brand'
import Language from '../utils/language'
import useIntl, { Words } from '../utils/useIntl'
import useHotkeys from '../utils/useHotkeys'
import { EnumObjects, winSearchParams } from '../utils/assist'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { SearchParam, SearchTimeRange, Autocompleter, SearchResult } from '../services/search.service'
import { StorageType } from '../models/storage'
import css from './search.module.scss'
import Loader1 from './loader/loader1'

const languageOptions = EnumObjects(Language)
const timeRangeOptions = EnumObjects(SearchTimeRange)

const SearchInput: React.FC = (): JSX.Element => {
  const [displaySubtitle, setDisplaySubtitle] = useState(false)
  const [focus, setFocus] = useState(false)
  const [squery, setSquery] = useState('')
  const [timeRange, setTimeRange] = useState<SearchTimeRange>(SearchTimeRange.Anytime)
  const [pageno, setPageno] = useState(1)
  const [autocomplate, setAutocomplate] = useState<Array<string>>([])
  const [acIndex, setAcIndex] = useState(-1)
  const [acDisplay, setAcDisplay] = useState(false)
  const inputEl = useRef<HTMLInputElement & { onsearch: (e: InputEvent) => void }>(null)
  const slogon = useIntl(Words.ASearchEngineForProgrammers)

  const searchAction = useStoreActions(actions => actions.search.search)
  const setResultAction = useStoreActions(actions => actions.search.setResult)
  const result = useStoreState<SearchResult | null>(state => state.search.result)
  const loading = useStoreState<boolean>(state => state.search.loading)
  const error = useStoreState<AxiosError | null>(state => state.search.error)

  const setStorage = useStoreActions(actions => actions.storage.setStorage)
  const { language } = useStoreState<StorageType>(state => state.storage.values)

  const { wapperTop } = useSpring({
    wapperTop: result?.results.length ? -5 : displaySubtitle ? 150 : 130,
  })

  const searchSubmit = useCallback(
    async (q?: string) => {
      let query: string | null = null
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
      }

      if (!query) {
        setResultAction(null)
        return
      }
      const param = { query, language, timeRange, pageno } as SearchParam
      await searchAction(param)
    },
    [language, timeRange, pageno, searchAction, squery, setResultAction]
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
    winSearchParams('')
  }, [searchSubmit])

  const handlerSearch = useCallback(
    e => {
      setAcIndex(-1)
      setAutocomplate([])
      setPageno(1)
      searchSubmit(e.target?.value)
      winSearchParams(e.target?.value)
      e.target?.blur()
    },
    [searchSubmit]
  )

  if (inputEl.current !== null) inputEl.current.onsearch = handlerSearch

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
      winSearchParams(a)
    },
    [searchSubmit]
  )

  useEffect(() => {
    if (acIndex >= 0 && autocomplate.length > 0) setSquery(autocomplate[acIndex]) // warn: acIndex must '-1' when autocomplate arr init
  }, [acIndex, autocomplate])

  useEffect(() => {
    searchSubmit()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, timeRange, pageno])

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

  return (
    <>
      <Brand onDisplaySubtitle={setDisplaySubtitle} />
      <animated.div
        className={cs(css.searchWapper, { [css.focus]: focus })}
        style={{
          top: wapperTop,
        }}>
        <div className={css.searchInput}>
          <span className={css.prefix}>socode.pro</span>
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

          <div className='select is-rounded mgl10'>
            <select value={language} onChange={e => setStorage({ language: e.target.value as Language })}>
              {languageOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
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

        {loading && <Loader1 type={2} />}

        {error !== null && <div className={css.error}>{error.message}</div>}

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

        {result === null && (
          <p className={cs(css.slogan, { [css.zh]: language !== Language.English })}>{slogon}</p>
        )}
      </animated.div>
    </>
  )
}

export default SearchInput

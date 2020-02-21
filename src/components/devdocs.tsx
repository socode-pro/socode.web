import React, { useState, useEffect, useCallback } from 'react'
import cs from 'classnames'
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { DevDocEntrie } from '../services/devdocs.service'
import { winSearchParams } from '../utils/assist'
import Loader1 from './loader/loader1'
import css from './devdocs.module.scss'

interface Props {
  slug: string
  query: string
}

const Devdocs: React.FC<Props> = ({ slug, query }: Props): JSX.Element => {
  const loading = useStoreState<boolean>(state => state.devdocs.loading)
  const docLoading = useStoreState<boolean>(state => state.devdocs.docLoading)
  const results = useStoreState<{ [type: string]: Array<DevDocEntrie> }>(state => state.devdocs.results)
  const expandings = useStoreState<{ [index: string]: boolean }>(state => state.devdocs.expandings)
  const docs = useStoreState<{ [index: string]: string }>(state => state.devdocs.docs)
  const currentPath = useStoreState<string>(state => state.devdocs.currentPath)

  const initialIndex = useStoreActions(actions => actions.devdocs.initialIndex)
  const search = useStoreActions(actions => actions.devdocs.search)
  const toggleExpanding = useStoreActions(actions => actions.devdocs.toggleExpanding)
  const expand = useStoreActions(actions => actions.devdocs.expand)
  const selectDoc = useStoreActions(actions => actions.devdocs.selectDoc)

  const [isFloat, setIsFloat] = useState(false)

  const popstateSelect = useCallback(async () => {
    const searchParams = new URLSearchParams(window.location.search)
    const path = searchParams.get('devdocs')
    if (path) {
      await selectDoc({ slug, path })
      expand({ slug, path })
    }
  }, [expand, selectDoc, slug])

  useEffect(() => {
    const initial = async (): Promise<void> => {
      await initialIndex(slug)
      await search({ slug, query })
      await popstateSelect()
    }
    initial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndex, slug])

  const debounceSearch = useCallback(
    debounce<() => Promise<void>>(async () => {
      search({ slug, query })
    }, 500),
    [slug, query, search]
  )

  useEffect(() => {
    debounceSearch?.cancel()
    debounceSearch()
  }, [debounceSearch])

  const selectDocCallback = useCallback(
    path => {
      winSearchParams({ devdocs: path })
      selectDoc({ slug, path })
    },
    [selectDoc, slug]
  )

  useEffect(() => {
    window.addEventListener('popstate', popstateSelect)
    return () => {
      window.removeEventListener('popstate', popstateSelect)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const throttleFloat = throttle<() => void>(() => {
      if (document.body.scrollTop > 130) {
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

  if (loading) {
    return <Loader1 type={2} />
  }

  return (
    <div className={cs('columns', 'container')}>
      <div className={cs('column', 'is-one-quarter')}>
        <div className={cs(css.floatbox, { [css.float]: isFloat })}>
          {Object.entries(results).map(([t, entrie]) => {
            return (
              <div key={t} className={cs(css.typegroup, { [css.expanding]: expandings[t] })}>
                <div className={css.typename} onClick={() => toggleExpanding(t)}>
                  <i className={cs('fa-menus', css.icon)} />
                  {t}
                </div>
                <ul className={css.childrens}>
                  {entrie.map(e => {
                    return (
                      <li>
                        <a
                          className={css.item}
                          onClick={() => {
                            selectDocCallback(e.path)
                          }}>
                          <span key={e.path} className={cs({ [css.current]: currentPath === e.path })}>
                            {e.name}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
      <div className={cs('column', css.document, { [css.float]: isFloat })}>
        {docLoading && <Loader1 type={1} />}
        {docs[`${slug}_${currentPath}`] && (
          <div className={cs('_page', 'pd10')} dangerouslySetInnerHTML={{ __html: docs[`${slug}_${currentPath}`] }} />
        )}
      </div>
    </div>
  )
}

export default Devdocs

import React, { useEffect, useCallback } from 'react'
import cs from 'classnames'
import debounce from 'lodash/debounce'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { DevDocEntrie } from '../models/devdocs'
import { winSearchParams, transRelationHref } from '../utils/assist'
import Loader1 from './loader/loader1'
import css from './devdocs.module.scss'

interface Props {
  slug: string
  query: string
}

const Devdocs: React.FC<Props> = ({ slug, query }: Props): JSX.Element => {
  const initialMetas = useStoreActions(actions => actions.devdocs.initialMetas)
  useEffect(() => {
    initialMetas()
  }, [initialMetas])

  const loading = useStoreState<boolean>(state => state.devdocs.loading)
  const docLoading = useStoreState<boolean>(state => state.devdocs.docLoading)
  const results = useStoreState<{ [type: string]: Array<DevDocEntrie> }>(state => state.devdocs.results)
  const expandings = useStoreState<{ [index: string]: boolean }>(state => state.devdocs.expandings)
  const docs = useStoreState<{ [index: string]: string }>(state => state.devdocs.docs)
  const currentPath = useStoreState<string>(state => state.devdocs.currentPath)

  const loadIndex = useStoreActions(actions => actions.devdocs.loadIndex)
  const search = useStoreActions(actions => actions.devdocs.search)
  const toggleExpanding = useStoreActions(actions => actions.devdocs.toggleExpanding)
  const expand = useStoreActions(actions => actions.devdocs.expand)
  const selectDoc = useStoreActions(actions => actions.devdocs.selectDoc)

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
      await loadIndex(slug)
      await popstateSelect()
      await search({ slug, query })
    }
    initial()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadIndex, slug])

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
    if (!docs[`${slug}_${currentPath}`]) return

    if (currentPath.includes('#')) {
      const anchor = document.getElementById(currentPath.split('#')[1])
      if (anchor) anchor.scrollIntoView(true)
    }

    const atags = document.querySelectorAll('.devdocs_main a[href]')
    atags.forEach(tag => {
      const href = tag.getAttribute('href')
      const nhref = transRelationHref(href, currentPath)
      if (nhref) {
        const searchParams = new URLSearchParams(window.location.search)
        searchParams.set('devdocs', nhref)
        tag.setAttribute('href', `/?${searchParams.toString()}`)
      }
    })
  }, [docs, slug, currentPath])

  if (loading) {
    return <Loader1 type={2} />
  }

  return (
    <div className={cs('columns', 'container')}>
      <div className={cs('column', 'is-one-quarter', css.menubox)}>
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
                    <li key={e.name + e.path}>
                      <a
                        title={e.name}
                        className={cs(css.item, { [css.current]: currentPath === e.path })}
                        onClick={() => {
                          selectDocCallback(e.path)
                        }}>
                        {e.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
      <div className={cs('column', css.document)}>
        {docLoading && <Loader1 type={1} />}
        {docs[`${slug}_${currentPath}`] && (
          <div
            className={cs('devdocs_main', '_page', 'pd10')}
            dangerouslySetInnerHTML={{ __html: docs[`${slug}_${currentPath}`] }}
          />
        )}
      </div>
    </div>
  )
}

export default Devdocs

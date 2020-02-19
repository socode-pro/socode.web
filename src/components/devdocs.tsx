import React, { useEffect, useCallback } from 'react'
import cs from 'classnames'
import debounce from 'lodash/debounce'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { DevDocEntrie } from '../services/devdocs.service'
import css from './devdocs.module.scss'

interface Props {
  slug: string
  query: string
}

const Devdocs: React.FC<Props> = ({ slug, query }: Props): JSX.Element => {
  const results = useStoreState<{ [type: string]: Array<DevDocEntrie> }>(state => state.devdocs.results)
  const expandings = useStoreState<{ [index: string]: boolean }>(state => state.devdocs.expandings)
  const docs = useStoreState<{ [index: string]: string }>(state => state.devdocs.docs)
  const currentDocKey = useStoreState<string>(state => state.devdocs.currentDocKey)

  const initialIndex = useStoreActions(actions => actions.devdocs.initialIndex)
  const search = useStoreActions(actions => actions.devdocs.search)
  const expend = useStoreActions(actions => actions.devdocs.expand)
  const selectDoc = useStoreActions(actions => actions.devdocs.selectDoc)

  useEffect(() => {
    const initial = async (): Promise<void> => {
      await initialIndex(slug)
      await search({ slug, query })
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
    debounceSearch()
  }, [debounceSearch])

  return (
    <div className={cs('columns', css.devdocs)}>
      <div className={cs('column is-one-quarter', css.menus)}>
        {Object.entries(results).map(([t, entrie]) => {
          return (
            <div key={t} className={cs(css.typegroup, { [css.expanding]: expandings[t] })}>
              <span className={css.typename} onClick={() => expend(t)}>
                <i className='fa-menus' />
                {t}
              </span>
              <div className={css.childrens}>
                {entrie.map(e => {
                  return (
                    <a key={e.path} className={css.item} onClick={() => selectDoc({ slug, path: e.path })}>
                      {e.name}
                    </a>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className='column'>
        {docs[currentDocKey] && (
          <div className={css.document} dangerouslySetInnerHTML={{ __html: docs[currentDocKey] }} />
        )}
      </div>
    </div>
  )
}

export default Devdocs

import React, { useEffect } from 'react'
import cs from 'classnames'
import { DocResults } from '../models/devdocs'
import { useStoreActions, useStoreState } from '../utils/hooks'
import css from './devdocs.module.scss'

interface Props {
  slug: string
  query: string
}

const Devdocs: React.FC<Props> = ({ slug, query }: Props): JSX.Element => {
  const results = useStoreState<DocResults>(state => state.devdocs.results)
  const expandings = useStoreState<{ [index: string]: boolean }>(state => state.devdocs.expandings)
  const docs = useStoreState<{ [index: string]: string }>(state => state.devdocs.docs)
  const currentDocKey = useStoreState<string>(state => state.devdocs.currentDocKey)

  const initialIndex = useStoreActions(actions => actions.devdocs.initialIndex)
  const search = useStoreActions(actions => actions.devdocs.search)
  const expend = useStoreActions(actions => actions.devdocs.expand)
  const selectDoc = useStoreActions(actions => actions.devdocs.selectDoc)

  useEffect(() => {
    initialIndex(slug)
  }, [initialIndex, slug])

  useEffect(() => {
    search({ slug, query })
  }, [search, query, slug])

  return (
    <div className='columns'>
      <div className='column is-one-quarter'>
        {Object.entries(results).map(([t, entrie]) => {
          return (
            <div key={t} className={cs(css.typegroup, { [css.expanding]: expandings[t] })}>
              <span onClick={() => expend(t)}>{t}</span>
              <div className={css.childrens}>
                {entrie.map(e => {
                  return <a onClick={() => selectDoc({ slug, path: e.path })}>{e.name}</a>
                })}
              </div>
            </div>
          )
        })}
      </div>
      <div className='column'>
        {docs[currentDocKey] && (
          <div className='markdown-body' dangerouslySetInnerHTML={{ __html: docs[currentDocKey] }} />
        )}
      </div>
    </div>
  )
}

export default Devdocs

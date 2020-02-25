import React, { useState, useEffect } from 'react'
import cs from 'classnames'
import marked from 'marked'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { StorageType } from '../models/storage'
import Language from '../utils/language'
import css from './readme.module.scss'

interface Props {
  homelink: string
  readmes: ReadonlyArray<{
    path: string
    lang: Language
  }>
}

const Readme: React.FC<Props> = ({ homelink, readmes }: Props): JSX.Element => {
  const [markup, setMarkup] = useState<string | null>(null)
  const [path, setPath] = useState<string | null>(null)

  const { docLanguage } = useStoreState<StorageType>(state => state.storage.values)
  const setStorage = useStoreActions(actions => actions.storage.setStorage)

  const markdown = useStoreState<string>(state => state.readme.markdown)
  const getMarkdown = useStoreActions(actions => actions.readme.getMarkdown)

  useEffect(() => {
    const readme = readmes.find(r => r.lang === docLanguage)
    setPath(readme?.path || null)
  }, [docLanguage, readmes])

  useEffect(() => {
    getMarkdown({ homelink, readme: path || '' })
  }, [getMarkdown, homelink, path])

  useEffect(() => {
    const markedHtml = marked(markdown)
    setMarkup(markedHtml)
  }, [markdown])

  useEffect(() => {
    if (!path) return
    const body = document.querySelector('.markdown-body')
    if (!body) return

    const atags = body.querySelectorAll('a[href]')
    const imgtags = body.querySelectorAll('img[src]')
    atags.forEach(tag => {
      const href = tag.getAttribute('href')
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const paths = path.split('/')
        if (href.startsWith('../')) {
          paths[paths.length - 2] = href.replace('../', '')
          paths.pop()
        } else {
          paths[paths.length - 1] = href
        }
        const nPath = paths.join('/')
        tag.setAttribute('href', `${homelink}/raw/master/${nPath}`)
      }
    })
    imgtags.forEach(tag => {
      const href = tag.getAttribute('src')
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const paths = path.split('/')
        if (href.startsWith('../')) {
          paths[paths.length - 2] = href.replace('../', '')
          paths.pop()
        } else {
          paths[paths.length - 1] = href
        }
        const nPath = paths.join('/')
        tag.setAttribute('src', `${homelink}/raw/master/${nPath}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markup])

  return (
    <>
      <div className={cs('select is-rounded', css.selector)}>
        <select
          value={docLanguage}
          onChange={async e => {
            await setStorage({ docLanguage: e.target.value as Language })
          }}>
          {readmes.map(d => (
            <option key={d.lang} value={d.lang}>
              {Object.keys(Language).filter(e => Language[e] === d.lang)}
            </option>
          ))}
        </select>
      </div>
      {markup && <div className='markdown-body' dangerouslySetInnerHTML={{ __html: markup }} />}
    </>
  )
}

export default Readme

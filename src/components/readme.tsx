import React, { useState, useEffect } from 'react'
import cs from 'classnames'
import marked from 'marked'
import Fuse from 'fuse.js'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { StorageType } from '../models/storage'
import Language from '../utils/language'
import css from './readme.module.scss'

interface Item {
  index: number
  text: string
}

const fuseOptions: Fuse.FuseOptions<Item> = {
  keys: ['text'],
  threshold: 0.3,
  maxPatternLength: 16,
}

interface Props {
  base: string
  paths: ReadonlyArray<{
    path: string
    lang: Language
  }>
  query?: string
}

const Readme: React.FC<Props> = ({ base, paths, query }: Props): JSX.Element => {
  const [markup, setMarkup] = useState<string | null>(null)
  const [path, setPath] = useState<string>('')

  const { docLanguage } = useStoreState<StorageType>(state => state.storage.values)
  const setStorage = useStoreActions(actions => actions.storage.setStorage)

  const markdown = useStoreState<string>(state => state.readme.markdown)
  const getMarkdown = useStoreActions(actions => actions.readme.getMarkdown)

  useEffect(() => {
    const readme = paths.find(r => r.lang === docLanguage)
    setPath(readme?.path || '')
  }, [docLanguage, paths])

  useEffect(() => {
    getMarkdown({ base, path })
  }, [getMarkdown, base, path])

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
        const pathsp = path.split('/')
        if (href.startsWith('../')) {
          pathsp[pathsp.length - 2] = href.replace('../', '')
          pathsp.pop()
        } else {
          pathsp[pathsp.length - 1] = href
        }
        const nPath = pathsp.join('/')
        tag.setAttribute('href', `https://github.com/${base}/raw/master/${nPath}`)
      }
    })
    imgtags.forEach(tag => {
      const href = tag.getAttribute('src')
      if (href && !href.startsWith('http') && !href.startsWith('#')) {
        const pathsp = path.split('/')
        if (href.startsWith('../')) {
          pathsp[pathsp.length - 2] = href.replace('../', '')
          pathsp.pop()
        } else {
          pathsp[pathsp.length - 1] = href
        }
        const nPath = pathsp.join('/')
        tag.setAttribute('src', `https://github.com/${base}/raw/master/${nPath}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markup])

  useEffect(() => {
    const body = document.querySelector('.markdown-body')
    if (!body) return
    const tags = body.querySelectorAll('ul>li>a[href]') as NodeListOf<HTMLElement>

    if (query) {
      tags.forEach(t => {
        if (t.parentElement) {
          t.parentElement.style.display = 'none'
        }
      })

      const items = Array.from(tags).map((t, i) => ({ text: t.textContent || '', index: i }))
      const fuse = new Fuse(items, fuseOptions)
      const result = fuse.search<Item, false, false>(query)

      result.forEach(r => {
        const tag = tags[r.index] as HTMLElement
        if (tag.parentElement) {
          tag.parentElement.style.display = 'block'
        }
      })
    } else {
      tags.forEach(t => {
        if (t.parentElement) {
          t.parentElement.style.display = ''
        }
      })
    }
  }, [query])

  return (
    <>
      <div className={cs('select is-rounded', css.selector)}>
        <select
          value={docLanguage}
          onChange={async e => {
            await setStorage({ docLanguage: e.target.value as Language })
          }}>
          {paths.map(d => (
            <option key={d.lang} value={d.lang}>
              {Object.keys(Language).filter(e => Language[e] === d.lang)}
            </option>
          ))}
        </select>
      </div>
      {markup && <div className={cs('markdown-body')} dangerouslySetInnerHTML={{ __html: markup }} />}
    </>
  )
}

export default Readme

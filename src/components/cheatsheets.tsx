import React, { useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import cs from 'classnames'
import matches from 'dom101/matches'
import { splitwords, permutateString } from '../utils/permutate'
import { nextUntil } from '../utils/dom'
import css from './cheatsheets.module.scss'

let cheatSheetsElement: Element | null = null

interface Props {
  query: string
}

function permutate(data: { slug?: string; category?: string }): string[] {
  let words: string[] = []
  if (data.slug) {
    words = words.concat(permutateString(data.slug))
  }
  if (data.category) {
    words = words.concat(permutateString(data.category))
  }
  return words
}

const CheatSheets: React.FC<Props> = ({ query }: Props): JSX.Element => {
  const [element, setElement] = useState<Element | null>(null)

  useEffect(() => {
    if (element) {
      // https://github.com/rstacruz/cheatsheets/blob/master/_js/behaviors/searchable-item.js
      element.querySelectorAll('[data-js-searchable-item]').forEach(el => {
        const data = JSON.parse(el.getAttribute('data-js-searchable-item') || '{}')
        const words = permutate(data)

        el.setAttribute('data-search-index', words.join(' '))
        const href = el.getAttribute('href')
        if (href) {
          el.setAttribute('href', href.replace('./', 'https://devhints.io/'))
          el.setAttribute('target', '_blank')
        }
      })

      // https://github.com/rstacruz/cheatsheets/blob/master/_js/behaviors/searchable-header.js
      element.querySelectorAll('[data-js-searchable-header]').forEach(el => {
        const els = nextUntil(el, '[data-js-searchable-header]').filter(e => matches(e, '[data-search-index]'))

        const keywords = els
          .map(n => n.getAttribute('data-search-index'))
          .join(' ')
          .split(' ')

        el.setAttribute('data-search-index', keywords.join(' '))
        const href = el.getAttribute('href')
        if (href) {
          el.setAttribute('href', href.replace('./', 'https://devhints.io/'))
          el.setAttribute('target', '_blank')
        }
      })

      const missing = element.querySelector<HTMLElement>('.missing-message')
      if (missing) missing.style.display = 'none'
    }
  }, [element])

  useEffect(() => {
    if (element) {
      // https://github.com/rstacruz/cheatsheets/blob/master/_js/helpers/search.js
      const keywords = splitwords(query)
      if (!keywords.length) {
        element.querySelectorAll('[data-search-index]').forEach(el => {
          el.removeAttribute('aria-hidden')
        })
      } else {
        const selectors = keywords.map(k => `[data-search-index~=${JSON.stringify(k)}]`).join('')

        element.querySelectorAll('[data-search-index]').forEach(el => {
          el.setAttribute('aria-hidden', 'true')
        })

        element.querySelectorAll(selectors).forEach(el => {
          el.removeAttribute('aria-hidden')
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    if (cheatSheetsElement) {
      setTimeout(() => setElement(cheatSheetsElement), 0) // setTimeout avoid black box when switching
      return
    }
    axios
      .get('https://devhints.io/')
      .then(resp => {
        const doc = new DOMParser().parseFromString(resp.data, 'text/html')
        const el = doc.querySelector('.pages-list')
        if (el) {
          cheatSheetsElement = el
          setElement(el)
        }
      })
      .catch(err => {
        if (err.isAxiosError) {
          const e: AxiosError = err
          console.warn(`status:${e.response?.status} msg:${e.message}`, e)
        } else {
          console.error(err)
        }
      })
  }, [])

  // https://www.reddit.com/r/reactjs/comments/8k49m3/can_i_render_a_dom_element_inside_jsx/dz5cexl/
  return (
    <>
      <div
        className={cs(css.cheatsheets, { [css.loaddone]: element })}
        ref={ref => element && ref?.appendChild(element)}
      />
      <p className={cs(css.devhints, { 'dis-none': !element })}>
        <a href='https://devhints.io/' target='_blank' rel='noopener noreferrer'>
          powered by devhints
        </a>
      </p>
    </>
  )
}

export default CheatSheets

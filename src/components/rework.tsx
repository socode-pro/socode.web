import React, { useState, useEffect, useCallback } from 'react'
import ky from 'ky'
import cs from 'classnames'
import Loader1 from './loader/loader1'
import css from './rework.module.scss'

let reworkElement: Element | null = null

const Rework: React.FC = (): JSX.Element => {
  const [element, setElement] = useState<Element | null>(null)

  const [loading, setLoading] = useState<boolean>(false)
  const [reworkHtml, setReworkHtml] = useState<string>('')

  const getHtml = useCallback(async () => {
    try {
      setLoading(true)
      const html = await ky.get('https://rework.tools/').text()
      setReworkHtml(html || '')
    } catch (err) {
      console.warn('Rework.getHtml:', err)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    getHtml()
  }, [getHtml])

  useEffect(() => {
    if (reworkElement) {
      setTimeout(() => setElement(reworkElement), 0) // setTimeout avoid black box when switching
      return
    }
    const doc = new DOMParser().parseFromString(reworkHtml, 'text/html')
    const el = doc.querySelector('.rework-content')
    if (el) {
      reworkElement = el
      setElement(el)
    }
  }, [reworkHtml])

  if (loading) {
    return <Loader1 type={2} />
  }

  return (
    <>
      <div
        className={cs(css.rework, { [css.loaddone]: element })}
        ref={ref => element && ref?.appendChild(element)}
      />
      <p className={cs(css.reference, { 'dis-none': !element })}>
        <a href='https://rework.tools/' target='_blank' rel='noopener noreferrer'>
          powered by REWORK
        </a>
      </p>
    </>
  )
}

export default Rework

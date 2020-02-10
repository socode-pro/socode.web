import React, { useState, useEffect } from 'react'
import cs from 'classnames'
import marked from 'marked'
import { useStoreActions, useStoreState } from '../utils/hooks'
import css from './awesome.module.scss'

interface Props {
  name: string
  awesome: string
}

const Awesome: React.FC<Props> = ({ name, awesome }: Props): JSX.Element => {
  const [markup, setMarkup] = useState<string | null>(null)

  const markdown = useStoreState<string>(state => state.awesome.markdown)
  const getMarkdown = useStoreActions(actions => actions.awesome.getMarkdown)

  useEffect(() => {
    getMarkdown({ name, awesome })
  }, [getMarkdown, awesome, name])

  useEffect(() => {
    const markedHtml = marked(markdown)
    setMarkup(markedHtml)
  }, [markdown])

  // https://www.re[markdown]it.com/r/reactjs/comments/8k49m3/can_i_render_a_dom_element_inside_jsx/dz5cexl/
  return (
    <>
      <p className={cs(css.powered, { 'dis-none': !markup })}>
        <a href={`https://github.com/${awesome}`} target='_blank' rel='noopener noreferrer'>
          powered by {awesome}
        </a>
      </p>
      {markup && <div className='markdown-body' dangerouslySetInnerHTML={{ __html: markup }} />}
    </>
  )
}

export default Awesome

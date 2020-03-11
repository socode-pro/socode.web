import React from 'react'
import cs from 'classnames'
import { isEdgeChromium } from '../utils/assist'
import css from './extarrow.module.scss'

const ExtArrow: React.FC = (): JSX.Element => {
  return (
    <div className={css.extwapper}>
      <a
        className={cs(css.arrow, { [css.edge]: isEdgeChromium })}
        href='https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/'>
        <h3>Browser Extension</h3>
        <span>become the new tab of your browser</span>
      </a>
    </div>
  )
}

export default ExtArrow

// install browser extension to become the start page of your work

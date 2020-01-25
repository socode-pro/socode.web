import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cs from 'classnames'
import Language from '../utils/language'
import useIntl, { Words } from '../utils/useIntl'
import { StorageType } from '../models/storage'
import { useStoreActions, useStoreState } from '../utils/hooks'
import css from './extarrow.module.scss'

const ExtArrow: React.FC = (): JSX.Element => {
  return (
    <div className={css.extwapper}>
      <a
        className={cs(css.arrow)}
        href='https://chrome.google.com/webstore/detail/socode/hlkgijncpebndijijbcakkcefmpniacd'>
        <h3>Browser Extension</h3>
        <span>become the start page of your work</span>
      </a>
    </div>
  )
}

export default ExtArrow

// install browser extension to become the start page of your work

import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cs from 'classnames'
import Language from '../utils/language'
import useIntl, { Words } from '../utils/useIntl'
import { StorageType } from '../models/storage'
import { useStoreActions, useStoreState } from '../utils/hooks'
import css from './extarrow.module.scss'
import duckduck from '../images/duckduck.png'

const ExtArrow: React.FC = (): JSX.Element => {
  return (
    <a className={css.arrow} href='https://chrome.google.com/webstore/detail/socode/hlkgijncpebndijijbcakkcefmpniacd'>
      <i className={css.arrow_icon} />
    </a>
  )
}

export default ExtArrow

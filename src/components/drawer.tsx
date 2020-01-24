import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useSpring, animated, to } from 'react-spring'
import { Link } from 'react-router-dom'
import cs from 'classnames'
import Language from '../utils/language'
import useIntl, { Words } from '../utils/useIntl'
import { StorageType } from '../models/storage'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { EnumObjects } from '../utils/assist'
import css from './drawer.module.scss'

const languageOptions = EnumObjects(Language)

const Drawer: React.FC = (): JSX.Element => {
  const setStorage = useStoreActions(actions => actions.storage.setStorage)
  const { language } = useStoreState<StorageType>(state => state.storage.values)

  const [active, setActive] = useState(false)
  const { right } = useSpring({
    right: active ? 0 : 20,
  })

  return (
    <>
      <animated.button
        className={cs(css.hamburger, 'hamburger', 'hamburger--spin', { 'is-active': active })}
        style={{ right }}
        onClick={() => setActive(!active)}
        type='button'>
        <span className='hamburger-box'>
          <span className='hamburger-inner' />
        </span>
      </animated.button>
      {/* <animated.div className={css.drawer} style={{ transform: width.to(w => `translateX(${w}%)`) }}>
        Hello
      </animated.div> */}
      <div className={cs(css.drawer, { [css.active]: active })}>
        <aside className={cs('menu', css.jacket)}>
          <p className='menu-label'>Aside</p>
          <ul className='menu-list'>
            {language !== Language.中文 && (
              <li>
                <a>Github OAuth (save settings)</a>
              </li>
            )}
            {/* <li>
              <Link to='chat.socode.pro'>Spectrum Chat</Link>
            </li> */}
            <li>
              <a href='https://chrome.google.com/webstore/detail/socode/hlkgijncpebndijijbcakkcefmpniacd'>
                Chrome/Edge Extensions
                <i className={css.arrow_icon} />
              </a>
            </li>
            {/* <li>
              <a>Shortcut Keys</a>
            </li>
            <li>
              <a>Share SOCODE.PRO</a>
            </li>
            <li>
              <a>赞助一杯咖啡，关闭搜索页的广告</a>
            </li> */}
          </ul>
          <p className='menu-label'>Setting</p>
          <ul className='menu-list'>
            <li>
              <div className='select is-rounded mgl10'>
                <select value={language} onChange={e => setStorage({ language: e.target.value as Language })}>
                  {languageOptions.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </li>
            {/* <li>
              <a>Dark Switch</a>
            </li>
            <li>
              <a>Read</a>
              <ul>
                <li>
                  <a>Font Family</a>
                </li>
                <li>
                  <a>Font Size</a>
                </li>
              </ul>
            </li>
            <li>
              <a>Open Links in a New Tab</a>
            </li> */}
          </ul>
        </aside>
        <footer className={cs('menu', css.skirt)}>
          <p className='menu-label'>Footer</p>
          <ul className='menu-list'>
            <li>
              <Link to='/Privacy'>Privacy</Link>
            </li>
            {/* <li>
              <a>投放广告</a>
            </li> */}
            {/* {language !== Language.中文 && (
              <li>
                <a href='#'>twitter</a>
              </li>
            )} */}
            {language === Language.中文 && (
              <li>
                <a href='http://beian.miit.gov.cn/state/outPortal/loginPortal.action'>苏ICP备18044337号-2</a>
              </li>
            )}
          </ul>
          <p className={css.slogon}>{useIntl(Words.ProgrammersStartPage)}</p>
          <p className={css.principles}>hack your life, and become a professional mistake maker</p>
        </footer>
      </div>
      <div className={cs(css.mask, { 'dis-none': !active })} onClick={() => setActive(!active)} />
    </>
  )
}

export default Drawer

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
  const { language, openNewTab } = useStoreState<StorageType>(state => state.storage.values)

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
                <a className={cs(css.navlink, css.github)}>
                  <h3>Github OAuth</h3>
                  <span>to synchronize your settings</span>
                </a>
              </li>
            )}
            {/* <li>
              <a className={cs(css.navlink, css.spectrum)} href='https://chat.socode.pro'>
                <h3>Spectrum Chat</h3>
                <span>the community platform for socode future</span>
              </a>
            </li> */}
            <li>
              <a
                className={cs(css.navlink, css.chrome)}
                href='https://chrome.google.com/webstore/detail/socode/hlkgijncpebndijijbcakkcefmpniacd'>
                <h3>Browser Extension</h3>
                <span>become the start page of your work</span>
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
              <div className='control has-icons-left'>
                <div className='select is-rounded'>
                  <select value={language} onChange={e => setStorage({ language: e.target.value as Language })}>
                    {languageOptions.map(o => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <span className='icon is-left'>
                  <i className={css.globe} />
                </span>
              </div>
            </li>
            <li>
              <div className={css.field}>
                <input
                  className='is-checkradio is-circle'
                  id='opennewtab'
                  type='checkbox'
                  checked={openNewTab}
                  onChange={e => setStorage({ openNewTab: e.target.checked })}
                />
                <label htmlFor='opennewtab'>{useIntl(Words.OpenNewTab)}</label>
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
              <Link to='/Privacy' className={cs(css.navlink, css.privacy)}>
                <h3>Privacy</h3>
                <span>we don&apos;t collect or share personal information</span>
              </Link>
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
          <p className={css.slogon}>Hack your life</p>
          <p className={css.principles}>and become a professional mistake maker.</p>
        </footer>
      </div>
      <div className={cs('mask', { 'dis-none': !active })} onClick={() => setActive(!active)} />
    </>
  )
}

export default Drawer

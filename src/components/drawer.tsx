import React, { useState } from 'react'
import { useSpring, animated } from 'react-spring'
import { Link } from 'react-router-dom'
import cs from 'classnames'
import useHotkeys from '../utils/useHotkeys'
import Language from '../utils/language'
import useIntl, { Words } from '../utils/useIntl'
import { StorageType } from '../models/storage'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { StringEnumObjects } from '../utils/assist'
import css from './drawer.module.scss'

const languageOptions = StringEnumObjects(Language)

const Drawer: React.FC = (): JSX.Element => {
  const setStorage = useStoreActions(actions => actions.storage.setStorage)
  const { language, openNewTab, displayAwesome } = useStoreState<StorageType>(state => state.storage.values)

  const [shortcut, setShortcut] = useState(false)
  const [active, setActive] = useState(false)
  const { right } = useSpring({
    right: active ? 0 : 20,
  })

  useHotkeys(
    'f2',
    () => {
      setActive(!active)
    },
    [active],
    ['BODY']
  )

  useHotkeys(
    'shift+/',
    () => {
      if (document.activeElement?.tagName !== 'INPUT') {
        setShortcut(true)
      }
    },
    [],
    ['BODY']
  )

  useHotkeys(
    'esc',
    () => {
      setShortcut(false)
    },
    [],
    ['BODY']
  )

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
            {/* <li>
              <a className={cs(css.navlink, css.github)}>
                <h3>Github OAuth</h3>
                <span>to synchronize your settings</span>
              </a>
            </li> */}
            {language !== Language.中文_简体 && (
              <li>
                <a
                  className={cs(css.navlink, css.discord)}
                  target='_blank'
                  rel='noopener noreferrer'
                  href='https://discord.gg/qeBuAR'>
                  <h3>Discord Chat</h3>
                  <span>recommend feature/feedback bug</span>
                </a>
              </li>
            )}
            {language === Language.中文_简体 && (
              <li>
                <a
                  className={cs(css.navlink, css.qq)}
                  target='_blank'
                  rel='noopener noreferrer'
                  href='//shang.qq.com/wpa/qunwpa?idkey=3d2b1144846dfa498110b161de4267459888c26c67d509265bb88b4405b57e02'>
                  <h3>Chat</h3>
                  <span>recommend feature/feedback bug</span>
                </a>
              </li>
            )}
            <li>
              <a
                className={cs(css.navlink, css.chrome)}
                href='https://chrome.google.com/webstore/detail/socode/hlkgijncpebndijijbcakkcefmpniacd'>
                <h3>Browser Extension</h3>
                <span>become the start page of your work</span>
              </a>
            </li>
            <li>
              <a className={cs(css.navlink, css.shortcut)} onClick={() => setShortcut(true)}>
                <h3>{useIntl(Words.Shortcut)}</h3>
              </a>
            </li>
            <li>
              <Link to='/privacy' className={cs(css.navlink, css.privacy)}>
                <h3>{useIntl(Words.PrivacyPolicy)}</h3>
                <span>we don&apos;t collect or share personal information</span>
              </Link>
            </li>
            {/* <li>
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
                  <i className='fa-globe' />
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
            <li>
              <div className={css.field}>
                <input
                  className='is-checkradio is-circle'
                  id='displayawesome'
                  type='checkbox'
                  checked={displayAwesome}
                  onChange={e => setStorage({ displayAwesome: e.target.checked })}
                />
                <label htmlFor='displayawesome'>{useIntl(Words.DisplayAwesome)}</label>
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
            </li> */}
          </ul>
        </aside>
        <footer className={cs('menu', css.skirt)}>
          <p className='menu-label'>Footer</p>
          <ul className='menu-list'>
            {/* <li>
              <a>投放广告</a>
            </li> */}
            {language !== Language.中文_简体 && (
              <li>
                <a
                  className={cs(css.navlink, css.twitter)}
                  href='https://twitter.com/socode7'
                  target='_blank'
                  rel='noopener noreferrer'>
                  <h3>twitter.com/socode7</h3>
                </a>
              </li>
            )}
            {language === Language.中文_简体 && (
              <li>
                <a href='http://beian.miit.gov.cn/state/outPortal/loginPortal.action'>苏ICP备18044337号-2</a>
              </li>
            )}
          </ul>
          <p className={css.slogon}>Hack your life</p>
          <p className={css.principles}>and become a professional mistake maker.</p>
        </footer>
      </div>

      <div className={cs('modal', { 'is-active': shortcut })}>
        <div className='modal-background' />
        <div className='modal-content'>
          <div className={css.helpSignPart}>
            <div className={css.hint}>ESC to close</div>
            <div className={css.title}>Keyboard Shortcuts Help</div>
            <div>
              <div className={css.section}>
                <div>
                  <span className={css.shortcut}>?</span>
                  <span className={css.description}>{useIntl(Words.OpenKeyboardShortcuts)}</span>
                </div>
              </div>
              <div className={css.section}>
                <div className={css.label}>Searching</div>
                <div>
                  <span className={css.shortcut}>/</span>
                  <span className={css.description}>{useIntl(Words.FocusToInput)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>`</span>
                  <span className={css.description}>{useIntl(Words.DisplaySearchable)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>&apos;gh&apos;+tab</span>
                  <span className={css.description}>{useIntl(Words.SwitchToGithub)}</span>
                </div>
              </div>
              <div className={css.section}>
                <div className={css.label}>Lists</div>
                <div>
                  <span className={css.shortcut}>j</span>
                  <span className={css.description}>{useIntl(Words.NextPage)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>p</span>
                  <span className={css.description}>{useIntl(Words.PreviousPage)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className='modal-close is-large' type='button' aria-label='close' onClick={() => setShortcut(false)} />
      </div>

      <div className={cs('mask', { 'dis-none': !active })} onClick={() => setActive(false)} />
    </>
  )
}

export default Drawer

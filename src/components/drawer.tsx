import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useSpring, animated, to } from 'react-spring'
import { Link } from 'react-router-dom'
import cs from 'classnames'
import css from './drawer.module.scss'

const Drawer: React.FC = (): JSX.Element => {
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
          <p className='menu-label'>General</p>
          <ul className='menu-list'>
            {/* <li>
              <a>登录（只有中国版）</a>
            </li>
            <li>
              <Link to='chat.socode.pro'>Spectrum Chat</Link>
            </li>
            <li>
              <a>Extensions</a>
            </li>
            <li>
              <a>ShortcutKeys</a>
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
            {/* <li>
              <a>Language</a>
            </li>
            <li>
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
              <a>苏ICP备12009483号</a>
            </li> */}
          </ul>
        </footer>
      </div>
      <div className={cs(css.mask, { 'dis-none': !active })} onClick={() => setActive(!active)} />
    </>
  )
}

export default Drawer

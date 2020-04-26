import React, { useState, useEffect, useCallback } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cs from 'classnames'
import { InterfaceLanguage } from '../utils/language'
import { SettingsType } from '../models/storage'
import { SKey } from '../utils/searchkeys'
import { useStoreActions, useStoreState } from '../utils/hooks'
// import { useMediaPredicate } from 'react-media-hook'
import css from './brand.module.scss'

const words = [
  { value: 'Cheat Sheets', code: 'cheatsheets' },
  { value: 'repositories star growth', code: 'github_stars' },
  { value: 'Public APIs', code: 'public_apis' },
  { value: 'programming pacakges', code: 'npm' },
]

const Brand: React.FC = (): JSX.Element => {
  const { language } = useStoreState<SettingsType>(state => state.storage.settings)
  const displaySubtitle = useStoreState<boolean>(state => state.search.displaySubtitle)
  const setDisplaySubtitle = useStoreActions(actions => actions.search.setDisplaySubtitle)

  const keys = useStoreState<Array<SKey>>(state => state.searchKeys.keys)
  const setCurrentKey = useStoreActions(actions => actions.searchKeys.setCurrentKey)

  const [flipIn, setFlipIn] = useState(displaySubtitle)
  // const dark = useMediaPredicate('(prefers-color-scheme: dark)')
  // const titleColor = dark? 'rgba(153, 136, 119, 0.5)': 'rgba(102, 119, 136, 0.5)'

  // const titleColor = 'rgba(102, 119, 136, 0.5)'

  const { color, rotate } = useSpring({
    // color: displaySubtitle ? '#FA7C91' : titleColor,
    rotate: displaySubtitle ? 90 : 0,
  })

  // const [{ xys }, setXys] = useSpring(() => ({
  //   xys: [0, 0, 1],
  //   config: { mass: 5, tension: 350, friction: 40 },
  // }))

  const [currentCode, setCurrentCode] = useState('react')
  const onWord = useCallback((e): void => {
    e.stopPropagation()
    const key = keys.find(k => k.code === currentCode)
    if (key) setCurrentKey(key)
  }, [currentCode, keys, setCurrentKey])

  const typingTimer = useCallback((): void => {
    const typingDoc = document.querySelector('span.typing')

    const add = (text: string, index: number, uu: () => void): void => {
      if (typingDoc && index < text.length) {
        typingDoc.innerHTML = text.substring(0, index + 1)
        setTimeout(() => {
          add(text, index + 1, uu)
        }, 100)
      } else {
        setTimeout(uu, 3000)
      }
    }

    const reduce = (index: number, ii: () => void): void => {
      if (typingDoc && index > 0) {
        const text = typingDoc.innerHTML
        typingDoc.innerHTML = text.substring(0, index - 1)
        setTimeout(() => {
          reduce(index - 1, ii)
        }, 100)
      } else {
        setTimeout(ii, 100)
      }
    }

    const run = (index = 0): void => {
      if (!typingDoc || !document.body.contains(typingDoc)) return

      reduce(typingDoc.innerHTML.length, () => {
        setCurrentCode(words[index].code)
        add(words[index].value, 0, () => {
          run((index + 1) % words.length)
        })
      })
    }

    run()
  }, [])

  useEffect(() => {
    if (displaySubtitle) {
      window.setTimeout(typingTimer, 5000)
    }
  }, [displaySubtitle, typingTimer])

  const onToggle = useCallback(() => {
    if (displaySubtitle) {
      setFlipIn(false)
      setTimeout(() => {
        setDisplaySubtitle(false)
      }, 1000)
    } else {
      setFlipIn(true)
      setDisplaySubtitle(true)
    }
  }, [displaySubtitle, setDisplaySubtitle])

  return (
    <>
      <div className={cs(css.brand)}>
        <a href='/'>$OCODE</a>.PR
        <animated.i
          className={cs(css.toggle)}
          onClick={onToggle}
          // onKeyPress={onToggle}
          style={{
            // transform: to([rotate, xys], (r, _xys):string => `rotate(${r}deg) perspective(60px) rotateX(${_xys[0]}deg) rotateY(${_xys[1]}deg) scale(${_xys[2]})`),
            transform: to([rotate], (r): string => `rotate(${r}deg)`),
            // color,
          }}
          // onMouseMove={({ clientX: x, clientY: y }) => setXys({ xys: [-(y - 500)/20, (x - 500)/20, 1.1] })}
          // onMouseLeave={() => setXys({ xys: [0, 0, 1] })}
        />
      </div>

      {displaySubtitle && <div className={css.subtitle} onClick={onToggle}>
        <div className={cs(css.text, 'animated', { flipInX: flipIn, flipOutX: !flipIn })}>

          {language === InterfaceLanguage.中文 && <>
            在快捷舒适的输入框中搜索 <span onClick={onWord} className={cs(css.adjective, 'typing')}>programming documents</span>
          </>}

          {language === InterfaceLanguage.English && <>
            Search <span onClick={onWord} className={cs(css.adjective, 'typing')}>programming documents</span> in a quick and comfortable input box.
          </>}

        </div>
      </div>}
    </>
  )
}

export default Brand

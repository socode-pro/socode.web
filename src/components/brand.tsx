import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useSpring, animated, to } from 'react-spring'
import cs from 'classnames'
import { SKey } from '../utils/searchkeys'
import { useStoreActions, useStoreState } from '../utils/hooks'
// import { useMediaPredicate } from 'react-media-hook'
import css from './brand.module.scss'

// const words = ['cheatsheets', 'repositories star-history', 'public apis', 'programming pacakges']
const words = [
  { value: 'CheatSheets', code: 'cheatsheets' },
  { value: 'repositories star-history', code: 'starhistory' },
  { value: 'Public APIs', code: 'public_apis' },
  { value: 'programming pacakges', code: 'npm' },
]

// interface Props {
//   onDisplaySubtitle?: Dispatch<SetStateAction<boolean>>
// }

const Brand: React.FC = (): JSX.Element => {
  const displaySubtitle = useStoreState<boolean>(state => state.search.displaySubtitle)
  const setDisplaySubtitle = useStoreActions(actions => actions.search.setDisplaySubtitle)

  const keys = useStoreState<Array<SKey>>(state => state.searchKeys.keys)
  const setCurrentKey = useStoreActions(actions => actions.searchKeys.setCurrentKey)

  const [flipIn, setFlipIn] = useState(displaySubtitle)
  // const dark = useMediaPredicate('(prefers-color-scheme: dark)')
  // const titleColor = dark? 'rgba(153, 136, 119, 0.5)': 'rgba(102, 119, 136, 0.5)'
  const titleColor = 'rgba(102, 119, 136, 0.5)'

  const { color, rotate } = useSpring({
    color: displaySubtitle ? '#FA7C91' : titleColor,
    rotate: displaySubtitle ? 90 : 0,
  })

  // const [{ xys }, setXys] = useSpring(() => ({
  //   xys: [0, 0, 1],
  //   config: { mass: 5, tension: 350, friction: 40 },
  // }))

  const [currentCode, setCurrentCode] = useState('react')
  const onWord = useCallback((): void => {
    const key = keys.find(k => k.code === currentCode)
    if (key) setCurrentKey(key)
  }, [currentCode, keys, setCurrentKey])

  const typingTimer = useCallback((): void => {
    let typingDoc

    const add = (text: string, index: number, uu: () => void): void => {
      if (index < text.length) {
        typingDoc.innerHTML = text.substring(0, index + 1)
        setTimeout(() => {
          add(text, index + 1, uu)
        }, 100)
      } else {
        setTimeout(uu, 3000)
      }
    }

    const reduce = (index: number, ii: () => void): void => {
      if (index > 0) {
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
      typingDoc = document.querySelector('span.typing')
      if (!typingDoc) return

      const text = typingDoc.innerHTML
      reduce(text.length, () => {
        setCurrentCode(words[index].code)
        add(words[index].value, 0, () => {
          run((index + 1) % words.length)
        })
      })
    }

    run()
  }, [])

  useEffect(() => {
    const typingInterval = window.setTimeout(typingTimer, 4000)
    return () => {
      clearInterval(typingInterval)
    }
  }, [typingTimer])

  const onToggle = useCallback(() => {
    if (displaySubtitle) {
      setTimeout(() => setDisplaySubtitle(false), 1000)
    } else {
      setDisplaySubtitle(true)
    }

    setFlipIn(!flipIn)
  }, [displaySubtitle, flipIn, setDisplaySubtitle])

  return (
    <>
      <div className={cs(css.brand)}>
        <a href='/'>$OCODE</a>
        .PR
        <animated.i
          className={cs(css.toggle)}
          onClick={onToggle}
          onKeyPress={onToggle}
          style={{
            // transform: to([rotate, xys], (r, _xys):string => `rotate(${r}deg) perspective(60px) rotateX(${_xys[0]}deg) rotateY(${_xys[1]}deg) scale(${_xys[2]})`),
            transform: to([rotate], (r): string => `rotate(${r}deg)`),
            color,
          }}
          // onMouseMove={({ clientX: x, clientY: y }) => setXys({ xys: [-(y - 500)/20, (x - 500)/20, 1.1] })}
          // onMouseLeave={() => setXys({ xys: [0, 0, 1] })}
        />
      </div>
      {displaySubtitle && <div className={css.subtitle}>
        <div
          className={cs(css.text, 'animated', { flipInX: flipIn, flipOutX: !flipIn })}>
          Search <span onClick={onWord} className={cs(css.adjective, 'typing')}>multiple programming documents</span> in a fast and convenient input box.
        </div>
      </div>}
    </>
  )
}

export default Brand

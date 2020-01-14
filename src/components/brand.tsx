import React, { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'
import { useSpring, animated, to } from 'react-spring'
import { useMediaPredicate } from 'react-media-hook'
import cs from 'classnames'
import css from './brand.module.scss'

const words = ['searching', 'learning', 'communication']

interface Props {
  onDisplaySubtitle?: Dispatch<SetStateAction<boolean>>
}

const Brand: React.FC<Props> = ({ onDisplaySubtitle }: Props): JSX.Element => {
  const [displaySubtitle, setDisplaySubtitle] = useState(false)
  const [activeSubtitle, setActiveSubtitle] = useState(false)
  // const dark = useMediaPredicate('(prefers-color-scheme: dark)')
  // const titleColor = dark? 'rgba(153, 136, 119, 0.5)': 'rgba(102, 119, 136, 0.5)'
  const titleColor = 'rgba(102, 119, 136, 0.5)'

  const { color, rotate } = useSpring({
    color: displaySubtitle ? '#FA7C91': titleColor,
    rotate: displaySubtitle? 180: 0,
  })

  const [{ xys }, setXys] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 }
  }))

  const typingTimer = useCallback((): void => {
    let typingDoc

    const add = (text: string, index: number, uu: () => void): void => {
      if (index < text.length) {
        typingDoc.innerHTML = text.substring(0, index + 1)
        setTimeout(() => {
          add(text, index + 1, uu)
        }, 100)
      } else {
        setTimeout(uu, 2000)
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

    const run = (index: number): void => {
      typingDoc = document.querySelector('span.typing')
      if (!typingDoc) return

      const text = typingDoc.innerHTML
      reduce(text.length, () => {
        add(words[index], 0, () => {
          run((index + 1) % words.length)
        })
      })
    }

    run(0)
  }, [])

  useEffect(() => {
    const typingInterval = window.setTimeout(typingTimer, 3000)
    return () => {
      clearInterval(typingInterval)
    }
  }, [typingTimer])

  const onToggle = useCallback(() => {
    setActiveSubtitle(true)
    setDisplaySubtitle(!displaySubtitle)
    onDisplaySubtitle && onDisplaySubtitle(!displaySubtitle)
  }, [displaySubtitle, onDisplaySubtitle])

  return (
    <>
      <div className={cs(css.brand)}>
        <span>$OCODE</span>.PR
        <animated.i className={cs(css.toggle)} onClick={onToggle} onKeyPress={onToggle}
          style={{
            transform: to([rotate, xys], (r, _xys):string => `rotate(${r}deg) perspective(60px) rotateX(${_xys[0]}deg) rotateY(${_xys[1]}deg) scale(${_xys[2]})`),
            color
          }}
          onMouseMove={({ clientX: x, clientY: y }) => setXys({ xys: [-(y - 500)/20, (x - 500)/20, 1.1] })}
          onMouseLeave={() => setXys({ xys: [0, 0, 1] })}
        />
      </div>
      <div className={css.subtitle}>
        <div className={cs(css.text, 'animated', 'flipInX', { 'flipOutX': !displaySubtitle, 'dis-none': !activeSubtitle })}>
          Make life better for programmers who are good at <span className={cs(css.adjective, 'typing')}>...</span>
        </div>
      </div>
    </>
  )
}

export default Brand
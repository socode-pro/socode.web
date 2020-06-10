import React, { useEffect, useState } from "react"
import { useSpring, animated, to } from "react-spring"
import cs from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faTwitter, faTelegram, faDiscord } from "@fortawesome/free-brands-svg-icons"
import { useStoreActions, useStoreState } from "./Store"
import { isEdgeChromium, isFirefox } from "./utils/assist"
import { InterfaceLanguage } from "./utils/language"
import { Settings } from "./models/profile"
import Brand from "./components/brand"
import css from "./Extension.module.scss"
import discords from "./utils/discords_canvas"

export enum Words {
  Description = "You can search for multi-category programming documents quickly and comfortably in the address bar.",
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState("")
  const { language } = useStoreState<Settings>((state) => state.profile.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (words) {
        case Words.Description:
          setContent("在地址栏中快捷舒适地搜索多种类型的编程文档。")
          break
        default:
          break
      }
    } else {
      setContent(words)
    }
  }, [language, words])

  return content
}

const Extension: React.FC = () => {
  const { language } = useStoreState<Settings>((state) => state.profile.settings)
  const ousideFirewall = useStoreState<boolean>((state) => state.storage.ousideFirewall)
  const [{ xys }, setXys] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }))

  useEffect(() => {
    discords()
  }, [])

  return (
    <div className={cs("container", css.extension)}>
      <Brand />
      <div className="columns">
        <div className="column is-two-fifths">
          <h1 className={css.title}>Search Documents in Address Bar</h1>
          <p className={css.description}>{useIntl(Words.Description)}</p>
          <animated.div
            className={cs(css.wapper, css.browser)}
            style={{
              transform: to(
                [xys],
                (_xys): string => `perspective(60px) rotateX(${_xys[0]}deg) rotateY(${_xys[1]}deg) scale(${_xys[2]})`
              ),
            }}
            // 362 是目标的横轴线离屏幕上边距距离。纵轴线在这里无法计算 https://codesandbox.io/embed/rj998k4vmm
            onMouseMove={({ clientX: x, clientY: y }) => setXys({ xys: [-(y - 362) / 20, 0, 1.05] })}
            onMouseLeave={() => setXys({ xys: [0, 0, 1] })}>
            <a
              className={cs(css.arrow, {
                [css.edge]: isEdgeChromium && !ousideFirewall,
                [css.firefox]: isFirefox,
              })}
              href={
                isFirefox
                  ? "https://addons.mozilla.org/zh-CN/firefox/addon/socode-search/"
                  : isEdgeChromium && !ousideFirewall
                  ? "https://microsoftedge.microsoft.com/addons/detail/dkeiglafihicmjbbaoopggfnifgjekcl"
                  : ousideFirewall
                  ? "https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/"
                  : "https://www.crx4chrome.com/crx/196956/"
              }>
              <h3>Install to {isFirefox ? "firefox" : isEdgeChromium && !ousideFirewall ? "Edge" : "Chrome"}</h3>
            </a>
          </animated.div>
          <footer className={cs(css.footer)}>
            <a
              className={cs(css.navlink, css.telegram)}
              href="https://t.me/SocodePro"
              target="_blank"
              rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTelegram} />
            </a>
            <a
              className={cs(css.navlink, css.discord)}
              href="https://discord.gg/QeuD8Ma"
              target="_blank"
              rel="noopener noreferrer">
              <FontAwesomeIcon icon={faDiscord} />
            </a>
            <a
              className={cs(css.navlink, css.twitter)}
              href="https://twitter.com/socode7"
              target="_blank"
              rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a className={cs(css.navlink, css.email)} href="mailto:elliotreborn@gmail.com">
              <FontAwesomeIcon icon={faEnvelope} />
            </a>
          </footer>
        </div>
        <div className="column">
          <img className={css.preview} src={`${process.env.REACT_APP_KEYS_HOST}/address.gif`} alt="preview" />
        </div>
      </div>
    </div>
  )
}

export default Extension

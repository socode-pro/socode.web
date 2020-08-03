import React, { useEffect, useState, useCallback } from "react"
import { useSpring, animated, to } from "react-spring"
import cs from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faTwitter, faTelegram, faDiscord, faFirefox, faChrome } from "@fortawesome/free-brands-svg-icons"
import { useStoreState } from "./Store"
import { isEdgeChromium, isFirefox } from "./utils/assist"
import { InterfaceLanguage } from "./utils/language"
import { Settings } from "./models/profile"
import Brand from "./components/brand"
import css from "./Extension.module.scss"
import discords from "./utils/discords_canvas"
import SKeys, { SKey } from "./utils/searchkeys"

const devdocsKeys = SKeys.filter((k) => k.devdocs)

export enum Words {
  Description = "Quickly and comfortably search multiple programming documents in the address bar.",
  ReplaceNewTab = "Replace Browser's NewTab",
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState("")
  const { language } = useStoreState<Settings>((state) => state.profile.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (words) {
        case Words.Description:
          setContent("在地址栏中快捷、舒适地搜索多种类型的编程文档。")
          break
        case Words.ReplaceNewTab:
          setContent("替换浏览器NewTab")
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

  const keysDom = useCallback(
    (gkeys: SKey[]) => {
      return gkeys.map((key, i) => {
        let tooltipProps = {}
        if (key.tooltipsCN && language === InterfaceLanguage.中文) {
          tooltipProps = { "data-tooltip": key.tooltipsCN }
        } else if (key.tooltips) {
          tooltipProps = { "data-tooltip": key.tooltips }
        }
        return (
          <div
            key={key.code}
            className={cs(css.skeybox, "has-tooltip-multiline has-tooltip-warning")}
            {...tooltipProps}>
            <a className={css.skey} href={`/?k=${key.code}`}>
              <span className={cs(css.skname)} style={{ backgroundImage: `url(/keys/${key.icon})`, ...key.iconProps }}>
                {key.hideName ? <>&nbsp;</> : key.name}
              </span>
            </a>
          </div>
        )
      })
    },
    [language]
  )

  return (
    <>
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
                    ? "https://addons.mozilla.org/zh-CN/firefox/addon/socode/"
                    : // : isEdgeChromium && !ousideFirewall
                      // ? "https://microsoftedge.microsoft.com/addons/detail/dkeiglafihicmjbbaoopggfnifgjekcl"
                      // ousideFirewall
                      // ? "https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/"
                      //   :
                      "https://www.crx4chrome.com/crx/196956/"
                }>
                <h3>Install to {isFirefox ? "Firefox" : isEdgeChromium && !ousideFirewall ? "Edge" : "Chrome"}</h3>
              </a>
            </animated.div>
            <p className={cs(css.otherlinks, "mgt20")}>
              <FontAwesomeIcon icon={isFirefox ? faChrome : faFirefox} />
              <a
                href={
                  isFirefox
                    ? "https://www.crx4chrome.com/crx/196956/"
                    : "https://addons.mozilla.org/zh-CN/firefox/addon/socode/"
                }>
                Install to {isFirefox ? "Chrome" : "Firefox"}
              </a>
            </p>
            <p className={cs(css.otherlinks)}>
              <FontAwesomeIcon icon={isFirefox ? faFirefox : faChrome} />
              <a
                href={
                  isFirefox
                    ? "https://addons.mozilla.org/zh-CN/firefox/addon/new-tab-by-socode-pro/"
                    : "https://chrome.google.com/webstore/detail/awesome-programming-in-th/midlnalokbplpicoooemgpodiphdmllc"
                }>
                {useIntl(Words.ReplaceNewTab)}
              </a>
            </p>
          </div>
          <div className="column">
            <div className={css.preview}>
              <img src={`${process.env.REACT_APP_KEYS_HOST}/address2.gif`} alt="preview" />
            </div>
          </div>
        </div>
      </div>

      <div className={css.keysWapper}>
        {/* <h2 className={css.devdocsHeader}>Supported</h2> */}
        <div className={css.devdocsKeys}>{keysDom(devdocsKeys)}</div>
      </div>

      <div className={cs("container")}>
        <footer className={cs(css.footer)}>
          <div className={css.infos}>
            {language === InterfaceLanguage.中文 && (
              <p className="mgt10">
                <a href="http://beian.miit.gov.cn/state/outPortal/loginPortal.action">苏ICP备18044337号-2</a>
              </p>
            )}
            <p className={css.slogon}>Hack your life</p>
            <p className={css.principles}>and become a professional mistake maker.</p>
          </div>
          <div className={css.links}>
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
          </div>
        </footer>
      </div>
    </>
  )
}

export default Extension

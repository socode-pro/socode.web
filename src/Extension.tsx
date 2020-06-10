import React, { useEffect, useState } from "react"
import cs from "classnames"
import { useStoreActions, useStoreState } from "./Store"
import { isEdgeChromium, isFirefox } from "./utils/assist"
import { InterfaceLanguage } from "./utils/language"
import { Settings } from "./models/profile"
import Brand from "./components/brand"
import css from "./Extension.module.scss"

export enum Words {
  PrivacyPolicy = "Privacy Policy",
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState("")
  const { language } = useStoreState<Settings>((state) => state.profile.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (words) {
        case Words.PrivacyPolicy:
          setContent("隐私政策")
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

  return (
    <div className="container">
      <Brand />
      <div className="columns">
        <div className="column is-two-fifths">
          <h1 className={css.title}>Search Documents in Address Bar</h1>
          <p className={css.description}>
            You can search for multi-category programming documents quickly and comfortably in the address bar.
          </p>
          <div className={cs(css.wapper, css.browser)}>
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
          </div>
        </div>
        <div className="column">
          <img className={css.preview} src={`${process.env.REACT_APP_KEYS_HOST}/address.gif`} alt="preview" />
        </div>
      </div>
    </div>
  )
}

export default Extension

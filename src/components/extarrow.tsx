import React, { useEffect, useState, useCallback } from "react"
import cs from "classnames"
import { isEdgeChromium, isFirefox } from "../utils/assist"
import { InterfaceLanguage } from "../utils/language"
import { Settings } from "../models/profile"
import { useStoreState } from "../Store"
import css from "./extarrow.module.scss"

let deferredPrompt

const ExtArrow: React.FC = (): JSX.Element => {
  const { language } = useStoreState<Settings>((state) => state.profile.settings)
  const ousideFirewall = useStoreState<boolean>((state) => state.storage.ousideFirewall)
  const [showPWA, setShowPWA] = useState(false)

  // https://web.dev/customize-install/
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault()
      deferredPrompt = e
      setShowPWA(true)
    })
  }, [])

  const InstallPWA = useCallback(() => {
    setShowPWA(false)
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted pwa prompt")
        } else {
          console.log("User dismissed pwa prompt")
        }
      })
    }
  }, [])

  return (
    <div className={css.extarrow}>
      {showPWA && (
        <div className={cs(css.wapper)}>
          <a className={cs(css.arrow, css.pwa)} onClick={() => InstallPWA()}>
            <h3>Install the PWA</h3>
            {language === InterfaceLanguage.中文 ? (
              <span>使用你喜欢的方式快速启动SOCODE.PRO</span>
            ) : (
              <span>Quickly launch our app any way you like!</span>
            )}
          </a>
        </div>
      )}

      <div className={cs(css.wapper, css.browser)}>
        <a
          className={cs(css.arrow, {
            [css.edge]: isEdgeChromium && !ousideFirewall,
            [css.firefox]: isFirefox,
          })}
          // href="https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/">
          href={
            isFirefox
              ? "https://addons.mozilla.org/zh-CN/firefox/addon/socode-search/" // "https://os.socode.pro/firefox.xpi"
              : isEdgeChromium && !ousideFirewall
              ? "https://microsoftedge.microsoft.com/addons/detail/dkeiglafihicmjbbaoopggfnifgjekcl"
              : ousideFirewall
              ? "https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/"
              : "https://www.crx4chrome.com/crx/196956/"
          }>
          <h3>Search Documents in AddressBar</h3>
          <span>Learn More ⤴</span>
        </a>
      </div>
    </div>
  )
}

export default ExtArrow

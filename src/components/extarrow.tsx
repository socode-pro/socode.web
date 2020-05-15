import React, { useEffect, useState, useCallback, useMemo } from "react"
import cs from "classnames"
import { isEdgeChromium, isFirefox, ousideFirewall } from "../utils/assist"
import { InterfaceLanguage } from "../utils/language"
import { SettingsType } from "../models/storage"
import { useStoreState } from "../utils/hooks"
import css from "./extarrow.module.scss"

let deferredPrompt

const ExtArrow: React.FC = (): JSX.Element => {
  const { language } = useStoreState<SettingsType>((state) => state.storage.settings)
  const [showPWA, setShowPWA] = useState(false)
  const [useEdgeStore, setUseEdgeStore] = useState(false)

  useEffect(() => {
    ousideFirewall().then((ouside) => {
      setUseEdgeStore(isEdgeChromium && !ouside)
    })
  }, [])

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
              <span>使用任意你喜欢的方式快速启动SOCODE.PRO</span>
            ) : (
              <span>Quickly launch our app any way you like!</span>
            )}
          </a>
        </div>
      )}

      <div className={cs(css.wapper, css.browser)}>
        <a
          className={cs(css.arrow, {
            [css.edge]: useEdgeStore,
            [css.firefox]: isFirefox,
          })}
          // href="https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/">
          href={
            isFirefox
              ? "https://os.socode.pro/firefox.xpi"
              : useEdgeStore
              ? "https://microsoftedge.microsoft.com/addons/detail/dkeiglafihicmjbbaoopggfnifgjekcl"
              : "https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/"
          }>
          <h3>Browser Extension</h3>
          {language === InterfaceLanguage.中文 ? (
            <>
              <span>成为浏览器的 New Tab 页</span>
              {isFirefox && (
                <span className={css.fftips}>
                  注意：因为加载远程html，Firefox拒绝了此插件。只能解压xpi文件通过[调试附加组件] - [载入临时附加组件]
                  安装
                </span>
              )}
            </>
          ) : (
            <span>become the new tab of your browser</span>
          )}
        </a>
      </div>
    </div>
  )
}

export default ExtArrow

// install browser extension to become the start page of your work

import React, { useEffect, useState, useCallback } from 'react'
import cs from 'classnames'
import { isEdgeChromium, isFirefox } from '../utils/assist'
import css from './extarrow.module.scss'

let deferredPrompt

const ExtArrow: React.FC = (): JSX.Element => {
  const [showPWA, setShowPWA] = useState(false)

  // https://web.dev/customize-install/
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
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
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted pwa prompt')
        } else {
          console.log('User dismissed pwa prompt')
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
            <span>Quickly launch our app any way you like!</span>
          </a>
        </div>
      )}

      <div className={cs(css.wapper)}>
        <a
          className={cs(css.arrow, {
            [css.edge]: isEdgeChromium,
            [css.firefox]: isFirefox,
          })}
          href='https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/'>
          {/* href={isFirefox ? 'https://addons.mozilla.org/zh-CN/firefox/addon/socode-search/' :
           isEdgeChromium ? 'https://microsoftedge.microsoft.com/addons/detail/dkeiglafihicmjbbaoopggfnifgjekcl' :
             'https://chrome.google.com/webstore/detail/hlkgijncpebndijijbcakkcefmpniacd/'}> */}

          <h3>Browser Extension</h3>
          <span>become the new tab of your browser</span>
        </a>
      </div>
    </div>
  )
}

export default ExtArrow

// install browser extension to become the start page of your work

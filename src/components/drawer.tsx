import React, { useState, useEffect, useCallback } from "react"
import { useSpring, animated } from "react-spring"
import { Link } from "react-router-dom"
import cs from "classnames"
import ClipboardJS from "clipboard"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlobe, faEllipsisH, faShareAlt, faSignOutAlt, faSpinner } from "@fortawesome/free-solid-svg-icons"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faTwitter, faProductHunt, faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"
import useHotkeys from "../utils/useHotkeys"
import { InterfaceLanguage } from "../utils/language"
import useIntl, { Words } from "../utils/useIntl"
import { Settings, Profile } from "../models/profile"

import { useStoreActions, useStoreState } from "../Store"
import { StringEnumObjects, isEdgeChromium, isFirefox } from "../utils/assist"
import css from "./drawer.module.scss"

const languageOptions = StringEnumObjects(InterfaceLanguage)
let deferredPrompt

const Drawer: React.FC = (): JSX.Element => {
  const ousideFirewall = useStoreState<boolean>((state) => state.storage.ousideFirewall)
  const setSettings = useStoreActions((actions) => actions.profile.setSettings)
  const { language, openNewPage, displayTrending } = useStoreState<Settings>((state) => state.profile.settings)
  const profile = useStoreState<Profile | null>((state) => state.profile.profile)
  const logout = useStoreActions((actions) => actions.profile.logout)

  const [githubSpinning, setGithubSpinning] = useState(false)
  const [googleSpinning, setGoogleSpinning] = useState(false)

  const [tooltips, setTooltips] = useState(false)
  const [shareMenu, setShareMenu] = useState(false)
  const [showPWA, setShowPWA] = useState(true)

  const [profileMenu, setProfileMenu] = useState(false)
  const [shortcut, setShortcut] = useState(false)
  const [wechatQR, setWechatQR] = useState(false)
  const [active, setActive] = useState(false)
  const { right } = useSpring({
    right: active ? 0 : 20,
  })

  useEffect(() => {
    const clipboard = new ClipboardJS("#shareinput")
    clipboard.on("success", (e) => {
      if (e.text) setTooltips(true)
    })

    // https://web.dev/customize-install/
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

  const displayShareMenu = useCallback((display) => {
    setShareMenu(display)
    setTooltips(false)
  }, [])

  useHotkeys(
    "f2",
    () => {
      setActive(!active)
    },
    [active],
    ["BODY"]
  )

  useHotkeys(
    "shift+/",
    () => {
      if (document.activeElement?.tagName !== "INPUT") {
        setShortcut(true)
      }
    },
    [],
    ["BODY"]
  )

  useHotkeys(
    "esc",
    () => {
      setShortcut(false)
      setWechatQR(false)
    },
    [],
    ["BODY"]
  )

  return (
    <>
      <animated.button
        className={cs(css.hamburger, "hamburger", "hamburger--spin", { "is-active": active })}
        style={{ right }}
        onClick={() => setActive(!active)}
        type="button">
        <span className="hamburger-box">
          <span className="hamburger-inner" />
        </span>
      </animated.button>
      {/* <animated.div className={css.drawer} style={{ transform: width.to(w => `translateX(${w}%)`) }}>
        Hello
      </animated.div> */}
      <div className={cs(css.drawer, { [css.active]: active })}>
        <aside className={cs("menu", css.jacket)}>
          {!profile && <p className="menu-label">Login</p>}
          {!!profile && <p className="menu-label">Profile</p>}
          <ul className="menu-list">
            {!profile && (
              <li className={css.loginItem}>
                <a
                  className={cs(css.navlink, css.github)}
                  onClick={() => setGithubSpinning(true)}
                  href={`${process.env.REACT_APP_NEST}/auth/github`}>
                  {!githubSpinning && <h3>Github</h3>}
                  {githubSpinning && <FontAwesomeIcon icon={faSpinner} spin />}
                </a>
                <a
                  className={cs(css.navlink, css.google)}
                  onClick={() => setGoogleSpinning(true)}
                  href={`${process.env.REACT_APP_NEST}/auth/google`}>
                  {!googleSpinning && <h3>Google</h3>}
                  {googleSpinning && <FontAwesomeIcon icon={faSpinner} spin />}
                </a>
              </li>
            )}
            {!!profile && (
              <li className={cs(css.profile, "dropdown", "is-right", { "is-active": profileMenu })}>
                <a className={cs(css.navlink, "dropdown-trigger")} onClick={() => setProfileMenu(true)}>
                  <div className={cs(css.profileInfo)}>
                    <figure className="image is-48x48 mgr10">
                      <img className="is-rounded" src={profile.avatar} alt="avatar" />
                    </figure>
                    <h3>{profile.displayName}</h3>
                  </div>
                  <FontAwesomeIcon icon={faEllipsisH} className="mgr10" />
                </a>
                <div className="dropdown-menu">
                  <div className="dropdown-content">
                    {!!profile.githubToken && (
                      <a className={cs("dropdown-item", css.disable)}>
                        <FontAwesomeIcon icon={faGithub} className="mgr10" />
                        Github: {profile.username}
                      </a>
                    )}
                    {!profile.githubToken && (
                      <a className="dropdown-item" href={`${process.env.REACT_APP_NEST}/auth/github`}>
                        <FontAwesomeIcon icon={faGithub} className="mgr10" />
                        Login With Github
                      </a>
                    )}
                    {!!profile.googleToken && (
                      <a className={cs("dropdown-item", css.disable)}>
                        <FontAwesomeIcon icon={faGoogle} className="mgr10" />
                        Google: {profile.username}
                      </a>
                    )}
                    {!profile.googleToken && (
                      <a className="dropdown-item" href={`${process.env.REACT_APP_NEST}/auth/google`}>
                        <FontAwesomeIcon icon={faGoogle} className="mgr10" />
                        Login With Google
                      </a>
                    )}
                    <hr className="dropdown-divider" />
                    <a className="dropdown-item" onClick={() => displayShareMenu(!shareMenu)}>
                      <FontAwesomeIcon icon={faShareAlt} className="mgr10" />
                      {!!profile.invitationCount && <span>Have shared with {profile.invitationCount} friends</span>}
                      {!profile.invitationCount && <span>Share with your friends</span>}
                    </a>
                    {shareMenu && (
                      <div
                        className={cs(css.shareinput, "dropdown-item", "has-tooltip-warning")}
                        data-tooltip={tooltips ? "Copied!" : null}>
                        <input
                          id="shareinput"
                          onClick={(e) => (e.target as HTMLInputElement).select()}
                          value={`https://socode.pro/${profile ? `?invitationCode=${profile.invitationCode}` : ""}`}
                          onChange={() => null}
                          data-clipboard-target="#shareinput"
                          className="input"
                        />
                      </div>
                    )}
                    <hr className="dropdown-divider" />
                    <a className={cs("dropdown-item is-danger", css.logout)} onClick={() => logout()}>
                      <FontAwesomeIcon icon={faSignOutAlt} className="mgr10" />
                      Logout
                    </a>
                  </div>
                </div>
                <div
                  className={cs("mask", css.profileMenuMask, { "dis-none": !profileMenu })}
                  onClick={() => setProfileMenu(false)}
                />
              </li>
            )}
          </ul>
          <p className="menu-label">Aside</p>
          <ul className="menu-list">
            {showPWA && (
              <li>
                <a className={cs(css.navlink, css.pwa)} onClick={() => InstallPWA()}>
                  <h3>Install the PWA</h3>
                  {language === InterfaceLanguage.中文 ? (
                    <span>使用你喜欢的方式快速启动SOCODE.PRO</span>
                  ) : (
                    <span>Quickly launch our app any way you like!</span>
                  )}
                </a>
              </li>
            )}
            <li>
              <Link
                className={cs(css.navlink, css.chrome, {
                  [css.edge]: isEdgeChromium && !ousideFirewall,
                  [css.firefox]: isFirefox,
                })}
                to="/extension">
                <h3>{useIntl(Words.SearchDocumentsInAddressBar)}</h3>
                <span>Learn More ⤴</span>
              </Link>
            </li>
            <li>
              <a
                className={cs(css.navlink, css.newtab)}
                href={
                  isFirefox
                    ? "https://addons.mozilla.org/zh-CN/firefox/addon/new-tab-by-socode-pro/"
                    : "https://chrome.google.com/webstore/detail/awesome-programming-in-th/midlnalokbplpicoooemgpodiphdmllc"
                }>
                <h3>{useIntl(Words.ReplaceNewTab)}</h3>
                <span>Learn More ⤴</span>
              </a>
            </li>
            {/* <li>
              <a className={cs(css.navlink, css.shortcut)} onClick={() => setShortcut(true)}>
                <h3>{useIntl(Words.Shortcut)}</h3>
                <span>quick switch search engine</span>
              </a>
            </li> */}
            <li>
              <Link to="/privacy" className={cs(css.navlink, css.privacy)}>
                <h3>{useIntl(Words.PrivacyPolicy)}</h3>
                <span>we don&apos;t collect personal information</span>
              </Link>
            </li>
            {/* <li>
              <a>赞助一杯咖啡，关闭搜索页的广告</a>
            </li> */}
          </ul>

          <p className="menu-label">request feature / report bug</p>
          <ul className="menu-list">
            <li>
              <a
                className={cs(css.navlink, css.telegram)}
                href="https://t.me/SocodePro"
                target="_blank"
                rel="noopener noreferrer">
                <h3>Telegram</h3>
              </a>
            </li>
            <li>
              <a
                className={cs(css.navlink, css.discord)}
                target="_blank"
                rel="noopener noreferrer"
                href="https://discord.gg/QeuD8Ma">
                <h3>Discord</h3>
              </a>
            </li>
            <li>
              <a className={cs(css.navlink, css.wechat)} onClick={() => setWechatQR(true)}>
                <h3>Wechat Group</h3>
              </a>
            </li>
          </ul>

          <p className="menu-label">Setting</p>
          <ul className="menu-list">
            <li>
              <div className="control has-icons-left">
                <div className="select is-rounded">
                  <select
                    value={language}
                    onChange={(e) => setSettings({ settings: { language: e.target.value as InterfaceLanguage } })}>
                    {languageOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
                <span className="icon is-left">
                  <FontAwesomeIcon icon={faGlobe} />
                </span>
              </div>
            </li>
            <li>
              <div className={css.field}>
                <input
                  className="is-checkradio is-circle"
                  id="openNewPage"
                  type="checkbox"
                  checked={openNewPage}
                  onChange={(e) => setSettings({ settings: { openNewPage: e.target.checked } })}
                />
                <label htmlFor="openNewPage">{useIntl(Words.OpenNewPage)}</label>
              </div>
            </li>
            <li>
              <div className={css.field}>
                <input
                  className="is-checkradio is-circle"
                  id="displaytrending"
                  type="checkbox"
                  checked={displayTrending}
                  onChange={(e) => setSettings({ settings: { displayTrending: e.target.checked } })}
                />
                <label htmlFor="displaytrending">{useIntl(Words.DisplayTrending)}</label>
              </div>
            </li>

            {/* <li>
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
            </li> */}
          </ul>
        </aside>
        <footer className={cs("menu", css.skirt)}>
          <p className="menu-label">Footer</p>
          <a
            className={cs(css.navlink, css.footicon)}
            href="https://www.producthunt.com/posts/socode-pro"
            target="_blank"
            rel="noopener noreferrer">
            <FontAwesomeIcon icon={faProductHunt} />
          </a>
          <a
            className={cs(css.navlink, css.footicon)}
            href="https://twitter.com/socode7"
            target="_blank"
            rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            className={cs(css.navlink, css.footicon)}
            target="_blank"
            rel="noreferrer"
            href="mailto:elliotreborn@gmail.com">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>

          {/* <div className={cs(css.share, "dropdown", { "is-active": shareMenu })}>
            <a className={cs(css.navlink, css.footicon, "dropdown-trigger")} onClick={() => displayShareMenu(true)}>
              <FontAwesomeIcon icon={faShareAlt} />
            </a>
            <div className={cs("dropdown-menu")}>
              <div
                className={cs(css.shareinput, "dropdown-content", "has-tooltip-warning")}
                data-tooltip={tooltips ? "Copied!" : null}>
                <input
                  id="shareinput"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  value={`https://socode.pro/${profile ? `?invitationCode=${profile.invitationCode}` : ""}`}
                  onChange={() => null}
                  data-clipboard-target="#shareinput"
                  className="input"
                />
              </div>
            </div>
            <div
              className={cs("mask", css.profileMenuMask, { "dis-none": !shareMenu })}
              onClick={() => displayShareMenu(false)}
            />
          </div> */}

          {/* <a>投放广告</a> */}
          {language === InterfaceLanguage.中文 && (
            <p className="mgt10">
              <a href="http://beian.miit.gov.cn/state/outPortal/loginPortal.action">苏ICP备18044337号-2</a>
            </p>
          )}
          <p className={css.slogon}>Hack your life</p>
          <p className={css.principles}>and become a professional mistake maker.</p>
        </footer>
      </div>

      <div className={cs("modal", { "is-active": shortcut })}>
        <div className="modal-background" onClick={() => setShortcut(false)} />
        <div className="modal-content">
          <div className={css.helpSignPart}>
            <div className={css.hint}>ESC to close</div>
            <div className={css.title}>Keyboard Shortcuts Help</div>
            <div>
              <div className={css.section}>
                <div>
                  <span className={css.shortcut}>?</span>
                  <span className={css.description}>{useIntl(Words.OpenKeyboardShortcuts)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>f2</span>
                  <span className={css.description}>{useIntl(Words.ToggleMenuButton)}</span>
                </div>
              </div>
              <div className={css.section}>
                <div className={css.label}>Searching</div>
                <div>
                  <span className={css.shortcut}>/</span>
                  <span className={css.description}>{useIntl(Words.FocusToInput)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>&apos;gh&apos;+tab</span>
                  <span className={css.description}>{useIntl(Words.SwitchToGithub)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>`</span>
                  <span className={css.description}>{useIntl(Words.DisplaySearchable)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>&apos;`&apos;+tab</span>
                  <span className={css.description}>{useIntl(Words.DisplaySearchable)}</span>
                </div>
              </div>
              {/* <div className={css.section}>
                <div className={css.label}>Lists</div>
                <div>
                  <span className={css.shortcut}>j</span>
                  <span className={css.description}>{useIntl(Words.NextPage)}</span>
                </div>
                <div>
                  <span className={css.shortcut}>p</span>
                  <span className={css.description}>{useIntl(Words.PreviousPage)}</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        <button className="modal-close is-large" type="button" aria-label="close" onClick={() => setShortcut(false)} />
      </div>

      {wechatQR && (
        <div className={cs("modal", "is-active")}>
          <div className="modal-background" onClick={() => setWechatQR(false)} />
          <div className={cs("modal-card", css.wechatqr)}>
            <header className="modal-card-head">
              <p className="modal-card-title">Invite me to your group chat</p>
              <button className="delete" aria-label="close" type="button" onClick={() => setWechatQR(false)} />
            </header>
            <img src={`${process.env.REACT_APP_KEYS_HOST}/wechat.png`} alt="wechat" />
          </div>
          <button
            className="modal-close is-large"
            type="button"
            aria-label="close"
            onClick={() => setWechatQR(false)}
          />
        </div>
      )}

      <div className={cs("mask", { "dis-none": !active })} onClick={() => setActive(false)} />
    </>
  )
}

export default Drawer

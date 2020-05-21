import React, { useState, useCallback } from "react"
import { useSpring, animated } from "react-spring"
import { Link } from "react-router-dom"
import cs from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGlobe } from "@fortawesome/free-solid-svg-icons"
import { faEnvelope } from "@fortawesome/free-regular-svg-icons"
import { faTwitter, faProductHunt } from "@fortawesome/free-brands-svg-icons"
import useHotkeys from "../utils/useHotkeys"
import { InterfaceLanguage } from "../utils/language"
import useIntl, { Words } from "../utils/useIntl"
import { SettingsType } from "../models/storage"
import { useStoreActions, useStoreState } from "../utils/hooks"
import { StringEnumObjects, isEdgeChromium } from "../utils/assist"
import { error } from "../utils/toast"
import css from "./drawer.module.scss"
import wechatQRUrl from "../images/wechat.png"

const languageOptions = StringEnumObjects(InterfaceLanguage)

const Drawer: React.FC = (): JSX.Element => {
  const setSettings = useStoreActions((actions) => actions.storage.setSettings)
  const setGithubToken = useStoreActions((actions) => actions.storage.setGithubToken)
  const { language, openNewTab, displayTrending } = useStoreState<SettingsType>((state) => state.storage.settings)
  const githubToken = useStoreState<string>((state) => state.storage.githubToken)

  const [shortcut, setShortcut] = useState(false)
  const [wechatQR, setWechatQR] = useState(false)
  const [active, setActive] = useState(false)
  const { right } = useSpring({
    right: active ? 0 : 20,
  })

  const GithubOAuth = useCallback(
    (e) => {
      e.preventDefault()
      const authenticator = new (window as any).netlify.default({})
      authenticator.authenticate({ provider: "github", scope: "user" }, (err, data) => {
        if (err) {
          error(`Error Authenticating with GitHub: ${err}`)
          return
        }
        console.log(JSON.stringify(data))
        setGithubToken(data.token)
      })
    },
    [setGithubToken]
  )

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
          <p className="menu-label">Aside</p>
          <ul className="menu-list">
            {githubToken && (
              <li>
                <a className={cs(css.navlink, css.github)} href="https://github.com/settings/applications?o=used-asc">
                  <h3>Github Authorized</h3>
                  {/* <span>to synchronize your settings</span> */}
                  <span>expand the limit of github api request</span>
                </a>
              </li>
            )}
            {!githubToken && (
              <li>
                <a className={cs(css.navlink, css.github)} onClick={GithubOAuth}>
                  <h3>Github OAuth</h3>
                  {/* <span>to synchronize your settings</span> */}
                  <span>expand the limit of github api request</span>
                </a>
              </li>
            )}
            <li>
              <a
                className={cs(css.navlink, css.chrome, { [css.edge]: isEdgeChromium })}
                href="https://chrome.google.com/webstore/detail/socode/hlkgijncpebndijijbcakkcefmpniacd">
                <h3>Browser Extension</h3>
                <span>become the new tab of your browser</span>
              </a>
            </li>
            <li>
              <a className={cs(css.navlink, css.shortcut)} onClick={() => setShortcut(true)}>
                <h3>{useIntl(Words.Shortcut)}</h3>
                <span>quick switch search engine</span>
              </a>
            </li>
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
            {language === InterfaceLanguage.English && (
              <li>
                <a
                  className={cs(css.navlink, css.form)}
                  href="https://forms.gle/G3UwA1CgThaSBv437"
                  target="_blank"
                  rel="noopener noreferrer">
                  <h3>Submit Your Resources</h3>
                </a>
              </li>
            )}
            {language === InterfaceLanguage.中文 && (
              <li>
                <a
                  className={cs(css.navlink, css.form)}
                  href="https://jinshuju.net/f/n63rZZ"
                  target="_blank"
                  rel="noopener noreferrer">
                  <h3>提交您的资源</h3>
                </a>
              </li>
            )}

            {/* <li>
              <a
                className={cs(css.navlink, css.spectrum)}
                target='_blank'
                rel='noopener noreferrer'
                href='https://spectrum.chat/socode'>
                <h3>Spectrum</h3>
              </a>
            </li> */}
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
                    onChange={(e) => setSettings({ language: e.target.value as InterfaceLanguage })}>
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
                  id="opennewtab"
                  type="checkbox"
                  checked={openNewTab}
                  onChange={(e) => setSettings({ openNewTab: e.target.checked })}
                />
                <label htmlFor="opennewtab">{useIntl(Words.OpenNewTab)}</label>
              </div>
            </li>
            <li>
              <div className={css.field}>
                <input
                  className="is-checkradio is-circle"
                  id="displaytrending"
                  type="checkbox"
                  checked={displayTrending}
                  onChange={(e) => setSettings({ displayTrending: e.target.checked })}
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
            className={cs(css.navlink, css.producthunt)}
            href="https://www.producthunt.com/posts/socode-pro"
            target="_blank"
            rel="noopener noreferrer">
            <FontAwesomeIcon icon={faProductHunt} />
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
            <img src={wechatQRUrl} alt="wechat" />
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

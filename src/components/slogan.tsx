import React, { useState } from "react"
import { Link } from "react-router-dom"
import cs from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons"
import { InterfaceLanguage } from "../utils/language"
import useIntl, { Words } from "../utils/useIntl"
import { Settings } from "../models/profile"
import { useStoreState } from "../Store"
import css from "./slogan.module.scss"

const Slogan: React.FC = (): JSX.Element => {
  const slogon = useIntl(Words.ASearchEngineForProgrammers)
  const privacyPolicy = useIntl(Words.PrivacyPolicy)
  const [displayTips, setDisplayTips] = useState(false)

  const { language } = useStoreState<Settings>((state) => state.profile.settings)

  return (
    <div className={css.slogan}>
      <span className={cs({ [css.zh]: language === InterfaceLanguage.中文 })}>{slogon}</span>
      <div className={cs("dropdown is-right", css.scdropdown, { "is-active": displayTips })}>
        <FontAwesomeIcon icon={faQuestionCircle} className={css.scicon} onClick={() => setDisplayTips(!displayTips)} />
        <div className="dropdown-menu" style={{ width: 300 }}>
          <div className="dropdown-content">
            <div className="dropdown-item">
              {language !== InterfaceLanguage.中文 ? (
                <p>
                  socode is a privacy-respecting, hackable google search by{" "}
                  <a href="https://github.com/asciimoo/searx" target="_blank" rel="noopener noreferrer">
                    searx
                  </a>
                  . convenient for users who do not have access to google.com (such as Chinese users).
                </p>
              ) : (
                <p>
                  socode 搜索是一个使用
                  <a href="https://github.com/asciimoo/searx" target="_blank" rel="noopener noreferrer">
                    searx
                  </a>
                  构建的google搜索代理，限定了搜索范围。仅用于给无法访问google.com的用户方便地搜索编程问答信息，请不要用于其它需求场合。
                </p>
              )}
            </div>
            <hr className="dropdown-divider" />
            <Link to="/Privacy" className={cs(css.navlink, css.privacy, "dropdown-item")}>
              <h3>{privacyPolicy}</h3>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={cs("mask", { "dis-none": !displayTips })}
        onClick={() => {
          setDisplayTips(false)
        }}
      />
    </div>
  )
}

export default Slogan

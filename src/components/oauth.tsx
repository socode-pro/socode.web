import React, { useState, useCallback } from "react"
import cs from "classnames"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { InterfaceLanguage } from "../utils/language"
import { useStoreState } from "../Store"
import css from "./oauth.module.scss"

const Slogan: React.FC = (): JSX.Element => {
  const [displayTips, setDisplayTips] = useState(false)
  const language = useStoreState<InterfaceLanguage | undefined>((state) => state.profile.settings.language)

  return (
    <div className={css.oauthbar}>
      <a className={cs("button", "is-warning", "is-small")} href={`${process.env.REACT_APP_NEST}/auth/github`}>
        <FontAwesomeIcon icon={faGithub} className={css.gicon} />
        OAuth for token
      </a>
      <div className={cs("dropdown is-right", css.scdropdown, { "is-active": displayTips })}>
        <span className={css.why} onClick={() => setDisplayTips(!displayTips)}>
          {/* why */}
          <FontAwesomeIcon icon={faQuestionCircle} className={css.scicon} />
        </span>

        <div className="dropdown-menu" style={{ width: 300 }}>
          <div className="dropdown-content">
            <div className="dropdown-item">
              {language !== InterfaceLanguage.中文 ? (
                <>
                  <p>
                    Data for each repository star history requires a maximum of 30 github api requests. There can only
                    make up to 60 requests per hour without github authentication.
                  </p>
                  <p>
                    So Github Stars need your OAuth to get token for requests. In this way, each user&apos;s token can
                    make up to <a href="https://developer.github.com/v3/#rate-limiting">5000 requests per hour</a>.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    每个repository的star记录最多需要30次GitHub
                    API请求，在没有GitHub授权token的情况下，每小时最多只能发出60个请求。
                  </p>
                  <p>
                    所以 Github Stars 需要您的OAuth授权token。这样每个用户的令牌每小时最多可以发出
                    <a href="https://developer.github.com/v3/#rate-limiting">5000个请求</a>。
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={cs("mask", { "dis-none": !displayTips })} onClick={() => setDisplayTips(false)} />
    </div>
  )
}

export default Slogan

import React, { useState, useEffect, useCallback, useRef, useMemo, Fragment } from "react"
import cs from "classnames"
import Fuse from "fuse.js"
import html2canvas from "html2canvas"
import Highcharts from "highcharts"
import Chartkick, { LineChart } from "react-chartkick"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImage, faWindowClose, faUserCircle } from "@fortawesome/free-regular-svg-icons"
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons"
import { faGithub } from "@fortawesome/free-brands-svg-icons"
import { Stack, StackType } from "../utils/historystacks"
import { useStoreActions, useStoreState } from "../Store"
import { IntEnumObjects } from "../utils/assist"
import OAuth from "./oauth"
import { Profile } from "../models/profile"
import { DisplayType } from "../models/stars"
import { Repository } from "../services/stars.service"
import { InterfaceLanguage } from "../utils/language"
import css from "./stars.module.scss"
import Loader from "./loader/loader1"

const fuseOptions: Fuse.IFuseOptions<Stack> = {
  keys: ["name", "repos"],
  threshold: 0.3,
}

Chartkick.use(Highcharts)

const highchartsConfig = {
  tooltip: {
    xDateFormat: "%Y-%m-%d",
  },
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
}

const displayTypeOptions = IntEnumObjects(DisplayType)

interface Props {
  query: string
}

const Stars: React.FC<Props> = ({ query }: Props): JSX.Element => {
  // const initialPresetStacks = useStoreActions(actions => actions.stars.initialPresetStacks)
  const initialCurrentStack = useStoreActions((actions) => actions.stars.initialCurrentStack)
  useEffect(() => {
    // initialPresetStacks()
    initialCurrentStack()
  }, [initialCurrentStack])

  const language = useStoreState<InterfaceLanguage | undefined>((state) => state.profile.settings.language)
  const profile = useStoreState<Profile | null>((state) => state.profile.profile)
  const displayType = useStoreState<DisplayType>((state) => state.stars.displayType)
  const privateStacks = useStoreState<Array<Stack>>((state) => state.stars.privateStacks)
  const displayStacks = useStoreState<Array<Stack>>((state) => state.stars.displayStacks)
  const backStacks = useStoreState<Array<Stack>>((state) => state.stars.backStacks)
  const frontStacks = useStoreState<Array<Stack>>((state) => state.stars.frontStacks)
  const hiddenStacks = useStoreState<Array<Stack>>((state) => state.stars.hiddenStacks)
  const currentStack = useStoreState<Stack | null>((state) => state.stars.currentStack)
  const repositorys = useStoreState<Array<Repository>>((state) => state.stars.repositorys)
  const loading = useStoreState<boolean>((state) => state.stars.loading)

  const setDisplayType = useStoreActions((actions) => actions.stars.setDisplayType)
  const addHiddenStack = useStoreActions((actions) => actions.stars.addHiddenStack)
  const removeHiddenStack = useStoreActions((actions) => actions.stars.removeHiddenStack)
  const addPrivateStack = useStoreActions((actions) => actions.stars.addPrivateStack)
  const removePrivateStack = useStoreActions((actions) => actions.stars.removePrivateStack)
  const addPrivateStackRepoAndData = useStoreActions((actions) => actions.stars.addPrivateStackRepoAndData)
  const removePrivateStackRepo = useStoreActions((actions) => actions.stars.removePrivateStackRepo)
  const selectStack = useStoreActions((actions) => actions.stars.selectStack)

  const [inputStackName, setInputStackName] = useState<string>("")
  const [inputRepoName, setInputRepoName] = useState<string>("")
  const [queryStacks, setQueryStacks] = useState(displayStacks)

  const chartEl = useRef<HTMLElement>(null)

  useEffect(() => {
    if (query !== "") {
      const fuse = new Fuse(displayStacks, fuseOptions)
      const result = fuse.search<Stack>(query).map((r) => r.item)
      setQueryStacks(result)
    } else {
      setQueryStacks([])
    }
  }, [displayStacks, query])

  const submitRepo = useCallback(
    (stackid) => {
      if (inputRepoName) {
        addPrivateStackRepoAndData({ stackid, repo: inputRepoName })
        setInputRepoName("")
      }
    },
    [addPrivateStackRepoAndData, inputRepoName]
  )

  const Repositories = useCallback(
    (s: Stack) => {
      return (
        <div className={css.repos}>
          {s.repos.map((repo) => (
            <p key={repo} className={css.repo}>
              <a href={`https://github.com/${repo}`} target="_blank" rel="noopener noreferrer">
                {repo}
              </a>
              {s.type === StackType.Private && (
                <FontAwesomeIcon
                  icon={faWindowClose}
                  onClick={() => {
                    removePrivateStackRepo({ stackid: s.id, repo })
                  }}
                  className={css.faclose}
                />
              )}
            </p>
          ))}
          {s.type === StackType.Private && (
            <div className="field has-addons">
              <p className="control is-expanded">
                <input
                  className="input is-small"
                  type="text"
                  placeholder="username/repositorie"
                  value={inputRepoName}
                  onChange={(e) => setInputRepoName(e.target.value)}
                />
              </p>
              <p className="control">
                <a className="button is-info is-small" onClick={() => submitRepo(s.id)}>
                  Add
                </a>
              </p>
            </div>
          )}
        </div>
      )
    },
    [inputRepoName, removePrivateStackRepo, submitRepo]
  )

  const downloadImage = useCallback(() => {
    if (!chartEl.current) return
    html2canvas((chartEl.current as any).element).then((canvas) => {
      const link = document.createElement("a")
      link.download = `${currentStack?.name || "stars"}.png`
      link.href = canvas.toDataURL()
      link.click()
    })
  }, [currentStack?.name])

  const LineChartMemoized = useMemo(() => {
    return (
      <LineChart
        innerRef={chartEl}
        library={highchartsConfig}
        data={repositorys}
        height="800px"
        width="100%"
        ytitle="Stars"
      />
    )
  }, [repositorys])

  return (
    <div className={cs("columns", css.history)}>
      <div className={cs("column", "is-one-quarter")}>
        <nav className="panel">
          <p className="panel-tabs">
            {displayTypeOptions.map((o) => (
              <a
                key={o.value}
                className={cs({ "is-active": displayType === o.value })}
                onClick={() => setDisplayType(o.value)}>
                {o.label}
              </a>
            ))}
          </p>

          <div className={css.stacks}>
            {displayType === DisplayType.Private && (
              <div className="panel-block field has-addons">
                <p className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    placeholder="stack name"
                    value={inputStackName}
                    onChange={(e) => setInputStackName(e.target.value)}
                  />
                </p>
                <p className={cs("control", css.button)}>
                  <a
                    className="button is-info"
                    onClick={() => inputStackName && addPrivateStack({ name: inputStackName })}>
                    Create
                  </a>
                </p>
              </div>
            )}

            {query !== "" &&
              queryStacks.map((s) => (
                <Fragment key={s.id}>
                  <a
                    className={cs("panel-block", css.stack, { "is-active": s.id === currentStack?.id })}
                    onClick={() => selectStack(s)}>
                    <span className="panel-icon">
                      {s.type === StackType.Private && <FontAwesomeIcon icon={faUserCircle} aria-hidden="true" />}
                      {s.type !== StackType.Private && <FontAwesomeIcon icon={faLayerGroup} aria-hidden="true" />}
                    </span>
                    {language === InterfaceLanguage.中文 ? s.nameChinese || s.name : s.name}
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (s.type === StackType.Private) {
                          removePrivateStack(s.id)
                        } else {
                          addHiddenStack(s.id)
                        }
                      }}
                      className={css.faclose}
                    />
                  </a>
                  {s.id === currentStack?.id && Repositories(s)}
                </Fragment>
              ))}
            {query === "" &&
              displayType === DisplayType.Backend &&
              backStacks.map((s) => (
                <Fragment key={s.id}>
                  <a
                    className={cs("panel-block", css.stack, { "is-active": s.id === currentStack?.id })}
                    onClick={() => selectStack(s)}>
                    <span className="panel-icon">
                      {s.type === StackType.Private && <FontAwesomeIcon icon={faUserCircle} aria-hidden="true" />}
                      {s.type !== StackType.Private && <FontAwesomeIcon icon={faLayerGroup} aria-hidden="true" />}
                    </span>
                    {language === InterfaceLanguage.中文 ? s.nameChinese || s.name : s.name}
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (s.type === StackType.Private) {
                          removePrivateStack(s.id)
                        } else {
                          addHiddenStack(s.id)
                        }
                      }}
                      className={css.faclose}
                    />
                  </a>
                  {s.id === currentStack?.id && Repositories(s)}
                </Fragment>
              ))}
            {query === "" &&
              displayType === DisplayType.Frontend &&
              frontStacks.map((s) => (
                <Fragment key={s.id}>
                  <a
                    className={cs("panel-block", css.stack, { "is-active": s.id === currentStack?.id })}
                    onClick={() => selectStack(s)}>
                    <span className="panel-icon">
                      {s.type === StackType.Private && <FontAwesomeIcon icon={faUserCircle} aria-hidden="true" />}
                      {s.type !== StackType.Private && <FontAwesomeIcon icon={faLayerGroup} aria-hidden="true" />}
                    </span>
                    {language === InterfaceLanguage.中文 ? s.nameChinese || s.name : s.name}
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (s.type === StackType.Private) {
                          removePrivateStack(s.id)
                        } else {
                          addHiddenStack(s.id)
                        }
                      }}
                      className={css.faclose}
                    />
                  </a>
                  {s.id === currentStack?.id && Repositories(s)}
                </Fragment>
              ))}
            {query === "" &&
              displayType === DisplayType.Private &&
              privateStacks.map((s) => (
                <Fragment key={s.id}>
                  <a
                    className={cs("panel-block", css.stack, { "is-active": s.id === currentStack?.id })}
                    onClick={() => selectStack(s)}>
                    <span className="panel-icon">
                      <FontAwesomeIcon icon={faUserCircle} aria-hidden="true" />
                    </span>
                    {language === InterfaceLanguage.中文 ? s.nameChinese || s.name : s.name}
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (window.confirm("Will be deleted!")) removePrivateStack(s.id)
                      }}
                      className={css.faclose}
                    />
                  </a>
                  {s.id === currentStack?.id && Repositories(s)}
                </Fragment>
              ))}
            {query === "" &&
              displayType === DisplayType.Hidden &&
              hiddenStacks.map((s) => (
                <Fragment key={s.id}>
                  <a
                    className={cs("panel-block", css.stack, { "is-active": s.id === currentStack?.id })}
                    onClick={() => selectStack(s)}>
                    <span className="panel-icon">
                      <FontAwesomeIcon icon={faLayerGroup} aria-hidden="true" />
                    </span>
                    {language === InterfaceLanguage.中文 ? s.nameChinese || s.name : s.name}
                    <FontAwesomeIcon
                      icon={faWindowClose}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeHiddenStack(s.id)
                      }}
                      className={css.faclose}
                    />
                  </a>
                  {s.id === currentStack?.id && Repositories(s)}
                </Fragment>
              ))}
          </div>
        </nav>
      </div>
      <div className={cs("column", "pos-relative")}>
        <div className={css.topbar}>
          {currentStack && (
            <a className={cs("button", "is-info", "is-small", "mgr10")} onClick={downloadImage}>
              <FontAwesomeIcon icon={faImage} className="mgr5" />
              Download Image
            </a>
          )}
          {!profile?.githubToken && <OAuth />}
        </div>

        {loading && (
          <div className={css.loading}>
            <Loader type={1} />
          </div>
        )}

        {LineChartMemoized}

        <div className={cs(css.footer)}>
          <a href="https://github.com/elliotreborn/github-stars" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} className={css.github} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Stars

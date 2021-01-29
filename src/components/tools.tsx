import React, { useState, useEffect } from "react"
import ky from "ky"
import cs from "classnames"
import Fuse from "fuse.js"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons"
import { Link, ToolCategory, Grids } from "../utils/tools_data"
import css from "./tools.module.scss"

interface Props {
  query: string
}

const fuseOptions: Fuse.IFuseOptions<Link> = {
  keys: ["name", "label", "title"],
  threshold: 0.4,
  minMatchCharLength: 2,
  useExtendedSearch: true,
}

const Tools: React.FC<Props> = ({ query }: Props): JSX.Element => {
  const [grids, setGrids] = useState(Grids)
  const playground = grids.filter((g) => g.category === ToolCategory.Playground)
  const playgroundBackend = grids.filter((g) => g.category === ToolCategory.PlaygroundBackend)
  const generator = grids.filter((g) => g.category === ToolCategory.Generator)
  const converter = grids.filter((g) => g.category === ToolCategory.Converter)
  const unitConverter = grids.filter((g) => g.category === ToolCategory.UnitConverter)
  const validator = grids.filter((g) => g.category === ToolCategory.Validator)
  const strings = grids.filter((g) => g.category === ToolCategory.String)
  const encodes = grids.filter((g) => g.category === ToolCategory.Encode)
  const diffs = grids.filter((g) => g.category === ToolCategory.Diff)
  const minifier = grids.filter((g) => g.category === ToolCategory.Minifier)
  const others = grids.filter((g) => g.category === undefined)

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const data = await ky.get(`${process.env.REACT_APP_KEYS_HOST}/toolsgrids.json`).json<Array<Link>>()
        if (data !== null) {
          setGrids(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (!query) {
      setGrids(Grids)
    } else {
      const fuse = new Fuse(Grids, fuseOptions)
      const result = fuse.search<Link>(query).map((r) => r.item)
      setGrids(result)
    }
  }, [query])

  return (
    <div className={cs(css.grid)}>
      <div className="tile">
        <div className="tile is-vertical is-9">
          <div className="tile">
            <div className="tile is-parent is-6">
              <article className="tile is-child">
                <p className="title is-5">Playground</p>
                <div className={cs(css.collection, "content")}>
                  {playground.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child">
                <p className="title is-5">Generator</p>
                <div className={cs(css.collection, "content")}>
                  {generator.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>
          </div>

          <div className="tile">
            <div className="tile is-parent">
              <article className="tile is-child">
                <p className="title is-5">Playground Backend</p>
                <div className={cs(css.collection, "content")}>
                  {playgroundBackend.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>

            <div className="tile is-parent is-6">
              <article className="tile is-child">
                <p className="title is-5">Validators</p>
                <div className={cs(css.collection, "content")}>
                  {validator.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>
          </div>

          <div className="tile">
            <div className="tile is-parent">
              <article className="tile is-child">
                <p className="title is-5">Minifier/Optimizer</p>
                <div className={cs(css.collection, "content")}>
                  {minifier.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>
            <div className="tile is-parent">
              <article className="tile is-child">
                <p className="title is-5">Diff</p>
                <div className={cs(css.collection, "content")}>
                  {diffs.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>
          </div>

          <div className="tile">
            <div className="tile is-vertical is-6">
              <div className="tile is-parent">
                <article className="tile is-child">
                  <p className="title is-5">String</p>
                  <div className={cs(css.collection, "content")}>
                    {strings.map((a) => {
                      return (
                        <a
                          key={a.href}
                          title={a.title || a.label}
                          className={cs({ [css.elite]: a.elite })}
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer">
                          {a.name}
                          {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                        </a>
                      )
                    })}
                  </div>
                </article>
              </div>
              <div className="tile is-parent">
                <article className="tile is-child">
                  <p className="title is-5">Encode/Escape</p>
                  <div className={cs(css.collection, "content")}>
                    {encodes.map((a) => {
                      return (
                        <a
                          key={a.href}
                          title={a.title || a.label}
                          className={cs({ [css.elite]: a.elite })}
                          href={a.href}
                          target="_blank"
                          rel="noopener noreferrer">
                          {a.name}
                          {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                        </a>
                      )
                    })}
                  </div>
                </article>
              </div>
            </div>

            <div className="tile is-parent">
              <article className="tile is-child">
                <p className="title is-5">Unit Converter</p>
                <div className={cs(css.collection, "content")}>
                  {unitConverter.map((a) => {
                    return (
                      <a
                        key={a.href}
                        title={a.title || a.label}
                        className={cs({ [css.elite]: a.elite })}
                        href={a.href}
                        target="_blank"
                        rel="noopener noreferrer">
                        {a.name}
                        {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                      </a>
                    )
                  })}
                </div>
              </article>
            </div>
          </div>
        </div>

        <div className="tile is-vertical">
          <div className="tile is-parent">
            <article className="tile is-child">
              <p className="title is-5">Converter</p>
              <div className={cs(css.collection, "content")}>
                {converter.map((a) => {
                  return (
                    <a
                      key={a.href}
                      title={a.title || a.label}
                      className={cs({ [css.elite]: a.elite })}
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer">
                      {a.name}
                      {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                    </a>
                  )
                })}
              </div>
            </article>
          </div>

          <div className="tile is-parent">
            <article className="tile is-child">
              <p className="title is-5">Other</p>
              <div className={cs(css.collection, "content")}>
                {others.map((a) => {
                  return (
                    <a
                      key={a.href}
                      title={a.title || a.label}
                      className={cs({ [css.elite]: a.elite })}
                      href={a.href}
                      target="_blank"
                      rel="noopener noreferrer">
                      {a.name}
                      {a.elite && <FontAwesomeIcon icon={faThumbsUp} />}
                    </a>
                  )
                })}
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tools

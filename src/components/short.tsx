import React, { useState, useEffect, useRef } from "react"
import ky, { HTTPError } from "ky"
import debounce from "lodash/debounce"
import ClipboardJS from "clipboard"
import cs from "classnames"
import { useStoreState } from "../Store"
import css from "./short.module.scss"
import { DebouncedFunc } from "lodash"

interface RelResp {
  hashid: string
  url: string
  created_at: string
}

const Short: React.FC = (): JSX.Element => {
  const query = useStoreState<string>((state) => state.search.query)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [shorturl, setShorturl] = useState("")
  const [tooltips, setTooltips] = useState(false)

  const debounceQuery = useRef<DebouncedFunc<(value: string) => Promise<void>>>(
    debounce<(value: string) => Promise<void>>(async (value: string) => {
      if (!value) return
      try {
        setError("")
        setTooltips(false)
        setLoading(true)
        const params = new URLSearchParams()
        params.set("url", value)
        const resp = await ky
          .post("https://rel.ink/api/links/", { body: params, throwHttpErrors: false })
          .json<RelResp>()
        if (resp.hashid) {
          setShorturl(`https://rel.ink/${resp.hashid}`)
        } else {
          setError(resp.url)
          setShorturl("")
        }
      } catch (err) {
        const error = err as HTTPError
        setError(error.message)
        setShorturl("")
      }
      setLoading(false)
    }, 1000)
  )

  useEffect(() => {
    debounceQuery.current(query)
  }, [query])

  useEffect(() => {
    const clipboard = new ClipboardJS("#shorturl")
    clipboard.on("success", (e) => {
      if (e.text) setTooltips(true)
    })
  }, [])

  return (
    <div className={cs(css.short)}>
      <p className={css.error}>{error}</p>
      <div
        className={cs(css.shorturlInput, "control is-medium has-tooltip-warning", { "is-loading": loading })}
        data-tooltip={tooltips ? "Copied!" : null}>
        <input
          id="shorturl"
          className="input is-medium"
          onClick={(e) => (e.target as HTMLInputElement).select()}
          value={shorturl}
          onChange={() => null}
          data-clipboard-target="#shorturl"
        />
      </div>
      <p className={css.powered}>
        powered by{" "}
        <a target="_blank" rel="noreferrer" href="https://rel.ink/">
          Relink
        </a>
      </p>
    </div>
  )
}

export default Short

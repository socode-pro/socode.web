import React, { useState, useEffect, useRef } from "react"
import ky from "ky"
import debounce from "lodash/debounce"
import ClipboardJS from "clipboard"
import cs from "classnames"
import { useStoreState } from "../Store"
import css from "./short.module.scss"

interface RelResp {
  hashid: string
  url: string
  created_at: string
}

const Short: React.FC = (): JSX.Element => {
  const query = useStoreState<string>((state) => state.search.query)

  const [error, setError] = useState("")
  const [shorturl, setShorturl] = useState("")
  const [tooltips, setTooltips] = useState(false)

  const debounceQuery = useRef<(value: string) => Promise<void>>(
    debounce<(value: string) => Promise<void>>(async (value) => {
      if (!value) return
      try {
        setError("")
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
        setError(err.message)
      }
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
      <p>The short url for {query}:</p>
      <p className={css.error}>{error}</p>
      <div className={cs(css.shorturlInput, "has-tooltip-warning")} data-tooltip={tooltips ? "Copied!" : null}>
        <input
          id="shorturl"
          className="input"
          onClick={(e) => (e.target as HTMLInputElement).select()}
          value={shorturl}
          onChange={() => null}
          data-clipboard-target="#shorturl"
        />
      </div>
    </div>
  )
}

export default Short

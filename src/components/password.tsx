import React, { useState, useCallback, useEffect } from "react"
import ClipboardJS from "clipboard"
import cs from "classnames"
import css from "./password.module.scss"

const passwordLengths = Array.from(Array(27).keys()).map((n) => n + 6)
const lowerCase = "abcdefghijklmnopqrstuvwxyz"
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"
const special = "!@#$%^&*()_+~`|}{[]:;?><,./-="

const random = (): number => {
  const { crypto, Uint32Array } = window
  if (typeof crypto?.getRandomValues === "function" && typeof Uint32Array === "function") {
    // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
    return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295
  }

  return Math.random()
}

const keyGen = (length, useLowerCase = true, useUpperCase = true, useNumbers = true, useSpecial = true): string => {
  let chars = ""
  let key = ""

  if (useLowerCase) chars += lowerCase
  if (useUpperCase) chars += upperCase
  if (useNumbers) chars += numbers
  if (useSpecial) chars += special

  Array.from(Array(length).keys()).forEach(() => {
    key += chars[Math.floor(random() * chars.length)]
  })

  return key
}

const Password: React.FC = (): JSX.Element => {
  const [length, setLength] = useState(8)
  const [useLowerCase, setUseLowerCase] = useState(true)
  const [useUpperCase, setUseUpperCase] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSpecial, setUseSpecial] = useState(true)
  const [password, setPassword] = useState("")
  const [tooltips, setTooltips] = useState(false)

  useEffect(() => {
    const clipboard = new ClipboardJS("#password")
    clipboard.on("success", (e) => {
      console.info("Text:", e.text)
      if (e.text) setTooltips(true)
    })
  }, [])

  const Generate = useCallback(
    ({
      _length = length,
      _useLowerCase = useLowerCase,
      _useUpperCase = useUpperCase,
      _useDigits = useDigits,
      _useSpecial = useSpecial,
    }) => {
      setLength(_length)
      setUseLowerCase(_useLowerCase)
      setUseUpperCase(_useUpperCase)
      setUseDigits(_useDigits)
      setUseSpecial(_useSpecial)
      setPassword(keyGen(_length, _useLowerCase, _useUpperCase, _useDigits, _useSpecial))
      setTooltips(false)
    },
    [length, useDigits, useLowerCase, useSpecial, useUpperCase]
  )

  return (
    <div className={cs(css.password)}>
      <div className={css.forms}>
        <span className="mgr10">Length</span>
        <div className="select is-rounded">
          <select value={length} onChange={(e) => setLength(parseInt(e.target.value, 10))}>
            {passwordLengths.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={cs(css.forms, "mgt20")}>
        <div className="">
          <input
            className="is-checkradio is-circle"
            id="lowerCase"
            type="checkbox"
            checked={useLowerCase}
            onChange={(e) => setUseLowerCase(e.target.checked)}
          />
          <label htmlFor="lowerCase">LowerCase Letters(a..z)</label>
        </div>

        <div className="mgl5">
          <input
            className="is-checkradio is-circle"
            id="upperCase"
            type="checkbox"
            checked={useUpperCase}
            onChange={(e) => setUseUpperCase(e.target.checked)}
          />
          <label htmlFor="upperCase">UpperCase Letters(A..Z)</label>
        </div>

        <div className="mgl5">
          <input
            className="is-checkradio is-circle"
            id="digits"
            type="checkbox"
            checked={useDigits}
            onChange={(e) => setUseDigits(e.target.checked)}
          />
          <label htmlFor="digits">Digits(0..9)</label>
        </div>

        <div className="mgl5">
          <input
            className="is-checkradio is-circle"
            id="special"
            type="checkbox"
            checked={useSpecial}
            onChange={(e) => setUseSpecial(e.target.checked)}
          />
          <label htmlFor="special">Special Chars</label>
        </div>
      </div>

      <div className="mgt20">
        <a className="button is-primary mgb10" onClick={Generate}>
          Generate
        </a>

        <a
          className="button mgl10 mgb10"
          onClick={() =>
            Generate({ _length: 10, _useLowerCase: true, _useUpperCase: true, _useDigits: true, _useSpecial: false })
          }>
          Memorable Passwords
        </a>
        <a
          className="button mgl10 mgb10"
          onClick={() =>
            Generate({ _length: 15, _useLowerCase: true, _useUpperCase: true, _useDigits: true, _useSpecial: true })
          }>
          Strong Passwords
        </a>
        <a
          className="button mgl10 mgb10"
          onClick={() =>
            Generate({ _length: 30, _useLowerCase: true, _useUpperCase: true, _useDigits: true, _useSpecial: true })
          }>
          Fort Knox Passwords
        </a>
        <a
          className="button mgl10 mgb10"
          onClick={() =>
            Generate({ _length: 32, _useLowerCase: true, _useUpperCase: true, _useDigits: true, _useSpecial: false })
          }>
          CodeIgniter Encryption Keys
        </a>
        <a
          className="button mgl10 mgb10"
          onClick={() =>
            Generate({ _length: 20, _useLowerCase: true, _useUpperCase: true, _useDigits: true, _useSpecial: true })
          }>
          160-bit WPA Key
        </a>
      </div>

      <div className={cs(css.passwordInput, "has-tooltip-warning")} data-tooltip={tooltips ? "Copied!" : null}>
        <input
          id="password"
          className="input"
          onClick={(e) => (e.target as HTMLInputElement).select()}
          value={password}
          onChange={() => null}
          data-clipboard-target="#password"
        />
      </div>
    </div>
  )
}

export default Password

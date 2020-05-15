import React, { useState, useCallback } from "react"
import cs from "classnames"
import css from "./password.module.scss"

const passwordLengths = Array.from(Array(25).keys()).map((n) => n + 6)
const letters = "abcdefghijklmnopqrstuvwxyz"
const capitalLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const number = "0123456789"
const special = "!@#$%^&*()_+~`|}{[]:;?><,./-="

const Password: React.FC = (): JSX.Element => {
  const [length, setLength] = useState(8)
  const [useCapital, setUseCapital] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSpecial, setUseSpecial] = useState(true)
  const [password, setPassword] = useState("")

  const Generate = useCallback(() => {
    let n = ""
    for (n = ""; n.length < length; ) {
      const rand = Math.floor(4 * Math.random()) + 1
      if (rand === 1) {
        const entity1 = Math.ceil(letters.length * Math.random() * Math.random())
        n += letters.charAt(entity1)
      } else if (rand === 2) {
        const entity2 = Math.ceil(number.length * Math.random() * Math.random())
        useDigits && (n += number.charAt(entity2))
      } else if (rand === 3) {
        const entity3 = Math.ceil(special.length * Math.random() * Math.random())
        useSpecial && (n += special.charAt(entity3))
      } else {
        const entity4 = Math.ceil(capitalLetters.length * Math.random() * Math.random())
        useCapital && (n += capitalLetters.charAt(entity4))
      }
    }
    setPassword(n)
  }, [length, useCapital, useDigits, useSpecial])

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
            id="capital"
            type="checkbox"
            checked={useCapital}
            onChange={(e) => setUseCapital(e.target.checked)}
          />
          <label htmlFor="capital">Capital Letters(A..Z)</label>
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

      <a className="button is-primary mgt20" onClick={Generate}>
        Generate
      </a>

      <input
        className="input mgt20"
        onClick={(e) => (e.target as HTMLInputElement).select()}
        value={password}
        onChange={() => null}
      />
    </div>
  )
}

export default Password

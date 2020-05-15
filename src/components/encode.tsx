import React, { useState } from "react"
import cs from "classnames"
import sha256 from "crypto-js/sha256"
import md5 from "crypto-js/md5"
// import aes from "crypto-js/aes"
// import hmacSHA512 from "crypto-js/hmac-sha512"
import base64 from "crypto-js/enc-base64"
import Utf8 from "crypto-js/enc-utf8"
import css from "./encode.module.scss"

// https://gist.github.com/littlee/f726f61b1e0abd319da4
const PlainToUnicode = (text): string => {
  return text
    .split("")
    .map((value) => {
      const temp = value.charCodeAt(0).toString(16).toUpperCase()
      if (temp.length > 2) {
        return `\\u${temp}`
      }
      return value
    })
    .join("")
}

// https://stackoverflow.com/a/22021709/346701
const UnicodeToPlain = (text): string => {
  return text.replace(/\\u[\dA-F]{4}/gi, (match) => {
    return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16))
  })
}

const HtmlEncode = (html): string => {
  const a = document.createElement("a").appendChild(document.createTextNode(html))
  return (a.parentNode as HTMLElement).innerHTML
}

const HtmlDecode = (html): string => {
  const a = document.createElement("a")
  a.innerHTML = html
  return a.textContent || ""
}

const Region: React.FC = (): JSX.Element => {
  const [originalText, setOriginalText] = useState("")
  const [encodedText, setEncodedText] = useState("")
  return (
    <div className={cs(css.encode)}>
      <div className={css.textarea}>
        <textarea className="textarea" value={originalText} onChange={(e) => setOriginalText(e.target.value)} />
      </div>
      <div className={css.buttons}>
        <a className="button is-primary" onClick={() => setEncodedText(encodeURI(originalText))}>
          encodeURI &gt;
        </a>
        <a className="button mgb10" onClick={() => setOriginalText(decodeURI(encodedText))}>
          &lt; decodeURI
        </a>

        <a className="button is-primary" onClick={() => setEncodedText(base64.stringify(Utf8.parse(originalText)))}>
          Base64 &gt;
        </a>
        <a className="button mgb10" onClick={() => setOriginalText(Utf8.stringify(base64.parse(encodedText)))}>
          &lt; Plain
        </a>

        <a className="button is-primary" onClick={() => setEncodedText(PlainToUnicode(originalText))}>
          Unicode &gt;
        </a>
        <a className="button mgb10" onClick={() => setOriginalText(UnicodeToPlain(encodedText))}>
          &lt; Plain
        </a>

        <a className="button is-primary" onClick={() => setEncodedText(HtmlEncode(originalText))}>
          HtmlEncode &gt;
        </a>
        <a className="button mgb10" onClick={() => setOriginalText(HtmlDecode(encodedText))}>
          &lt; HtmlDecode
        </a>

        <a className="button is-primary mgb10" onClick={() => setEncodedText(sha256(originalText))}>
          SHA512 &gt;
        </a>

        <a className="button is-primary mgb10" onClick={() => setEncodedText(md5(originalText))}>
          md5 &gt;
        </a>

        {/* <a className="button is-primary" onClick={() => setEncodedText(aes.encrypt(originalText))}>
          AES &gt;
        </a>
        <a className="button mgb10" onClick={() => setOriginalText(aes.decrypt(encodedText))}>
          &lt; AES decrypt
        </a> */}
      </div>
      <div className={css.textarea}>
        <textarea className="textarea" value={encodedText} onChange={(e) => setEncodedText(e.target.value)} />
      </div>
    </div>
  )
}

export default Region

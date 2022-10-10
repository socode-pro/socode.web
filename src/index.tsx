import React from "react"
import ReactDOM from "react-dom"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import reportWebVitals from "./reportWebVitals"

ReactDOM.render(<App />, document.getElementById("root"))

// https://stackoverflow.com/a/58551905/346701
document.addEventListener("DOMContentLoaded", (e) => {
  if (!window.matchMedia) return

  const current = document.querySelectorAll('head > link[rel*="icon"][media]')
  current.forEach((icon: any) => {
    const match = window.matchMedia(icon.media)
    function swap() {
      if (match.matches) {
        current.forEach((c) => c.parentNode?.removeChild(c))
        document.head.appendChild(icon)
      }
    }
    match.addListener(swap)
    swap()
  })
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

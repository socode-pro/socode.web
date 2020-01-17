import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// https://stackoverflow.com/a/58551905/346701
document.addEventListener('DOMContentLoaded', e => {
  if (!window.matchMedia)
    return

  const current = document.querySelectorAll('head > link[rel*="icon"][media]')
  current.forEach((icon: any) => {
    const match = window.matchMedia(icon.media)
    function swap() {
      if (match.matches) {
        current.forEach(c => c.parentNode?.removeChild(c))
        document.head.appendChild(icon)
      }
    }
    match.addListener(swap)
    swap()
  })
})

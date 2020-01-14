import React from 'react'
import css from './loader3.module.scss'

// https://codepen.io/abergin/pen/XpwRpE
const Loader3: React.FC = (): JSX.Element => {

  return (
    <div className={css.container}>
    <div className={css.loader}>
      <svg>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2" result="gooey" />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
          </filter>
        </defs>
      </svg>
    </div>
    </div>
  );
}

export default Loader3
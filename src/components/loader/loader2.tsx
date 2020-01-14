import React from 'react'
import cs from 'classnames'
import css from './loader2.module.scss'

// https://codepen.io/golle404/pen/oxpmbM
const Loader2: React.FC<{ type: number }> = ({ type }: { type: number }): JSX.Element => {

  return (
    <div className={css.container}>
      {type === 1 && <div className={cs(css.cell, css.type1)}>
        <div className={css.loader}>
        {Array.from(Array(23).keys()).map(i => (
          <div key={i} className={css.dot} />
        ))}
        </div>
      </div>}

      {type === 2 && <div className={cs(css.cell, css.type2)}>
        <div className={css.loader}>
        {Array.from(Array(23).keys()).map(i => (
          <div key={i} className={css.dot} />
        ))}
        </div>
      </div>}

      {type === 3 && <div className={cs(css.cell, css.type3)}>
        <div className={css.loader}>
        {Array.from(Array(23).keys()).map(i => (
          <div key={i} className={css.dot} />
        ))}
        </div>
      </div>}

      {type === 4 && <div className={cs(css.cell, css.type4)}>
        <div className={css.loader}>
        {Array.from(Array(23).keys()).map(i => (
          <div key={i} className={css.dot} />
        ))}
        </div>
      </div>}
    </div>
  );
}

export default Loader2
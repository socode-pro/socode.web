import React, { useEffect } from 'react'
import cs from 'classnames'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { TrendingRange } from '../models/trending'
import { IntEnumObjects, StringEnumObjects } from '../utils/assist'
import { ProgramLanguage, TrendingSpokenLanguage } from '../utils/language'
import css from './trending.module.scss'
import Loader from './loader/loader1'

const trendingRangeOptions = StringEnumObjects(TrendingRange)
const programLanguageOptions = IntEnumObjects(ProgramLanguage, 'language:')
const spokenLanguageOptions = StringEnumObjects(TrendingSpokenLanguage, 'spoken:')

const Trending: React.FC = (): JSX.Element => {
  const { loading, repositories, language, spoken, since, url } = useStoreState(state => state.trending)
  const { setLanguage, setSpoken, setSince, fetch } = useStoreActions(actions => actions.trending)

  useEffect(() => {
    fetch()
  }, [fetch, language, since, spoken])

  return (
    <div className={cs(css.trending)}>
      <div className={css.header}>
        <div className='select is-small'>
          <select value={spoken} onChange={e => setSpoken(e.target.value as TrendingSpokenLanguage)}>
            {spokenLanguageOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className='select is-small'>
          <select value={language} onChange={e => setLanguage(parseInt(e.target.value, 10))}>
            {programLanguageOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className='select is-small'>
          <select value={since} onChange={e => setSince(e.target.value as TrendingRange)}>
            {trendingRangeOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <Loader type={2} gray />}

      {!loading && <ul className={css.result}>
        {repositories.map(r => (
          <li key={r.author + r.name}>
            <h4>
              <a href={r.url} target='_blank' rel='noopener noreferrer'>
                {r.author}/{r.name}
              </a>
              <span className={css.righter}>
                <span className={css.stars}><span className={css.allstars}>★{r.stars}</span>+{r.currentPeriodStars}</span>
              </span>
            </h4>
            <p className={css.description}>
              {r.language && <span className={css.language}>{r.language}</span>}
              {r.description}</p>
          </li>
        ))}
      </ul>}

      <a className={css.more} href={url} target='_blank' rel='noopener noreferrer'>READ MORE...</a>
    </div>
  )
}

export default Trending

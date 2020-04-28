import React, { useEffect } from 'react'
import cs from 'classnames'
import { useStoreActions, useStoreState } from '../utils/hooks'
import { TrendingSince } from '../models/trending'
import { IntEnumObjects, StringEnumObjects } from '../utils/assist'
import { ProgramLanguage, TrendingSpokenLanguage } from '../utils/language'
import css from './trending.module.scss'
import Loader from './loader/loader1'

const trendingSinceOptions = StringEnumObjects(TrendingSince)
const programLanguageOptions = IntEnumObjects(ProgramLanguage, 'language:')
const spokenLanguageOptions = StringEnumObjects(TrendingSpokenLanguage, 'spoken:')

const Trending: React.FC = (): JSX.Element => {
  const { loading, list, spoken, since } = useStoreState(state => state.trending)
  const { setSpoken, setSince, fetch, onReadMore } = useStoreActions(actions => actions.trending)
  const { programLanguage } = useStoreState(state => state.storage)
  const setProgramLanguage = useStoreActions(actions => actions.storage.setProgramLanguage)

  useEffect(() => {
    fetch()
  }, [])

  return (
    <div className={cs(css.trending)}>
      <div className={cs(css.container)}>
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
            <select value={programLanguage} onChange={e => setProgramLanguage(parseInt(e.target.value, 10))}>
              {programLanguageOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className='select is-small'>
            <select value={since} onChange={e => setSince(e.target.value as TrendingSince)}>
              {trendingSinceOptions.map(o => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && <Loader type={2} gray />}

        {!loading && <ul className={css.result}>
          {list.map(r => (
            <li key={r.author + r.name}>
              <h4>
                <a href={r.url} target='_blank' rel='noopener noreferrer'>
                  <span>{r.author}/</span>{r.name}
                </a>
                <span className={css.stars}>
                  <span className={css.allstars}>★{r.stars}</span>
                  +{r.currentPeriodStars}
                </span>
              </h4>
              <p className={css.description}>
                {r.language && <span className={css.language}>{r.language}</span>}
                {r.description}</p>
            </li>
          ))}
        </ul>}

        {!loading && <a className={css.more} onClick={() => onReadMore()}>READ MORE...</a>}
      </div>
    </div>
  )
}

export default Trending

import React, { useState, useEffect, useCallback, useRef, useMemo, Fragment } from 'react'
import cs from 'classnames'
import { spokenLanguages, fetchRepositories } from '@huchenme/github-trending'
import { IntEnumObjects, StringEnumObjects } from '../utils/assist'
import { ProgramLanguage } from '../utils/language'
import css from './trending.module.scss'
import Loader from './loader/loader1'

interface Repository {
  author: string,
  name: string,
  avatar: string,
  url: string,
  description: string,
  language: string,
  languageColor: string,
  stars: number,
  forks: number,
  currentPeriodStars: number,
  builtBy: {
    href: string,
    avator: string,
    username: string,
  }
}

enum TrendingRange {
  Daily = 'daily',
  Weekly = 'weekly ',
  Monthly = 'monthly',
}

const trendingRangeOptions = StringEnumObjects(TrendingRange)
const programLanguageOptions = IntEnumObjects(ProgramLanguage)
const spokenLanguageEnums: Array<{ label: string, value: string }> = [{ label: 'Any', value: '' }].concat(spokenLanguages.map(o => ({ label: o.name, value: o.name })))

const Trending: React.FC = (): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(false)
  const [repositories, setRepositories] = useState<Array<Repository>>([])
  const [language, setLanguage] = useState<ProgramLanguage>(ProgramLanguage.All)
  const [spoken, setSpoken] = useState('')
  const [since, setSince] = useState<TrendingRange>(TrendingRange.Weekly)
  
  useEffect(() => {
    setLoading(true)
    const parms = language === ProgramLanguage.All? { spoken, since }: { spoken, since, language: ProgramLanguage[language] }
    fetchRepositories(parms)
      .then(data => { setLoading(false); setRepositories(data) })
      .catch(err => { setLoading(false); console.error(err) })
  }, [language, since, spoken])

  return (
    <div className={cs(css.trending)}>
      <div className={css.header}>
        <h3>Trending</h3>
        <div className='select mgl10'>
          <select value={spoken} onChange={e => setSpoken(e.target.value)}>
            {spokenLanguageEnums.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className='select mgl10'>
          <select value={language} onChange={e => setLanguage(parseInt(e.target.value, 10))}>
            {programLanguageOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className='select mgl10'>
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
            {r.name}
          </li>
        ))}
      </ul>}
    </div>
  )
}

export default Trending

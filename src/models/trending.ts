import { Action, action, Thunk, thunk } from 'easy-peasy'
import { fetchRepositories, languages, spokenLanguages } from '@huchenme/github-trending'
import { ProgramLanguage, TrendingSpokenLanguage } from '../utils/language'

export enum TrendingRange {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

export interface Repository {
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

export interface TrendingModel {
  loading: boolean
  setLoading: Action<TrendingModel, boolean>

  repositories: Array<Repository>
  setRepositorys: Action<TrendingModel, Array<Repository>>

  language: ProgramLanguage
  setLanguage: Action<TrendingModel, ProgramLanguage>

  spoken: TrendingSpokenLanguage
  setSpoken: Action<TrendingModel, TrendingSpokenLanguage>

  since: TrendingRange
  setSince: Action<TrendingModel, TrendingRange>

  url: string
  setUrl: Action<TrendingModel, string>
  
  fetch: Thunk<TrendingModel>
}

const trendingModel: TrendingModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  repositories: [],
  setRepositorys: action((state, payload) => {
    state.repositories = payload
  }),

  language: parseInt(localStorage.getItem('programLanguage') || '0', 10),
  setLanguage: action((state, payload) => {
    state.language = payload
    localStorage.setItem('programLanguage', payload.toString())
  }),

  spoken: localStorage.getItem('trendingSpokenLanguage') as TrendingSpokenLanguage || TrendingSpokenLanguage.All,
  setSpoken: action((state, payload) => {
    state.spoken = payload
    localStorage.setItem('trendingSpokenLanguage', payload)
  }),

  since: localStorage.getItem('trendingRange') as TrendingRange || TrendingRange.Daily,
  setSince: action((state, payload) => {
    state.since = payload
    localStorage.setItem('trendingRange', payload)
  }),

  url: 'https://github.com/trending',
  setUrl: action((state, payload) => {
    state.url = payload
  }),

  fetch: thunk(async (actions, target, { getState }) => {
    const { language, spoken, since } = getState()
    actions.setLoading(true)
    const parms = language === ProgramLanguage.All ? { spoken, since } : { spoken, since, language: ProgramLanguage[language] }
    try {
      const data = await fetchRepositories(parms)
      actions.setRepositorys(data.slice(0,12))
    } catch (err) {
      console.error(err)
    }
    actions.setLoading(false)
    
    let url = 'https://github.com/trending/'
    const languageJson = languages.find(l => l.name === ProgramLanguage[language])
    if (languageJson) {
      url += languageJson.urlParam
    }
    const params = new URLSearchParams()
    params.set('since', since)
    const spokenJson = spokenLanguages.find(l => l.name === spoken)
    if (spokenJson) {
      params.set('spoken_language_code', spokenJson.urlParam)
    }
    actions.setUrl(`${url}?${params.toString()}`)
  }),
}

export default trendingModel

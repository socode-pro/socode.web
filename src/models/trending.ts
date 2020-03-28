import { Action, action, Thunk, thunk } from 'easy-peasy'
import { fetchRepositories } from '@huchenme/github-trending'
import { ProgramLanguage, TrendingSpokenLanguage } from '../utils/language'
import { StoreModel } from './index'

export enum TrendingSince {
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

  spoken: TrendingSpokenLanguage
  setSpoken: Action<TrendingModel, TrendingSpokenLanguage>

  since: TrendingSince
  setSince: Action<TrendingModel, TrendingSince>

  url: string
  setUrl: Action<TrendingModel, string>
  
  fetch: Thunk<TrendingModel, void, void, StoreModel>
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

  spoken: localStorage.getItem('trendingSpokenLanguage') as TrendingSpokenLanguage || TrendingSpokenLanguage.All,
  setSpoken: action((state, payload) => {
    state.spoken = payload
    localStorage.setItem('trendingSpokenLanguage', payload)
  }),

  since: localStorage.getItem('trendingRange') as TrendingSince || TrendingSince.Daily,
  setSince: action((state, payload) => {
    state.since = payload
    localStorage.setItem('trendingRange', payload)
  }),

  url: 'https://github.com/trending',
  setUrl: action((state, payload) => {
    state.url = payload
  }),

  fetch: thunk(async (actions, target, { getState, getStoreState }) => {
    const { spoken, since } = getState()
    const { programLanguage } = getStoreState().storage
    
    const language =  ProgramLanguage[programLanguage].toLowerCase().replace(' ', '-').replace('#', '%23')

    actions.setLoading(true)
    const parms = programLanguage === ProgramLanguage.All ?
      { spokenLanguageCode: spoken, since } :
      { spokenLanguageCode: spoken, since, language }
    try {
      const data = await fetchRepositories(parms)
      actions.setRepositorys(data.slice(0,12))

      let url = 'https://github.com/trending/'
      if (programLanguage !== ProgramLanguage.All) {
        url += language
      }
      const params = new URLSearchParams()
      params.set('since', since)
      if (spoken) {
        params.set('spoken_language_code', spoken)
      }
      actions.setUrl(`${url}?${params.toString()}`)
    } catch (err) {
      console.error(err)
    }
    actions.setLoading(false)
  }),
}

export default trendingModel

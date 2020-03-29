import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'
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

  spoken: localStorage.getItem('trendingSpoken') as TrendingSpokenLanguage || TrendingSpokenLanguage.All,
  setSpoken: action((state, payload) => {
    state.spoken = payload
    localStorage.setItem('trendingSpoken', payload)
  }),

  since: localStorage.getItem('trendingSince') as TrendingSince || TrendingSince.Daily,
  setSince: action((state, payload) => {
    state.since = payload
    localStorage.setItem('trendingSince', payload)
  }),

  url: 'https://github.com/trending',
  setUrl: action((state, payload) => {
    state.url = payload
  }),

  fetch: thunk(async (actions, target, { getState, getStoreState }) => {
    const { spoken, since } = getState()
    const { programLanguage } = getStoreState().storage
    const language =  ProgramLanguage[programLanguage].toLowerCase().replace(' ', '-').replace('#', '%23')

    const params = localStorage.getItem('repos_params')
    const times = localStorage.getItem('repos_times')
    if (
      params && params === spoken + language + since &&
      times && dayjs(times).add(2, 'hour').isAfter(dayjs())
    ) {
      const repos = JSON.parse(localStorage.getItem('repos') || '[]')
      actions.setRepositorys(repos)
    } else {
      actions.setLoading(true)
      try {
        const searchParams = new URLSearchParams()
        searchParams.set('spoken_language_code', spoken)
        searchParams.set('since', since)
        if (programLanguage !== ProgramLanguage.All) {
          searchParams.set('language', language)
        }
        const data = await ky.get('https://github-trending-api.now.sh/repositories', { searchParams }).json<Array<Repository>>()
        localStorage.setItem('repos_params', spoken + language + since)
        localStorage.setItem('repos_times', dayjs().toJSON())
        localStorage.setItem('repos', JSON.stringify(data.slice(0,12)))
        actions.setRepositorys(data.slice(0,12))
      } catch (err) {
        console.error(err)
      }
      actions.setLoading(false)
    }

    const urlparams = new URLSearchParams()
    urlparams.set('since', since)
    if (spoken) {
      urlparams.set('spoken_language_code', spoken)
    }
    actions.setUrl(`https://github.com/trending/${programLanguage !== ProgramLanguage.All? language: ''}?${urlparams.toString()}`)
  }),
}

export default trendingModel

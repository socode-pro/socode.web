import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'
import { InterfaceLanguage, ProgramLanguage } from '../utils/language'
import { warn } from '../utils/toast'

export enum DarkMode {
  light,
  flowSystem,
  dark,
}

export interface SettingsType {
  language?: InterfaceLanguage
  openNewTab?: boolean
  displayTrending?: boolean
  darkMode?: DarkMode
}

const defaultSettings = (): SettingsType => {
  const defaultValue = {
    language: navigator.language.startsWith(InterfaceLanguage.中文) ? InterfaceLanguage.中文 : InterfaceLanguage.English,
    openNewTab: true,
    displayTrending: true,
  }

  const settings = localStorage.getItem('settings')
  if (settings) {
    return { ...defaultValue, ...JSON.parse(settings) }
  }
  return defaultValue
}

export interface StorageModel {
  settings: SettingsType
  setSettings: Action<StorageModel, SettingsType>

  programLanguage: ProgramLanguage
  setProgramLanguage: Action<StorageModel, ProgramLanguage>

  githubToken: string
  setGithubToken: Action<StorageModel, string>

  region: string
  setRegion: Action<StorageModel, string>
  estimateRegion: Thunk<StorageModel>
}

const storageModel: StorageModel = {
  settings: defaultSettings(),

  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload }
    localStorage.setItem('settings', JSON.stringify(state.settings))
  }),

  programLanguage: parseInt(localStorage.getItem('programLanguage') || '0', 10),
  setProgramLanguage: action((state, payload) => {
    state.programLanguage = payload
    localStorage.setItem('programLanguage', payload.toString())
  }),

  githubToken: localStorage.getItem('githubToken') || '',
  setGithubToken: action((state, payload) => {
    state.githubToken = payload
    localStorage.setItem('githubToken', payload)
  }),

  region: '',
  setRegion: action((state, payload) => {
    state.region = payload
    localStorage.setItem('region', JSON.stringify({ value: payload, time: dayjs().toJSON()}))
  }),
  estimateRegion: thunk(async (actions) => {
    const region = localStorage.getItem('region')
    if (region) {
      const { value, time } = JSON.parse(region)
      if (time && dayjs(time).add(1, 'day').isAfter(dayjs())) {
        actions.setRegion(value || '')
        return
      }
    }

    try {
      const result = await ky.get('https://ipapi.co/json').json<{ country: string }>()
      actions.setRegion(result.country)
    } catch (err) {
      try {
        const result = await ky.get('https://ipinfo.io?token=e808b0e2f4fce7').json<{ country: string }>()
        actions.setRegion(result.country)
      } catch (err2) {
        warn('Failed to get your region info, which can help us use the cache closer to you. Maybe it\'s because your ad block plugin blocked the ipapi.co domain', true)
      }
    }
  }),
}

export default storageModel

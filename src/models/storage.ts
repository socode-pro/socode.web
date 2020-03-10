import { Action, action } from 'easy-peasy'
import { TrendingParam } from '../services/trending'
import { InterfaceLanguage } from '../utils/language'

export enum DarkMode {
  light,
  flowSystem,
  dark,
}

export interface StorageType {
  language?: InterfaceLanguage
  githubToken?: string
  trending?: TrendingParam
  openNewTab?: boolean
  darkMode?: DarkMode
  displayAwesome?: boolean
}

const storageKeys = [
  'language',
  'githubToken',
  'trending',
  'openNewTab',
  'darkMode',
  'displayAwesome',
]
const jsonParseKeys = ['trending']
const booleanParseKeys = ['openNewTab', 'displayAwesome']

export interface StorageModel {
  values: StorageType
  set: Action<StorageModel, StorageType>
  setStorage: Action<StorageModel, StorageType>
  initial: Action<StorageModel>
}

const storageModel: StorageModel = {
  values: {
    language: navigator.language.startsWith(InterfaceLanguage.中文) ? InterfaceLanguage.中文 : InterfaceLanguage.English,
    openNewTab: true,
    displayAwesome: false,
  },

  set: action((state, payload) => {
    state.values = { ...state.values, ...payload }
  }),

  setStorage: action((state, payload) => {
    try {
      for (const [name, value] of Object.entries(payload)) {
        localStorage.setItem(`socode_${name}`, value)
        state.values = { ...state.values, ...{ [name]: value } }
      }
    } catch (err) {
      console.error(err)
    }
  }),

  initial: action(state => {
    try {
      storageKeys.forEach(key => {
        let value: any = localStorage.getItem(`socode_${key}`)
        if (value) {
          if (booleanParseKeys.includes(key)) value = value !== 'false'
          else if (key === 'darkMode') value = parseInt(value, 10)
          else if (jsonParseKeys.includes(key)) value = JSON.parse(value)
          state.values = { ...state.values, ...{ [key]: value } }
        }
      })
    } catch (err) {
      console.error(err)
    }
  }),
}

export default storageModel

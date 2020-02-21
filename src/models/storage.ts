import { Action, action } from 'easy-peasy'
import { TrendingParam } from '../services/trending'
import Language, { navigatorLanguage } from '../utils/language'

export enum DarkMode {
  light,
  flowSystem,
  dark,
}

export interface StorageType {
  language?: Language
  searchLanguage?: Language
  searchEngine?: string
  starHistoryToken?: string
  trending?: TrendingParam
  openNewTab?: boolean
  darkMode?: DarkMode
  pinKeys?: string[]
  displayAwesome?: boolean
  displayMoreKeys?: boolean
}

const storageKeys = [
  'language',
  'searchEngine',
  'starHistoryToken',
  'trending',
  'openNewTab',
  'darkMode',
  'pinKeys',
  'displayAwesome',
  'displayMoreKeys',
]
const jsonParseKeys = ['trending']
const booleanParseKeys = ['openNewTab', 'displayAwesome', 'displayMoreKeys']

export interface StorageModel {
  values: StorageType
  set: Action<StorageModel, StorageType>

  initialStorage: Action<StorageModel>
  setStorage: Action<StorageModel, StorageType>
}

const storageModel: StorageModel = {
  values: {
    language: navigatorLanguage(navigator.language),
    searchLanguage: navigatorLanguage(navigator.language),
    openNewTab: true,
    displayAwesome: false,
    pinKeys: [],
  },

  set: action((state, payload) => {
    state.values = { ...state.values, ...payload }
  }),

  initialStorage: action(state => {
    try {
      storageKeys.forEach(key => {
        let value: any = localStorage.getItem(`socode_${key}`)
        if (value) {
          if (booleanParseKeys.includes(key)) value = value !== 'false'
          else if (key === 'darkMode') value = parseInt(value, 10)
          else if (jsonParseKeys.includes(key)) value = JSON.parse(value)
          else if (key === 'pinKeys') value = value.split(',')
          state.values = { ...state.values, ...{ [key]: value } }
        }
      })
    } catch (err) {
      console.error(err)
    }
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
}

export default storageModel

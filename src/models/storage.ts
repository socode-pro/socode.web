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
  usageKeys?: string[]
}

const storageKeys = ['language', 'searchEngine', 'starHistoryToken', 'trending', 'openNewTab', 'darkMode', 'usageKeys']
const jsonParseKeys = ['trending']

export interface StorageModel {
  values: StorageType
  set: Action<StorageModel, StorageType>
  getAllStorage: Action<StorageModel>
  setStorage: Action<StorageModel, StorageType>
}

const storageModel: StorageModel = {
  values: {
    language: navigatorLanguage(navigator.language),
    searchLanguage: navigatorLanguage(navigator.language),
    openNewTab: true,
    usageKeys: [],
  },

  set: action((state, payload) => {
    state.values = { ...state.values, ...payload }
  }),

  getAllStorage: action(state => {
    try {
      storageKeys.forEach(key => {
        let value: any = localStorage.getItem(`socode_${key}`)
        if (value) {
          if (key === 'openNewTab') value = value !== 'false'
          else if (key === 'darkMode') value = parseInt(value, 10)
          else if (jsonParseKeys.includes(key)) value = JSON.parse(value)
          else if (key === 'usageKeys') value = value.split(',')
          state.values = { ...state.values, ...{ [key]: value } }
        }
      })
    } catch (err) {
      console.error(err)
    }
  }),

  setStorage: action((state, payload) => {
    try {
      for (const [key, value] of Object.entries(payload)) {
        localStorage.setItem(`socode_${key}`, value)
        state.values = { ...state.values, ...{ [key]: value } }
      }
    } catch (err) {
      console.error(err)
    }
  }),
}

export default storageModel

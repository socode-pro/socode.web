import { Action, action } from 'easy-peasy'
import { TrendingParam } from '../services/trending'
import { SearchLanguage } from '../services/search.service'

export interface StorageType {
  language?: SearchLanguage
  searchEngine?: string
  starHistoryToken?: string
  trending?: TrendingParam
}

const storageKeys = ['language', 'searchEngine', 'starHistoryToken', 'trending']

export interface StorageModel {
  values: StorageType
  set: Action<StorageModel, StorageType>
  getAllStorage: Action<StorageModel>
  setStorage: Action<StorageModel, StorageType>
}

const storageModel: StorageModel = {
  values: {
    language: navigator.language.includes('zh') ? SearchLanguage.中文 : SearchLanguage.English
  },

  set: action((state, payload) => {
    state.values = { ...state.values, ...payload }
  }),

  getAllStorage: action((state) => {
    try {
      storageKeys.forEach(key => {
        const value = localStorage.getItem(`socode_${key}`)
        if (value)
          state.values = { ...state.values, ...{ [key]: value } }
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

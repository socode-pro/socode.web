import { Action, action } from 'easy-peasy'
import { TrendingParam } from '../services/trending'
import Language from '../utils/language'

export interface StorageType {
  language?: Language
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
    language: navigator.language.includes('zh') ? Language.中文 : Language.English,
  },

  set: action((state, payload) => {
    state.values = { ...state.values, ...payload }
  }),

  getAllStorage: action(state => {
    try {
      storageKeys.forEach(key => {
        const value = localStorage.getItem(`socode_${key}`)
        if (value) state.values = { ...state.values, ...{ [key]: value } }
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

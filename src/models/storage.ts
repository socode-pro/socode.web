import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'
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

  devhintsHtml: string
  setDevhintsHtml: Action<StorageModel, string>
  getDevhintsHtml: Thunk<StorageModel>
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

  devhintsHtml: '',
  setDevhintsHtml: action((state, payload) => {
    try {
      localStorage.setItem('devhintsHtml', payload)
      state.devhintsHtml = payload
    } catch (err) {
      console.error(err)
    }
  }),
  getDevhintsHtml: thunk(async (actions, payload) => {
    try {
      const time = localStorage.getItem('devhintsTime')
      if (
        time &&
        dayjs(time)
          .add(7, 'day')
          .isAfter(dayjs())
      ) {
        const devhintsHtml = localStorage.getItem('devhintsHtml')
        actions.setDevhintsHtml(devhintsHtml || '')
      } else {
        const resp = await axios.get('https://devhints.io/')
        actions.setDevhintsHtml(resp.data)
        localStorage.setItem('devhintsTime', dayjs().toJSON())
      }
    } catch (err) {
      if (err.isAxiosError) {
        const e: AxiosError = err
        console.warn(`status:${e.response?.status} msg:${e.message}`, e)
      } else {
        console.error(err)
      }
    }
  }),
}

export default storageModel

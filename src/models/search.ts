import { Action, action, Thunk, thunk } from 'easy-peasy'
import { Injections } from '../store'
import { StoreModel } from './index'
import { SocodeResult, SocodeParam } from '../services/socode.service'
import { SKey } from '../utils/skeys'

export interface SError {
  message: string
}

export interface SearchModel {
  result: SocodeResult | null
  setResult: Action<SearchModel, SocodeResult | null>

  loading: boolean
  setLoading: Action<SearchModel, boolean>

  search: Thunk<SearchModel, SocodeParam & SKey, Injections, StoreModel>

  error: SError | null
  setError: Action<SearchModel, SError | null>
}

const searchModel: SearchModel = {
  result: null,
  setResult: action((state, payload) => {
    state.result = payload
  }),

  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  search: thunk(async (actions, payload, { injections, getStoreState }) => {
    if (payload.name === 'socode.pro') {
      actions.setLoading(true)
      actions.setError(null)
      let result: SocodeResult | null = null
      try {
        result = await injections.searchService.search(payload)
      } catch (err) {
        actions.setError(err)
      }
      actions.setResult(result)
      actions.setLoading(false)
    } else {
      actions.setError(null)
      let url = payload.template?.replace('%s', payload.query)
      if (url && payload.bylang && payload.language) {
        url = url?.replace('%l', payload.language)
      }
      if (url) {
        if (getStoreState().storage.values.openNewTab) {
          window.open(url, '_blank')?.focus()
        } else {
          window.location.href = url
        }
      } else {
        actions.setError({ message: 'query fail' })
      }
    }
  }),

  error: null,
  setError: action((state, payload) => {
    state.error = payload
  }),
}

export default searchModel

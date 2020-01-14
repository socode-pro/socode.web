import { Action, action, Thunk, thunk } from 'easy-peasy'
import { AxiosError } from 'axios'
import { Injections } from '../store'
import { SearchResult, SearchParam } from '../services/search.service'

export interface SearchModel {
  result: SearchResult | null
  setResult: Action<SearchModel, SearchResult | null>

  loading: boolean
  setLoading: Action<SearchModel, boolean>

  search: Thunk<SearchModel, SearchParam, Injections>

  error: AxiosError | null
  setError: Action<SearchModel, AxiosError | null>
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

  search: thunk(async (actions, payload, { injections }) => {
    actions.setLoading(true)
    actions.setError(null)
    let result: SearchResult | null = null
    try {
      result = await injections.searchService.search(payload)
    } catch (err) {
      actions.setError(err)
    }
    actions.setResult(result)
    actions.setLoading(false)
  }),

  error: null,
  setError: action((state, payload) => {
    state.error = payload
  })
}

export default searchModel

import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import { Injections } from '../store'
import { StoreModel } from './index'
import { ProgramLanguage } from '../utils/language'
import { SocodeResult, SearchParam } from '../services/socode.service'
import { SKey, IsAvoidKeys } from '../utils/skeys'

export interface SMError {
  message: string
}

export interface SearchModel {
  expandView: boolean
  setExpandView: Action<SearchModel, boolean>

  displaySubtitle: boolean
  setDisplaySubtitle: Action<SearchModel, boolean>

  wapperTop: Computed<SearchModel, number>

  result: SocodeResult | null
  setResult: Action<SearchModel, SocodeResult | null>

  loading: boolean
  setLoading: Action<SearchModel, boolean>

  error: SMError | null
  setError: Action<SearchModel, SMError | null>

  search: Thunk<SearchModel, SearchParam & SKey, Injections>
  lunchUrl: Thunk<SearchModel, SearchParam & SKey, Injections, StoreModel>
}

const searchModel: SearchModel = {
  expandView: false,
  setExpandView: action((state, payload) => {
    state.expandView = payload
  }),

  displaySubtitle: false,
  setDisplaySubtitle: action((state, payload) => {
    state.displaySubtitle = payload
  }),

  result: null,
  setResult: action((state, payload) => {
    state.result = payload
  }),

  wapperTop: computed(state =>
    state.expandView || (state.result?.results.length || 0) > 0 ? -6 : state.displaySubtitle ? 150 : 130
  ),

  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  error: null,
  setError: action((state, payload) => {
    state.error = payload
  }),

  search: thunk(async (actions, payload, { injections }) => {
    if (IsAvoidKeys(payload.code)) {
      return
    }

    if (payload.code === 'socode') {
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
      actions.lunchUrl(payload)
    }
  }),

  lunchUrl: thunk((state, payload, { getStoreState }) => {
    state.error = null

    let { url } = payload
    if (!url && payload.query) {
      url = payload.template?.replace('%s', payload.query)
      if (payload.bylang && payload.searchLanguage) {
        url = url?.replace('%l', payload.searchLanguage)
      }
      if (payload.bypglang && payload.porogramLanguage !== undefined) {
        url = url?.replace('%pl', ProgramLanguage[payload.porogramLanguage])
      }
    }

    if (url) {
      if (getStoreState().storage.values.openNewTab) {
        window.open(url, '_blank')?.focus()
      } else {
        window.location.href = url
      }
    } else {
      state.error = { message: 'query fail' }
    }
  }),
}

export default searchModel

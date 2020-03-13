import { Action, action, Thunk, thunk, Computed, computed, ActionOn, actionOn, ThunkOn, thunkOn } from 'easy-peasy'
import { Injections } from '../store'
import { StoreModel } from './index'
import Language, { ProgramLanguage, navigatorLanguage } from '../utils/language'
import { winSearchParams } from '../utils/assist'
import { SocodeResult, SearchTimeRange } from '../services/socode.service'
import { NpmsResult } from '../services/npms.service'
import { isAvoidKey } from '../utils/searchkeys'

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

  npmResult: NpmsResult | null
  setNpmResult: Action<SearchModel, NpmsResult | null>

  loading: boolean
  setLoading: Action<SearchModel, boolean>

  error: SMError | null
  setError: Action<SearchModel, SMError | null>

  pageno: number
  resetPage: Action<SearchModel>
  nextPage: Action<SearchModel>
  nextPageThunk: Thunk<SearchModel>
  prevPage: Action<SearchModel>
  prevPageThunk: Thunk<SearchModel>

  query: string
  setQuery: Action<SearchModel, string>

  timeRange: SearchTimeRange
  setTimeRange: Action<SearchModel, SearchTimeRange>
  setTimeRangeThunk: Thunk<SearchModel, SearchTimeRange>

  searchLanguage: Language
  setSearchLanguage: Action<SearchModel, Language>
  setSearchLanguageThunk: Thunk<SearchModel, Language>

  search: Thunk<SearchModel, void, Injections, StoreModel>
  lunchUrl: Thunk<SearchModel, string | void, Injections, StoreModel>
  clearResult: Action<SearchModel>

  docLanguage: Language
  setDocLanguage: Action<SearchModel, Language>

  programLanguage: ProgramLanguage
  setProgramLanguage: Action<SearchModel, ProgramLanguage>

  onCurrentKey: ActionOn<SearchModel, StoreModel>
  onInitialCurrentKey: ThunkOn<SearchModel, void, StoreModel>
}

const searchModel: SearchModel = {
  expandView: false,
  setExpandView: action((state, payload) => {
    state.expandView = payload
  }),

  displaySubtitle: localStorage.getItem('displaySubtitle') !== 'false',
  setDisplaySubtitle: action((state, payload) => {
    state.displaySubtitle = payload
    localStorage.setItem('displaySubtitle', payload.toString())
  }),

  result: null,
  setResult: action((state, payload) => {
    state.result = payload
  }),

  npmResult: null,
  setNpmResult: action((state, payload) => {
    state.npmResult = payload
  }),

  wapperTop: computed(state =>
    state.expandView || (state.result?.results.length || state.npmResult?.results.length || 0) > 0 ? -6 : state.displaySubtitle ? 150 : 130
  ),

  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  error: null,
  setError: action((state, payload) => {
    state.error = payload
  }),

  pageno: 1,
  resetPage: action((state) => {
    state.pageno = 1
  }),
  nextPage: action(state => {
    state.pageno += 1
  }),
  nextPageThunk: thunk(async actions => {
    actions.nextPage()
    await actions.search()
    window.scrollTo({ top: 0 })
  }),
  prevPage: action(state => {
    state.pageno -= 1
  }),
  prevPageThunk: thunk(async actions => {
    actions.prevPage()
    await actions.search()
    window.scrollTo({ top: 0 })
  }),

  query: (new URLSearchParams(window.location.search)).get('q') || '',
  setQuery: action((state, payload) => {
    state.query = payload
  }),

  timeRange: SearchTimeRange.Anytime,
  setTimeRange: action((state, payload) => {
    state.timeRange = payload
  }),
  setTimeRangeThunk: thunk(async (actions, payload) => {
    actions.setTimeRange(payload)
    actions.resetPage()
    await actions.search()
  }),

  searchLanguage: localStorage.getItem('searchLanguage') as Language || navigatorLanguage(navigator.language),
  setSearchLanguage: action((state, payload) => {
    state.searchLanguage = payload
    localStorage.setItem('searchLanguage', payload)
  }),
  setSearchLanguageThunk: thunk(async (actions, payload) => {
    actions.setSearchLanguage(payload)
    actions.resetPage()
    await actions.search()
  }),

  search: thunk(async (actions, payload, { injections, getState, getStoreState }) => {
    const { query, timeRange, searchLanguage, pageno } = getState()
    const { currentKey } = getStoreState().searchKeys
    winSearchParams({ query })

    if (!query || isAvoidKey(currentKey)) {
      actions.clearResult()
      return
    }

    if (currentKey.code === 'socode') {
      actions.setLoading(true)
      actions.setError(null)
      let result: SocodeResult | null = null
      try {
        result = await injections.searchService.search({ query, timeRange, pageno, searchLanguage })
      } catch (err) {
        actions.setError(err)
      }
      actions.setResult(result)
      actions.setLoading(false)
    } else if (currentKey.code === 'npm') {
      actions.setLoading(true)
      actions.setError(null)
      let result: NpmsResult | null = null
      try {
        result = await injections.npmsService.search({ query, pageno })
      } catch (err) {
        actions.setError(err)
      }
      actions.setNpmResult(result)
      actions.setLoading(false)
    } else {
      actions.lunchUrl()
    }
  }),

  lunchUrl: thunk((state, payload, { getStoreState, getState }) => {
    state.error = null
    const { query, searchLanguage, programLanguage } = getState()
    const { currentKey } = getStoreState().searchKeys
    let url: string| undefined = ''

    if (payload) {
      url = payload
    } else {
      url = currentKey.template?.replace('%s', query)
      if (url && currentKey.bylang && searchLanguage) {
        url = url?.replace('%l', searchLanguage)
      }
      if (url && currentKey.bypglang) {
        url = url?.replace('%pl', ProgramLanguage[programLanguage])
      }
    }

    if (url) {
      if (getStoreState().storage.settings.openNewTab) {
        window.open(url, '_blank')?.focus()
      } else {
        window.location.href = url
      }
    }
  }),

  clearResult: action(state => {
    state.pageno = 1
    state.result = null
    state.npmResult = null
  }),

  docLanguage: localStorage.getItem('docLanguage') as Language || navigatorLanguage(navigator.language),
  setDocLanguage: action((state, payload) => {
    state.docLanguage = payload
    localStorage.setItem('docLanguage', payload)
  }),

  programLanguage: parseInt(localStorage.getItem('programLanguage') || '0', 10),
  setProgramLanguage: action((state, payload) => {
    state.programLanguage = payload
    localStorage.setItem('programLanguage', payload.toString())
  }),

  onCurrentKey: actionOn(
    (actions, storeActions) => storeActions.searchKeys.setCurrentKey,
    (state, target) => {
      if (!target.payload.devdocs) {
        state.expandView = false
      }
    },
  ),

  onInitialCurrentKey: thunkOn(
    (actions, storeActions) => storeActions.searchKeys.initialCurrentKey,
    (actions, target) => {
      const params = new URLSearchParams(window.location.search)
      if (params.has('q')) {
        actions.search()
      }
    },
  ),
}

export default searchModel

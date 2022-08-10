import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import qrcode from "qrcode"
import { Injections } from "../Store"
import { StoreModel } from "./index"
import Language, { ProgramLanguage, navigatorLanguage } from "../utils/language"
import { setupPathParams } from "../utils/pathParam"
import { SocodeResult, SearchTimeRange } from "../services/socode.service"
import { NpmsResult } from "../services/npms.service"

export interface SMError {
  message: string
}

export interface SearchModel {
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

  setQrcode: Action<SearchModel, string>

  search: Thunk<SearchModel, void, Injections, StoreModel>
  lunchUrl: Thunk<SearchModel, string | void, Injections, StoreModel>
  clearResult: Action<SearchModel>

  docLanguage: Language
  setDocLanguage: Action<SearchModel, Language>

  onInitialCurrentKey: ThunkOn<SearchModel, void, StoreModel>
}

const searchModel: SearchModel = {
  result: null,
  setResult: action((state, payload) => {
    state.result = payload
  }),

  npmResult: null,
  setNpmResult: action((state, payload) => {
    state.npmResult = payload
  }),

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
  nextPage: action((state) => {
    state.pageno += 1
  }),
  nextPageThunk: thunk(async (actions) => {
    actions.nextPage()
    await actions.search()
    document.body.scrollTo({ top: 0 })
  }),
  prevPage: action((state) => {
    state.pageno -= 1
  }),
  prevPageThunk: thunk(async (actions) => {
    actions.prevPage()
    await actions.search()
    document.body.scrollTo({ top: 0 })
  }),

  query: new URLSearchParams(window.location.search).get("q") || "",
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

  searchLanguage: (localStorage.getItem("searchLanguage") as Language) || navigatorLanguage(navigator.language),
  setSearchLanguage: action((state, payload) => {
    state.searchLanguage = payload
    localStorage.setItem("searchLanguage", payload)
  }),
  setSearchLanguageThunk: thunk(async (actions, payload) => {
    actions.setSearchLanguage(payload)
    actions.resetPage()
    await actions.search()
  }),

  setQrcode: action((state, payload) => {
    const canvas = document.getElementById("qrcode")
    if (canvas && payload) {
      qrcode.toCanvas(canvas, payload, { width: 200 }, (err) => {
        if (err) console.error(err)
      })
    }
  }),

  search: thunk(async (actions, payload, { injections, getState, getStoreState }) => {
    const { query, timeRange, searchLanguage, pageno } = getState()
    const { currentKey } = getStoreState().searchKeys

    if ((new URLSearchParams(window.location.search).get("q") || "") !== query) {
      setupPathParams({ query })
    }

    if (!query) {
      actions.clearResult()
      return
    }

    if (currentKey.code === "socode") {
      actions.setLoading(true)
      actions.setError(null)
      let result: SocodeResult | null = null
      try {
        result = await injections.searchService.search({ query, timeRange, pageno, searchLanguage })
      } catch (err) {
        actions.setError(err as SMError)
      }
      actions.setResult(result)
      actions.setLoading(false)
    } else if (currentKey.code === "npms") {
      actions.setLoading(true)
      actions.setError(null)
      let result: NpmsResult | null = null
      try {
        result = await injections.npmsService.search({ query, pageno })
      } catch (err) {
        actions.setError(err as SMError)
      }
      actions.setNpmResult(result)
      actions.setLoading(false)
    } else if (currentKey.code === "qrcode") {
      actions.setQrcode(query)
    } else if (currentKey.template) {
      actions.lunchUrl()
    }
  }),

  lunchUrl: thunk((actions, payload, { getStoreState, getState }) => {
    const { currentKey } = getStoreState().searchKeys
    const { query, searchLanguage } = getState()
    const { storage, profile } = getStoreState()
    let url = ""

    if (payload) {
      url = payload
    } else {
      if (!currentKey.template || !query) {
        return
      }
      url = currentKey.template.replace("%s", encodeURIComponent(query))
      if (currentKey.bylang && searchLanguage) {
        url = url.replace("%l", searchLanguage)
      }
      if (currentKey.bypglang) {
        url = url.replace("%pl", ProgramLanguage[storage.programLanguage])
      }
    }

    actions.setError(null)
    if (profile.settings.openNewPage) {
      window.open(url, "_blank")?.focus()
    } else {
      window.location.href = url
    }
  }),

  clearResult: action((state) => {
    state.pageno = 1
    state.result = null
    state.npmResult = null
  }),

  docLanguage: (localStorage.getItem("docLanguage") as Language) || navigatorLanguage(navigator.language),
  setDocLanguage: action((state, payload) => {
    state.docLanguage = payload
    localStorage.setItem("docLanguage", payload)
  }),

  onInitialCurrentKey: thunkOn(
    (actions, storeActions) => storeActions.searchKeys.initialCurrentKey,
    (actions, target) => {
      const params = new URLSearchParams(window.location.search)
      if (params.has("q")) {
        actions.search()
      }
    }
  ),
}

export default searchModel

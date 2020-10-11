import { Action, action, Thunk, thunk, ThunkOn, thunkOn, Computed, computed } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"
import { ProgramLanguage, TrendingSpokenLanguage } from "../utils/language"
import { StoreModel } from "./index"

const listHeight = window.innerHeight - 124 - 112 - 26.25 - 47.4
const responsiveCount = Math.floor(listHeight / 55.4)

export enum TrendingSince {
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
}

export interface Repository {
  author: string
  name: string
  avatar: string
  url: string
  description: string
  language: string
  languageColor: string
  stars: number
  forks: number
  currentPeriodStars: number
  builtBy: {
    href: string
    avator: string
    username: string
  }
}

export interface TrendingModel {
  loading: boolean
  setLoading: Action<TrendingModel, boolean>

  repositories: Array<Repository>
  setRepositorys: Action<TrendingModel, Array<Repository>>
  list: Computed<TrendingModel, Array<Repository>>

  spoken: TrendingSpokenLanguage
  setSpoken: Action<TrendingModel, TrendingSpokenLanguage>

  since: TrendingSince
  setSince: Action<TrendingModel, TrendingSince>

  url: string
  setUrl: Action<TrendingModel, string>

  expanded: boolean
  onReadMore: Action<TrendingModel>

  fetch: Thunk<TrendingModel, void, void, StoreModel>
  onFetchParamsChanged: ThunkOn<TrendingModel, void, StoreModel>
}

const trendingModel: TrendingModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  repositories: [],
  setRepositorys: action((state, payload) => {
    state.repositories = payload
  }),
  list: computed((state) => (state.expanded ? state.repositories : state.repositories.slice(0, responsiveCount))),

  spoken: (localStorage.getItem("trendingSpoken") as TrendingSpokenLanguage) || TrendingSpokenLanguage.All,
  setSpoken: action((state, payload) => {
    state.spoken = payload
    localStorage.setItem("trendingSpoken", payload)
  }),

  since: (localStorage.getItem("trendingSince") as TrendingSince) || TrendingSince.Daily,
  setSince: action((state, payload) => {
    state.since = payload
    localStorage.setItem("trendingSince", payload)
  }),

  url: "https://github.com/trending",
  setUrl: action((state, payload) => {
    state.url = payload
  }),

  expanded: false,
  onReadMore: action((state) => {
    if (state.expanded) {
      window.open(state.url, "_blank")?.focus()
    } else {
      state.expanded = true
    }
  }),

  fetch: thunk(async (actions, target, { getState, getStoreState }) => {
    const { spoken, since } = getState()
    const { programLanguage } = getStoreState().storage
    const language = ProgramLanguage[programLanguage].toLowerCase().replace(" ", "-").replace("#", "%23")

    // storageService.getLocal 与 ky.get 执行时间不确定，可能出现逻辑错误。
    // const params = localStorage.getItem('repos_params')
    // const times = localStorage.getItem('repos_times')
    // if (
    //   params && params === spoken + language + since &&
    //   times && dayjs(times).add(2, 'hour').isAfter(dayjs())
    // ) {
    //   const repos = JSON.parse(localStorage.getItem('repos') || '[]')
    //   actions.setRepositorys(repos)
    // } else {
    actions.setLoading(true)
    try {
      const searchParams = new URLSearchParams()
      searchParams.set("spoken_language_code", spoken)
      searchParams.set("since", since)
      if (programLanguage !== ProgramLanguage.All) {
        searchParams.set("language", language)
      }
      // https://github.com/huchenme/github-trending-api/issues/130#issuecomment-703483762
      const data = await ky.get("https://gtrend.yapie.me/repositories", { searchParams }).json<Array<Repository>>()
      actions.setRepositorys(data)
      // localStorage.setItem('repos_params', spoken + language + since)
      // localStorage.setItem('repos_times', dayjs().toJSON())
      // localStorage.setItem('repos', JSON.stringify(data.slice(0,12)))
    } catch (err) {
      console.error(err)
    }
    actions.setLoading(false)
    // }

    const urlparams = new URLSearchParams()
    urlparams.set("since", since)
    if (spoken) {
      urlparams.set("spoken_language_code", spoken)
    }
    actions.setUrl(
      `https://github.com/trending/${programLanguage !== ProgramLanguage.All ? language : ""}?${urlparams.toString()}`
    )
  }),

  onFetchParamsChanged: thunkOn(
    (actions, storeActions) => [actions.setSpoken, actions.setSince, storeActions.storage.setProgramLanguage],
    (actions, target, { getState }) => {
      actions.fetch()
    }
  ),
}

export default trendingModel

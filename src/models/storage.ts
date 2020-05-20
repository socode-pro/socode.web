import { Action, action, Thunk, thunk, Computed, computed } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"
import { StoreModel } from "./index"
import { InterfaceLanguage, ProgramLanguage } from "../utils/language"
import { warn } from "../utils/toast"

export enum SearchModel {
  Devdocs,
  Algolia,
  Awesome,
  Template,
}

export enum DarkMode {
  light,
  flowSystem,
  dark,
}

export interface SettingsType {
  language?: InterfaceLanguage
  openNewTab?: boolean
  displayTrending?: boolean
  darkMode?: DarkMode
}

export interface RegionData {
  ip: string
  city: string
  country_code: string
  country_name?: string
  region_code?: string
  country?: string
  latitude?: string
  longitude?: string
  utc_offset?: string
}

const defaultSettings = (): SettingsType => {
  const defaultValue = {
    language: navigator.language.startsWith(InterfaceLanguage.中文)
      ? InterfaceLanguage.中文
      : InterfaceLanguage.English,
    openNewTab: true,
    displayTrending: true,
  }

  const settings = localStorage.getItem("settings")
  if (settings) {
    return { ...defaultValue, ...JSON.parse(settings) }
  }
  return defaultValue
}

export interface StorageModel {
  settings: SettingsType
  setSettings: Action<StorageModel, SettingsType>

  programLanguage: ProgramLanguage
  setProgramLanguage: Action<StorageModel, ProgramLanguage>

  searchModels: { [key: string]: SearchModel }
  setSearchModels: Action<StorageModel, { code: string; model: SearchModel }>
  searchModel: Computed<StorageModel, SearchModel, StoreModel>

  githubToken: string
  setGithubToken: Action<StorageModel, string>

  region: RegionData
  setRegion: Action<StorageModel, RegionData>
  judgeRegion: Thunk<StorageModel>

  ousideFirewall: boolean
  setOusideFirewall: Action<StorageModel, boolean>
  judgeOusideFirewall: Thunk<StorageModel>
}

const storageModel: StorageModel = {
  settings: defaultSettings(),

  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload }
    localStorage.setItem("settings", JSON.stringify(state.settings))
  }),

  programLanguage: parseInt(localStorage.getItem("programLanguage") || "0", 10),
  setProgramLanguage: action((state, payload) => {
    state.programLanguage = payload
    localStorage.setItem("programLanguage", payload.toString())
  }),

  searchModels: JSON.parse(localStorage.getItem("searchModels") || "{}"),
  setSearchModels: action((state, { code, model }) => {
    state.searchModels = { ...state.searchModels, [code]: model }
    localStorage.setItem("searchModels", JSON.stringify(state.searchModels))
  }),
  searchModel: computed(
    [(state) => state.searchModels, (state, storeState) => storeState.searchKeys.currentKey],
    (searchModels, currentKey) => {
      if ({}.hasOwnProperty.call(searchModels, currentKey.code)) {
        return searchModels[currentKey.code]
      }
      if (currentKey.devdocs) {
        return SearchModel.Devdocs
      }
      if (currentKey.docsearch) {
        return SearchModel.Algolia
      }
      return SearchModel.Template
    }
  ),

  githubToken: localStorage.getItem("githubToken") || "",
  setGithubToken: action((state, payload) => {
    state.githubToken = payload
    localStorage.setItem("githubToken", payload)
  }),

  region: { ip: "", city: "", country_code: "" },
  setRegion: action((state, payload) => {
    state.region = payload
    localStorage.setItem("regionData", JSON.stringify({ value: payload, time: dayjs().toJSON() }))
  }),
  judgeRegion: thunk(async (actions) => {
    const region = localStorage.getItem("regionData")
    if (region) {
      const { value, time } = JSON.parse(region)
      if (time && dayjs(time).add(1, "day").isAfter(dayjs())) {
        actions.setRegion(value || {})
        return
      }
    }

    try {
      const result = await ky.get("https://ipapi.co/json").json<RegionData>()
      actions.setRegion(result)
    } catch (err) {
      try {
        const result = await ky.get("https://freegeoip.app/json/").json<RegionData>()
        actions.setRegion(result)
      } catch (err2) {
        warn(
          "Failed to get your region info, which can help us use the cache closer to you. Maybe it's because your ad block plugin blocked the ipapi.co domain",
          true
        )
      }
    }
  }),

  ousideFirewall: true,
  setOusideFirewall: action((state, payload) => {
    state.ousideFirewall = payload
  }),
  judgeOusideFirewall: thunk(async (actions) => {
    try {
      await ky("https://ajax.googleapis.com/ajax/libs/scriptaculous/1.9.0/scriptaculous.js", {
        timeout: 1000,
      })
      actions.setOusideFirewall(true)
    } catch (err) {
      actions.setOusideFirewall(false)
    }
  }),
}

export default storageModel

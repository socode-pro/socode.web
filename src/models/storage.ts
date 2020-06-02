import { Action, action, Thunk, thunk, Computed, computed } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"
import { StoreModel } from "./index"
import { InterfaceLanguage, ProgramLanguage } from "../utils/language"
import { warn } from "../utils/toast"

const IpapiWarn =
  "Failed to get your region info, which can help us use the cache closer to you. Maybe it's because your ad block plugin blocked the ipapi.co domain"

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

export enum UserRole {
  Admin = "admin",
  Collaborator = "collaborator",
  User = "user",
}

export interface SettingsType {
  language?: InterfaceLanguage
  openNewTab?: boolean
  displayTrending?: boolean
  darkMode?: DarkMode
}

export interface RegionData {
  ip: string
  country_code: string
  country_name?: string
  city?: string
  region_code?: string
  country?: string
  latitude?: string
  longitude?: string
  utc_offset?: string
}

export interface Profile {
  id: number
  username: string
  email?: string
  displayName?: string
  githubToken?: string
  googleToken?: string
  avatar?: string
  role: UserRole
  jwt: string
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

  profile: Profile | null
  setProfile: Action<StorageModel, Profile | null>
  jwtCallback: Thunk<StorageModel>

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

  profile: JSON.parse(localStorage.getItem("profile") || "null"),
  setProfile: action((state, payload) => {
    state.profile = payload
    localStorage.setItem("profile", JSON.stringify(payload))
  }),
  jwtCallback: thunk(async (actions) => {
    // const info2: Profile = {
    //   id: 11,
    //   role: UserRole.User,
    //   username: "zicjin@gmail.com",
    //   email: "zicjin@gmail.com",
    //   displayName: "Cheney Jin",
    //   avatar: "https://avatars2.githubusercontent.com/u/199482",
    //   // githubToken: "***REMOVED***",
    //   googleToken: "***REMOVED***",
    // }
    // actions.setProfile(info2)
    // return

    const params = new URLSearchParams(window.location.search)
    if (!params.has("jwt")) return
    const jwt = params.get("jwt") || ""

    try {
      const profile = await ky
        .get(`${process.env.REACT_APP_NEST}/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .json<Profile>()
      actions.setProfile({ ...profile, jwt })
    } catch (err) {
      console.error(err)
      actions.setProfile(null)
      // when jwt fail, setProfile(null)
    }
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
      const result = await ky.get("https://www.cloudflare.com/cdn-cgi/trace").text()
      const resultLines = result.split(/\r?\n/)

      const locline = resultLines.find((l) => l.startsWith("loc"))
      if (!locline) throw new Error("locline null")
      const ipline = resultLines.find((l) => l.startsWith("ip"))
      if (!ipline) throw new Error("ipline null")

      actions.setRegion({
        ip: ipline?.split("=")[1],
        country_code: locline?.split("=")[1],
      })
    } catch (err) {
      console.warn(err)
      try {
        const result = await ky.get("https://ipapi.co/json").json<RegionData>()
        actions.setRegion(result)
      } catch (err2) {
        warn(IpapiWarn, true)
      }
    }
  }),

  ousideFirewall: localStorage.getItem("ousideFirewall") !== "false",
  setOusideFirewall: action((state, payload) => {
    state.ousideFirewall = payload
    localStorage.setItem("ousideFirewall", payload.toString())
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

import { Action, action, Thunk, thunk, Computed, computed } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"
import { StoreModel } from "./index"
import { ProgramLanguage } from "../utils/language"
import { getPathParam } from "../utils/pathParam"
import { warn } from "../utils/toast"

const IpapiWarn =
  "Failed to get your region info, which can help us use the cache closer to you. Maybe it's because your ad block plugin blocked the ipapi.co domain"

let UrlParmsSolved = false

export enum SearchModel {
  Devdocs,
  Algolia,
  Awesome,
  Template,
  Cheatsheets,
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

export interface DevdocMeta {
  name: string
  slug: string
  type: string
  mtime: number
  release: string
  db_size: number
  links: {
    home: string
    home_matchs?: Array<{
      url: string
      startsWith?: string
      remove?: string
      add?: string
    }>
    disableUrl: boolean
    code: string
  }
}

export interface StorageModel {
  programLanguage: ProgramLanguage
  setProgramLanguage: Action<StorageModel, ProgramLanguage>

  searchModels: { [key: string]: SearchModel }
  setSearchModels: Action<StorageModel, { code: string; model: SearchModel }>
  searchModel: Computed<StorageModel, SearchModel, StoreModel>

  region: RegionData
  setRegion: Action<StorageModel, RegionData>
  judgeRegion: Thunk<StorageModel>

  ousideFirewall: boolean
  setOusideFirewall: Action<StorageModel, boolean>
  judgeOusideFirewall: Thunk<StorageModel>

  metas: DevdocMeta[]
  setMetas: Action<StorageModel, DevdocMeta[]>
  initialMetas: Thunk<StorageModel, void>
}

const storageModel: StorageModel = {
  programLanguage: parseInt(localStorage.getItem("programLanguage") || "0", 10),
  setProgramLanguage: action((state, payload) => {
    state.programLanguage = payload
    localStorage.setItem("programLanguage", payload.toString())
  }),

  searchModels: JSON.parse(localStorage.getItem("searchModels") || "{}"),
  setSearchModels: action((state, { code, model }) => {
    state.searchModels = { ...state.searchModels, [code]: model }
    localStorage.setItem("searchModels", JSON.stringify(state.searchModels))
    if (model !== SearchModel.Devdocs) {
      const searchParams = new URLSearchParams(window.location.search)
      searchParams.delete("docspath")
    }
  }),
  searchModel: computed(
    [(state) => state.searchModels, (state, storeState) => storeState.searchKeys.currentKey],
    (searchModels, currentKey) => {
      if (getPathParam("docspath")) {
        return SearchModel.Devdocs
      }
      if ({}.hasOwnProperty.call(searchModels, currentKey.code)) {
        return searchModels[currentKey.code]
      }
      if (currentKey.devdocs) {
        return SearchModel.Devdocs
      }
      if (currentKey.docsearch) {
        return SearchModel.Algolia
      }
      if (currentKey.cheatsheets) {
        return SearchModel.Cheatsheets
      }
      return SearchModel.Template
    }
  ),

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
        const result = await ky.get("https://freegeoip.app/json").json<RegionData>()
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
      // https://juejin.im/post/58edfdb544d904005776688d
      await ky("//graph.facebook.com/feed?callback=h", {
        timeout: 4000,
      })
      actions.setOusideFirewall(true)
    } catch (err) {
      actions.setOusideFirewall(false)
    }

    // 图片资源会导致浏览器UI处于loading状态
    // https://segmentfault.com/q/1010000005061694
    // const image = new Image()
    // image.onload = () => {
    //   actions.setOusideFirewall(true)
    // }
    // image.onerror = () => {
    //   actions.setOusideFirewall(false)
    // }
    // image.src = "http://youtube.com/favicon.ico"
  }),

  metas: JSON.parse(localStorage.getItem("metas") || "[]"),
  setMetas: action((state, payload) => {
    state.metas = payload
    localStorage.setItem("metas", JSON.stringify(payload))
  }),
  initialMetas: thunk(async (actions) => {
    try {
      const metas = await ky.get(`${process.env.REACT_APP_DOC_HOST}/docs.json`).json<DevdocMeta[]>()
      if (metas !== null) {
        actions.setMetas(metas)
      }
    } catch (err) {
      console.error(err)
    }
  }),
}

export default storageModel

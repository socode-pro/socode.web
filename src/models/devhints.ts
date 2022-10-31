import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"
import { StoreModel } from "./index"
import { SearchModel } from "./storage"

export interface DevhintsModel {
  loading: boolean
  setLoading: Action<DevhintsModel, boolean>
  html: string
  setHtml: Action<DevhintsModel, { html: string; storage?: boolean }>
  getHtml: Thunk<DevhintsModel>

  itemHtml: string
  setItemHtml: Action<DevhintsModel, { key: string; html: string; storage?: boolean }>
  getItemHtml: Thunk<DevhintsModel, void, void, StoreModel>
  onCurrentKey: ThunkOn<DevhintsModel, void, StoreModel>
  onSearchModel: ThunkOn<DevhintsModel, void, StoreModel>
}

const devhintsModel: DevhintsModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  html: "",
  setHtml: action((state, { html, storage }) => {
    state.html = html
    if (storage) {
      localStorage.setItem("devhints_html", html)
      localStorage.setItem("devhints_time", dayjs().toJSON())
    }
  }),
  getHtml: thunk(async (actions) => {
    try {
      const devhintsTime = localStorage.getItem("devhints_time")
      if (devhintsTime && dayjs(devhintsTime).add(7, "day").isAfter(dayjs())) {
        const devhintsHtml = localStorage.getItem("devhints_html")
        if (devhintsHtml) {
          actions.setHtml({ html: devhintsHtml })
          return
        }
      }

      actions.setLoading(true)
      const html = await ky.get(`${process.env.REACT_APP_NEST}/firewall/devhints`).text()
      actions.setHtml({ html, storage: true })
    } catch (err) {
      console.warn("DevhintsModel.getHtml:", err)
    }
    actions.setLoading(false)
  }),

  itemHtml: "",
  setItemHtml: action((state, { key, html, storage }) => {
    state.itemHtml = html
    if (storage) {
      localStorage.setItem(`devhints_${key}_html`, html)
      localStorage.setItem(`devhints_${key}_time`, dayjs().toJSON())
    }
  }),
  getItemHtml: thunk(async (actions, payload, { getStoreState }) => {
    const { currentKey } = getStoreState().searchKeys
    if (!currentKey.cheatsheets) return

    try {
      const devhintsTime = localStorage.getItem(`devhints_${currentKey.cheatsheets}_time`)
      if (devhintsTime && dayjs(devhintsTime).add(7, "day").isAfter(dayjs())) {
        const devhintsHtml = localStorage.getItem(`devhints_${currentKey.cheatsheets}_html`)
        if (devhintsHtml) {
          actions.setItemHtml({ key: currentKey.cheatsheets, html: devhintsHtml })
          return
        }
      }

      actions.setLoading(true)
      const html = await ky.get(`${process.env.REACT_APP_NEST}/firewall/devhints/${currentKey.cheatsheets}`).text()
      actions.setItemHtml({ key: currentKey.cheatsheets, html, storage: true })
    } catch (err) {
      console.warn("DevhintsModel.getItemHtml:", err)
    }
    actions.setLoading(false)
  }),
  onCurrentKey: thunkOn(
    (actions, storeActions) => storeActions.searchKeys.setCurrentKey,
    (actions, target, { getStoreState }) => {
      const { searchModels } = getStoreState().storage
      if (target.payload.cheatsheets && searchModels[target.payload.code] === SearchModel.Cheatsheets) {
        actions.getItemHtml()
      }
    }
  ),
  onSearchModel: thunkOn(
    (actions, storeActions) => storeActions.storage.setSearchModels,
    (actions, target, { getStoreState }) => {
      const { currentKey } = getStoreState().searchKeys
      if (currentKey.cheatsheets && target.payload.model === SearchModel.Cheatsheets) {
        actions.getItemHtml()
      }
    }
  ),
}

export default devhintsModel

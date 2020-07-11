import { Action, action, Thunk, thunk, Computed, computed, ActionOn, actionOn, ThunkOn, thunkOn } from "easy-peasy"
import ky from "ky"
import groupBy from "lodash/groupBy"
import Fuse from "fuse.js"
import { winSearchParams } from "../utils/assist"
import FuseHighlight from "../utils/fuse_highlight"
import { StoreModel } from "./index"
import SKeys, { SKey } from "../utils/searchkeys"
import { DevdocEntrie, DevdocIndex } from "./devdocs"
import { DevdocMeta } from "./storage"

export type DevdocEntrieWithKey = DevdocEntrie & { key: string; shortkeys: string }

const fuseOptions: Fuse.IFuseOptions<DevdocEntrieWithKey> = {
  keys: ["name", "type", "key", "shortkeys"],
  threshold: 0.3,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
}

const getEntrieUrl = (entrie: DevdocEntrie, meta: DevdocMeta | undefined): string | undefined => {
  if (!meta || meta.links.disableUrl) return undefined
  if (!entrie.url) return undefined

  if (meta.links.home_matchs) {
    let result
    meta.links.home_matchs.some((match) => {
      if (match.startsWith && entrie.url?.startsWith(match.startsWith)) {
        if (match.remove) {
          entrie.url = entrie.url.replace(match.remove, "")
        }
        if (match.add) {
          entrie.url = match.add + entrie.url
        }
        result = match.url + entrie.url
        return true
      }
      return false
    })
    if (result) {
      return result
    }
  }

  return meta.links.home + entrie.url
}

export interface DevdocsUnitedModel {
  menuLoading: boolean
  setMenuLoading: Action<DevdocsUnitedModel, boolean>

  docLoading: boolean
  setDocLoading: Action<DevdocsUnitedModel, boolean>

  keys: Array<SKey>
  setKeys: Action<DevdocsUnitedModel, Array<SKey>>

  indexs: Array<DevdocEntrieWithKey>
  setIndexs: Action<DevdocsUnitedModel, Array<DevdocEntrieWithKey>>
  concatIndexs: Action<DevdocsUnitedModel, Array<DevdocEntrieWithKey>>
  pushIndexs: Thunk<DevdocsUnitedModel, SKey, void, StoreModel>
  loadIndexsByKeys: Thunk<DevdocsUnitedModel, string[]>

  queryItems: Computed<DevdocsUnitedModel, Array<DevdocEntrieWithKey>, StoreModel>
  queryIndex: number
  setQueryIndex: Action<DevdocsUnitedModel, number>
  onQueryChange: ActionOn<DevdocsUnitedModel, StoreModel>

  currentMeta: DevdocMeta | null
  setCurrentMeta: Action<DevdocsUnitedModel, DevdocMeta>

  currentMenus: Array<{
    group: string
    entries: Array<DevdocEntrieWithKey>
  }>
  setCurrentMenus: Action<
    DevdocsUnitedModel,
    Array<{
      group: string
      entries: Array<DevdocEntrieWithKey>
    }>
  >

  expandings: { [type: string]: boolean }
  toggleExpanding: Action<DevdocsUnitedModel, string>
  cleanExpandings: Action<DevdocsUnitedModel>
  expandByPath: Action<DevdocsUnitedModel, string>

  currentPath: string
  setCurrentPath: Action<DevdocsUnitedModel, string>

  docs: string
  setDocs: Action<DevdocsUnitedModel, string>

  selectPath: Thunk<DevdocsUnitedModel, { code: string; path: string }, void, StoreModel>
}

const devdocsUnitedModel: DevdocsUnitedModel = {
  menuLoading: false,
  setMenuLoading: action((state, payload) => {
    state.menuLoading = payload
  }),

  docLoading: false,
  setDocLoading: action((state, payload) => {
    state.docLoading = payload
  }),

  keys: [],
  setKeys: action((state, payload) => {
    state.keys = payload
  }),

  indexs: [],
  setIndexs: action((state, payload) => {
    state.indexs = payload
  }),
  concatIndexs: action((state, payload) => {
    state.indexs = state.indexs.concat(payload)
  }),
  pushIndexs: thunk(async (actions, payload, { getStoreState }) => {
    try {
      const { metas } = getStoreState().storage
      const meta = metas.find((m) => m.slug === payload.devdocs)
      if (!meta) {
        throw new Error("loadIndex meta null")
      }

      const indexJson = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${payload.devdocs}/index.json?${meta.mtime}`)
        .json<DevdocIndex>()
      const indexWithKey: Array<DevdocEntrieWithKey> = indexJson.entries.map((e) => ({
        ...e,
        key: payload.code,
        shortkeys: payload.shortkeys,
        url: getEntrieUrl(e, meta),
      }))
      actions.concatIndexs(indexWithKey)
    } catch (err) {
      console.error("DevdocsUnitedModel.pushIndexs", err)
    }
  }),
  loadIndexsByKeys: thunk(async (actions, payload, { getState }) => {
    const { keys, indexs } = getState()
    actions.setIndexs(indexs.filter((e) => payload.includes(e.key)))

    const addedCodes = payload.filter((c) => !keys.some((k) => k.code === c))
    addedCodes.forEach((c) => {
      const key = SKeys.find((k) => k.code === c)
      if (!key) throw new Error(`changeIndexsByKeys addedCodes:${c} null`)
      actions.pushIndexs(key)
    })

    const newKeys = payload.map((c) => {
      const key = SKeys.find((k) => k.code === c)
      if (!key) throw new Error(`changeIndexsByKeys newKeys:${c} null`)
      return key
    })
    actions.setKeys(newKeys)
  }),

  queryItems: computed(
    [(state) => state.indexs, (state) => state.keys, (state, storeState) => storeState.search.query],
    (indexs, keys, query) => {
      if (!query) return []
      let pquery = query
      let pindexs = indexs

      const querySp = query.split(":")
      if (querySp.length > 1) {
        const keytext = querySp[0]
        const key = keys.find((k) => k.code === keytext || k.shortkeys === keytext)
        if (key) {
          pindexs = indexs.filter((i) => i.key === key.code)
          pquery = querySp[1]
        }
      }

      const fuse = new Fuse(pindexs, fuseOptions)
      const result = fuse.search<DevdocEntrieWithKey>(pquery).slice(0, 15)
      return FuseHighlight(result, [`<span class="highlight">`, "</span>"])
    }
  ),
  queryIndex: 0,
  setQueryIndex: action((state, payload) => {
    state.queryIndex = payload
  }),
  onQueryChange: actionOn(
    (actions, storeActions) => storeActions.search.setQuery,
    (state, target) => {
      state.queryIndex = 0
    }
  ),

  currentMeta: null,
  setCurrentMeta: action((state, payload) => {
    state.currentMeta = payload
  }),

  currentMenus: [],
  setCurrentMenus: action((state, payload) => {
    state.currentMenus = payload
  }),

  expandings: {},
  toggleExpanding: action((state, type) => {
    state.expandings[type] = !state.expandings[type]
  }),
  cleanExpandings: action((state) => {
    for (const [key] of Object.entries(state.expandings)) {
      state.expandings[key] = false
    }
  }),
  expandByPath: action((state, path) => {
    const item = state.indexs.find((i) => i.path === path)
    if (item) {
      for (const [key] of Object.entries(state.expandings)) {
        state.expandings[key] = false
      }
      state.expandings[item.type] = true
    }
  }),

  currentPath: "",
  setCurrentPath: action((state, payload) => {
    state.currentPath = payload
  }),

  docs: "",
  setDocs: action((state, payload) => {
    state.docs = payload
  }),

  selectPath: thunk(async (actions, { code, path }, { getState, getStoreState, getStoreActions }) => {
    if (path === getState().currentPath) {
      actions.setQueryIndex(0)
      getStoreActions().search.setQuery("")
      return
    }

    const key = getState().keys.find((k) => k.code === code)
    if (!key) return

    const meta = getStoreState().storage.metas.find((m) => m.slug === key.devdocs)
    if (!meta) return
    actions.setCurrentMeta(meta)

    const index = getState().indexs.filter((i) => i.key === code)
    const menus = Object.entries(groupBy(index, "type"))
      .map(([group, entries]) => ({ group, entries }))
      .sort((a, b) => a.group.localeCompare(b.group))
    actions.setCurrentMenus(menus)

    winSearchParams({ docscode: code, docspath: path })

    actions.expandByPath(path)
    actions.setCurrentPath(path)
    actions.setQueryIndex(0)
    actions.setDocs("")
    getStoreActions().search.setQuery("")

    try {
      actions.setDocLoading(true)
      const html = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${meta.slug}/${path.split("#")[0]}.html?${meta.mtime}`)
        .text()
      actions.setDocs(html)
    } catch (err) {
      console.error("DevdocsModel.selectDoc", err)
    }
    actions.setDocLoading(false)
  }),
}

export default devdocsUnitedModel

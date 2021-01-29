import { Action, action, Thunk, thunk, Computed, computed, ActionOn, actionOn, ThunkOn, thunkOn } from "easy-peasy"
import ky from "ky"
import groupBy from "lodash/groupBy"
import shortid from "shortid"
import Fuse from "fuse.js"
import FuseHighlight from "../utils/fuse_highlight"
import { setupPathParams, getPathParam } from "../utils/pathParam"
import { StoreModel } from "./index"

const fuseOptions: Fuse.IFuseOptions<DevdocEntrie> = {
  keys: ["name", "type"],
  threshold: 0.3,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
}

export interface DevdocEntrie {
  name: string
  path: string
  type: string
  url?: string
  id: string
}

export interface DevdocIndex {
  entries: Array<DevdocEntrie>
  types: Array<{
    name: string
    slug: string
    count: number
  }>
}

export interface DevdocsModel {
  menuLoading: boolean
  setMenuLoading: Action<DevdocsModel, boolean>

  docLoading: boolean
  setDocLoading: Action<DevdocsModel, boolean>

  version: string
  setVersion: Action<DevdocsModel, string>

  indexs: Array<DevdocEntrie>
  setIndexs: Action<DevdocsModel, Array<DevdocEntrie>>
  loadIndex: Thunk<DevdocsModel, void, void, StoreModel>
  menus: Computed<
    DevdocsModel,
    Array<{
      group: string
      entries: Array<DevdocEntrie>
    }>
  >
  onCurrentKeyChange: ThunkOn<DevdocsModel, void, StoreModel>

  queryItems: Computed<DevdocsModel, Array<DevdocEntrie>, StoreModel>
  queryIndex: number
  setQueryIndex: Action<DevdocsModel, number>
  onQueryChange: ActionOn<DevdocsModel, StoreModel>

  expandings: { [type: string]: boolean }
  toggleExpanding: Action<DevdocsModel, string>
  expandByPath: Action<DevdocsModel, string>

  currentPath: string
  setCurrentPath: Action<DevdocsModel, string>

  docs: string
  setDocs: Action<DevdocsModel, string>

  selectPath: Thunk<DevdocsModel, string, void, StoreModel>
}

const devdocsModel: DevdocsModel = {
  menuLoading: false,
  setMenuLoading: action((state, payload) => {
    state.menuLoading = payload
  }),

  docLoading: false,
  setDocLoading: action((state, payload) => {
    state.docLoading = payload
  }),

  version: "",
  setVersion: action((state, payload) => {
    state.version = payload
  }),

  indexs: [],
  setIndexs: action((state, payload) => {
    state.indexs = payload
  }),
  loadIndex: thunk(async (actions, payload, { getStoreState, getStoreActions }) => {
    actions.setMenuLoading(true)
    try {
      const { currentKey } = getStoreState().searchKeys
      const { metas } = getStoreState().storage
      const meta = metas.find((m) => m.slug === currentKey.devdocs)
      if (!meta) {
        throw new Error(`loadIndex meta ${currentKey.devdocs} null`)
      }

      const indexJson = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${currentKey.devdocs}/index.json?${meta.mtime}`)
        .json<DevdocIndex>()
      const indexWithId: Array<DevdocEntrie> = indexJson.entries.map((e) => ({
        ...e,
        id: shortid.generate(),
      }))
      actions.setIndexs(indexWithId)
      actions.setVersion(meta.release)
      // getStoreActions().display.setExpandView(true)
    } catch (err) {
      console.warn("DevdocsModel.loadIndex", err)
    }
    actions.setMenuLoading(false)
  }),
  menus: computed((state) =>
    Object.entries(groupBy(state.indexs, "type"))
      .map(([group, entries]) => ({ group, entries }))
      .sort((a, b) => a.group.localeCompare(b.group))
  ),
  onCurrentKeyChange: thunkOn(
    (actions, storeActions) => storeActions.searchKeys.setCurrentKey,
    async (actions, target) => {
      if (target.payload.devdocs) {
        await actions.loadIndex()
        actions.setDocs("")
        const path = getPathParam("docspath")
        if (path) {
          actions.selectPath(path)
        }
      }
    }
  ),

  queryItems: computed([(state) => state.indexs, (state, storeState) => storeState.search.query], (indexs, query) => {
    if (!query) return []
    const fuse = new Fuse(indexs, fuseOptions)
    const result = fuse.search<DevdocEntrie>(query).slice(0, 15)
    return FuseHighlight(result, [`<span class="highlight">`, "</span>"])
  }),
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

  expandings: {},
  toggleExpanding: action((state, type) => {
    state.expandings[type] = !state.expandings[type]
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

  selectPath: thunk(async (actions, path, { getStoreState, getStoreActions }) => {
    setupPathParams({ docspath: path })
    actions.expandByPath(path)
    actions.setCurrentPath(path)
    actions.setQueryIndex(0)
    actions.setDocs("")
    getStoreActions().search.setQuery("")

    const { metas } = getStoreState().storage
    const { currentKey } = getStoreState().searchKeys

    try {
      const meta = metas.find((m) => m.slug === currentKey.devdocs)
      if (!meta) {
        throw new Error("selectPath meta null")
      }
      actions.setDocLoading(true)
      const html = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${currentKey.devdocs}/${path.split("#")[0]}.html?${meta.mtime}`)
        .text()
      actions.setDocs(html)
    } catch (err) {
      console.error("DevdocsModel.selectDoc", err)
    }
    actions.setDocLoading(false)
  }),
}

export default devdocsModel

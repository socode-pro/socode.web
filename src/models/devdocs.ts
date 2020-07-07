import { Action, action, Thunk, thunk, Computed, computed, ActionOn, actionOn, ThunkOn, thunkOn } from "easy-peasy"
import ky from "ky"
import groupBy from "lodash/groupBy"
import Fuse from "fuse.js"
import FuseHighlight from "../utils/fuse_highlight"
import { winSearchParams } from "../utils/assist"
import { StoreModel } from "./index"

const fuseOptions: Fuse.IFuseOptions<DevdocEntrie> = {
  keys: ["name", "type"],
  threshold: 0.3,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
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

export interface DevdocEntrie {
  name: string
  path: string
  type: string
  url?: string
}

interface DevdocIndex {
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

  metas: DevdocMeta[]
  setMetas: Action<DevdocsModel, DevdocMeta[]>
  initialMetas: Thunk<DevdocsModel, void>

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
  cleanExpandings: Action<DevdocsModel>
  expandByPath: Action<DevdocsModel, string>

  currentPath: string
  setCurrentPath: Action<DevdocsModel, string>

  docs: string
  setDocs: Action<DevdocsModel, string>

  selectPath: Thunk<DevdocsModel, string, void, StoreModel>
}

const DevdocsModel: DevdocsModel = {
  menuLoading: false,
  setMenuLoading: action((state, payload) => {
    state.menuLoading = payload
  }),

  docLoading: false,
  setDocLoading: action((state, payload) => {
    state.docLoading = payload
  }),

  metas: [],
  setMetas: action((state, payload) => {
    state.metas = payload
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

  version: "",
  setVersion: action((state, payload) => {
    state.version = payload
  }),

  indexs: [],
  setIndexs: action((state, payload) => {
    state.indexs = payload
  }),
  loadIndex: thunk(async (actions, payload, { getState, getStoreState, getStoreActions }) => {
    actions.setMenuLoading(true)
    try {
      const { currentKey } = getStoreState().searchKeys
      let meta = getState().metas.find((m) => m.slug === currentKey.devdocs)
      if (!meta) {
        await actions.initialMetas()
        meta = getState().metas.find((m) => m.slug === currentKey.devdocs)
        if (!meta) {
          throw new Error("loadIndex meta null")
        }
      }

      const indexJson = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${currentKey.devdocs}/index.json?${meta.mtime}`)
        .json<DevdocIndex>()
      actions.setIndexs(indexJson.entries)
      actions.setVersion(meta.release)
      getStoreActions().display.setExpandView(true)
    } catch (err) {
      console.error("DevdocsModel.initialIndex", err)
    }
    actions.cleanExpandings()
    actions.setMenuLoading(false)
  }),
  menus: computed((state) =>
    Object.entries(groupBy(state.indexs, "type"))
      .map(([group, entries]) => ({ group, entries }))
      .sort((a, b) => a.group.localeCompare(b.group))
  ),
  onCurrentKeyChange: thunkOn(
    (actions, storeActions) => storeActions.searchKeys.setCurrentKey,
    (actions, target) => {
      if (target.payload.devdocs) {
        actions.loadIndex()
        actions.setDocs("")
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

  selectPath: thunk(async (actions, path, { getState, getStoreState, getStoreActions }) => {
    if (path === getState().currentPath) return

    winSearchParams({ devdocs: path })
    actions.expandByPath(path)
    actions.setCurrentPath(path)
    actions.setQueryIndex(0)
    actions.setDocs("")
    getStoreActions().search.setQuery("")

    const { metas } = getState()
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

export default DevdocsModel

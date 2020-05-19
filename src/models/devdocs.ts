import { Action, action, Thunk, thunk, Computed, computed, ActionOn, actionOn, ThunkOn, thunkOn } from "easy-peasy"
import ky from "ky"
import Fuse from "fuse.js"
import groupBy from "lodash/groupBy"
import set from "lodash/set"
import { StoreModel } from "./index"

const fuseOptions: Fuse.IFuseOptions<DevDocEntrie> = {
  keys: ["name", "type"],
  threshold: 0.3,
  includeMatches: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
}

// https://github.com/krisk/Fuse/issues/6#issuecomment-455813098
type RangeTuple = [number, number]
const highlightedText = (inputText: string, regions: ReadonlyArray<RangeTuple> = []): string => {
  let content = ""
  let nextUnhighlightedRegionStartingIndex = 0

  regions.forEach((region) => {
    const lastRegionNextIndex = region[1] + 1

    content += [
      inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
      `<span class="highlight">`,
      inputText.substring(region[0], lastRegionNextIndex),
      "</span>",
    ].join("")

    nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
  })

  content += inputText.substring(nextUnhighlightedRegionStartingIndex)
  return content
}

const FuseHighlight = (result: Fuse.FuseResult<DevDocEntrie>[]): Array<DevDocEntrie> => {
  return result.map(({ item, matches }) => {
    const highlightedItem = { ...item }
    if (matches) {
      matches.forEach((match: Fuse.FuseResultMatch) => {
        if (match.key && match.value) {
          set(highlightedItem, match.key, highlightedText(match.value, match.indices))
        }
      })
    }
    return highlightedItem
  })
}

export interface DevDocMeta {
  name: string
  slug: string
  type: string
  mtime: number
  db_size: number
}

export interface DevDocEntrie {
  name: string
  path: string
  type: string
}

interface DevDocIndex {
  entries: Array<DevDocEntrie>
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

  metas: DevDocMeta[]
  setMetas: Action<DevdocsModel, DevDocMeta[]>
  initialMetas: Thunk<DevdocsModel, void>

  indexs: Array<DevDocEntrie>
  setIndexs: Action<DevdocsModel, Array<DevDocEntrie>>
  loadIndex: Thunk<DevdocsModel, void, void, StoreModel>
  menus: Computed<
    DevdocsModel,
    Array<{
      group: string
      entries: Array<DevDocEntrie>
    }>
  >
  onCurrentKeyChange: ThunkOn<DevdocsModel, void, StoreModel>

  queryItems: Computed<DevdocsModel, Array<DevDocEntrie>, StoreModel>
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

const devdocsModel: DevdocsModel = {
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
      const metas = await ky.get(`${process.env.REACT_APP_DOC_HOST}/docs.json`).json<DevDocMeta[]>()
      if (metas !== null) {
        actions.setMetas(metas)
      }
    } catch (err) {
      console.error(err)
    }
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
          throw new Error("meta null")
        }
      }

      const indexJson = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${currentKey.devdocs}/index.json?${meta.mtime}`)
        .json<DevDocIndex>()
      actions.setIndexs(indexJson.entries)
      getStoreActions().search.setExpandView(true)
    } catch (err) {
      console.error("devdocsModel.initialIndex", err)
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
      actions.loadIndex()
      actions.setDocs("")
    }
  ),

  queryItems: computed([(state) => state.indexs, (state, storeState) => storeState.search.query], (indexs, query) => {
    if (!query) return []
    const fuse = new Fuse(indexs, fuseOptions)
    const result = fuse.search<DevDocEntrie>(query).slice(0, 15)
    return FuseHighlight(result)
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
    for (const type in state.expandings) {
      if ({}.hasOwnProperty.call(state.expandings, type)) {
        state.expandings[type] = false
      }
    }
  }),
  expandByPath: action((state, path) => {
    const item = state.indexs.find((i) => i.path === path)
    if (item) {
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
    actions.expandByPath(path)
    actions.setCurrentPath(path)
    actions.setQueryIndex(0)
    getStoreActions().search.setQuery("")

    const { metas } = getState()
    const { currentKey } = getStoreState().searchKeys

    try {
      const meta = metas.find((m) => m.slug === currentKey.devdocs)
      if (!meta) {
        throw new Error("meta null")
      }
      actions.setDocLoading(true)
      const html = await ky
        .get(`${process.env.REACT_APP_DOC_HOST}/${currentKey.devdocs}/${path.split("#")[0]}.html?${meta.mtime}`)
        .text()
      actions.setDocs(html)
    } catch (err) {
      console.error("devdocsModel.selectDoc", err)
    }
    actions.setDocLoading(false)
  }),
}

export default devdocsModel

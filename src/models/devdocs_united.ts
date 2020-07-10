import { Action, action, Thunk, thunk, Computed, computed, ThunkOn, thunkOn } from "easy-peasy"
import ky from "ky"
import groupBy from "lodash/groupBy"
import Fuse from "fuse.js"
import SKeys, { SKey } from "../utils/searchkeys"
import FuseHighlight from "../utils/fuse_highlight"
import { StoreModel } from "./index"
import { DevdocMeta, DevdocEntrie, DevdocIndex } from "./devdocs"

export type DevdocEntrieWithKey = DevdocEntrie & { key: string; shortkeys: string }

const fuseOptions: Fuse.IFuseOptions<DevdocEntrieWithKey> = {
  keys: ["name", "type"],
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
  keys: Array<SKey>
  setKeys: Action<DevdocsUnitedModel, Array<SKey>>

  indexs: Array<DevdocEntrieWithKey>
  setIndexs: Action<DevdocsUnitedModel, Array<DevdocEntrieWithKey>>
  pushIndexs: Action<DevdocsUnitedModel, Array<DevdocEntrieWithKey>>
  loadIndexs: Thunk<DevdocsUnitedModel, SKey, void, StoreModel>
  onKeysChange: ThunkOn<DevdocsUnitedModel, void, StoreModel>

  menus: Computed<
    DevdocsUnitedModel,
    Array<{
      group: string
      entries: Array<DevdocEntrie>
    }>
  >

  queryItems: Computed<DevdocsUnitedModel, Array<DevdocEntrieWithKey>, StoreModel>
}

const devdocsUnitedModel: DevdocsUnitedModel = {
  keys: [],
  setKeys: action((state, payload) => {
    state.keys = payload
  }),

  indexs: [],
  setIndexs: action((state, payload) => {
    state.indexs = payload
  }),
  pushIndexs: action((state, payload) => {
    state.indexs = state.indexs.concat(payload)
  }),
  loadIndexs: thunk(async (actions, payload, { getStoreState, getStoreActions }) => {
    try {
      let meta = getStoreState().devdocs.metas.find((m) => m.slug === payload.devdocs)
      if (!meta) {
        await getStoreActions().devdocs.initialMetas()
        meta = getStoreState().devdocs.metas.find((m) => m.slug === payload.devdocs)
      }
      if (!meta) {
        throw new Error(`${payload.devdocs} meta null`)
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
      actions.pushIndexs(indexWithKey)
    } catch (err) {
      console.error("DevdocsUnitedModel.loadIndexs", err)
    }
  }),
  onKeysChange: thunkOn(
    (actions, storeActions) => storeActions.profile.setSettings,
    async (actions, target, { getState }) => {
      const { addressBarKeys } = target.payload.settings
      if (!addressBarKeys) return

      const { keys, indexs } = getState()
      actions.setIndexs(indexs.filter((e) => addressBarKeys.includes(e.key)))

      const addedCodes = addressBarKeys.filter((c) => !keys.some((k) => k.code === c))
      addedCodes.forEach((c) => {
        const key = SKeys.find((k) => k.code === c)
        if (!key) throw new Error(`onKeysChange addedCodes:${c} null`)
        actions.loadIndexs(key)
      })

      const newKeys = addressBarKeys.map((c) => {
        const key = SKeys.find((k) => k.code === c)
        if (!key) throw new Error(`onKeysChange newKeys:${c} null`)
        return key
      })
      actions.setKeys(newKeys)
    }
  ),

  menus: computed((state) =>
    Object.entries(groupBy(state.indexs, "type"))
      .map(([group, entries]) => ({ group, entries }))
      .sort((a, b) => a.group.localeCompare(b.group))
  ),

  queryItems: computed(
    [(state) => state.indexs, (state) => state.keys, (state, storeState) => storeState.search.query],
    (indexs, keys, query) => {
      if (!query) return []
      let pquery = query
      let pndexs = indexs

      const querySp = query.split(":")
      if (querySp.length > 1) {
        const keytext = querySp[0]
        const key = keys.find((k) => k.code === keytext || k.shortkeys === keytext)
        if (key) {
          pndexs = indexs.filter((i) => i.key === key.code)
          pquery = querySp[1]
        }
      }

      const fuse = new Fuse(pndexs, fuseOptions)
      const result = fuse.search<DevdocEntrieWithKey>(pquery).slice(0, 15)
      return FuseHighlight(result, [`<span class="highlight">`, "</span>"])
    }
  ),
}

export default devdocsUnitedModel

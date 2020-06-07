import { Action, action, Thunk, thunk, Computed, computed, ActionOn, actionOn } from "easy-peasy"
import without from "lodash/without"
import ky from "ky"
import Fuse from "fuse.js"
import SKeys, { SKey, IsExpandWidthViewKey } from "../utils/searchkeys"
import { StoreModel } from "./index"

const fuseOptions: Fuse.IFuseOptions<SKey> = {
  keys: ["name", "shortkeys"],
  threshold: 0.3,
}

export interface SearchKeysModel {
  kquery: string
  setKquery: Action<SearchKeysModel, string>

  keys: Array<SKey>
  setKeys: Action<SearchKeysModel, Array<SKey>>
  initialKeys: Thunk<SearchKeysModel>

  pins: Array<string>
  addPin: Action<SearchKeysModel, string>
  removePin: Action<SearchKeysModel, string>
  pinKeys: Computed<SearchKeysModel, Array<SKey>>

  computedKeys: Computed<SearchKeysModel, Array<SKey>, StoreModel>
  searchedKeys: Computed<SearchKeysModel, Array<SKey>>

  currentKey: SKey
  setCurrentKey: Action<SearchKeysModel, SKey>
  initialCurrentKey: Thunk<SearchKeysModel, void, void, StoreModel>

  keyIndex: number
  setKeyIndex: Action<SearchKeysModel, number>
  onKQueryChange: ActionOn<SearchKeysModel, StoreModel>
}

const searchKeysModel: SearchKeysModel = {
  kquery: "",
  setKquery: action((state, payload) => {
    state.kquery = payload
  }),

  keys: SKeys,
  setKeys: action((state, payload) => {
    state.keys = payload
  }),
  initialKeys: thunk(async (actions) => {
    try {
      const skeys = await ky.get(`${process.env.REACT_APP_KEYS_HOST}/searchkeys.json`).json<Array<SKey>>()
      if (skeys !== null) {
        actions.setKeys(skeys)
      }
    } catch (err) {
      console.error(err)
    }
  }),

  pins: localStorage.getItem("pins")?.split(",") || [],
  addPin: action((state, pin) => {
    state.pins = [pin, ...state.pins]
    localStorage.setItem("pins", state.pins.toString())
  }),
  removePin: action((state, pin) => {
    state.pins = without(state.pins, pin)
    localStorage.setItem("pins", state.pins.toString())
  }),
  pinKeys: computed((state) => state.keys.filter((k) => state.pins.includes(k.code))),

  computedKeys: computed(
    [
      (state) => state.keys,
      (state) => state.pins,
      (state, storeState) => storeState.profile.settings.language,
      (state, storeState) => storeState.storage.ousideFirewall,
    ],
    (keys, pins, language, ousideFirewall) => {
      const computedKeys = keys.filter((key) => {
        if (key.availableLang) {
          return key.availableLang === language
        }
        if (key.disableLang) {
          return key.disableLang !== language
        }
        if (key.firewalled && !ousideFirewall) {
          return false
        }
        return true
      })
      computedKeys.forEach((k) => {
        k.pin = pins.includes(k.code)
      })
      return computedKeys.sort((a) => (a.usage ? -1 : 0))
    }
  ),

  searchedKeys: computed((state) => {
    let ckeys = state.keys
    if (state.kquery) {
      const fuse = new Fuse(ckeys, fuseOptions)
      ckeys = fuse.search<SKey>(state.kquery).map((r) => r.item)
    }
    return ckeys
  }),

  currentKey: SKeys.find((k) => k.code === "github") || SKeys[0],
  setCurrentKey: action((state, payload) => {
    state.keyIndex = 0
    state.currentKey = payload
    localStorage.setItem("currentKey", payload.code)
  }),
  initialCurrentKey: thunk(async (actions, payload, { getState }) => {
    const { keys } = getState()
    const params = new URLSearchParams(window.location.search)

    if (params.has("k")) {
      const key = keys.find((k) => k.code === params.get("k"))
      if (key) {
        actions.setCurrentKey(key)
        return
      }
    }

    const code = localStorage.getItem("currentKey")
    const key = keys.find((k) => k.code === code)
    if (key && !key.devdocs && !IsExpandWidthViewKey(key)) {
      actions.setCurrentKey(key)
    }
  }), // do not change to [action] for support actionOn

  keyIndex: 0,
  setKeyIndex: action((state, payload) => {
    state.keyIndex = payload
  }),
  onKQueryChange: actionOn(
    (actions) => actions.setKquery,
    (state) => {
      state.keyIndex = 0
    }
  ),
}

export default searchKeysModel

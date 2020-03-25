import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import without from 'lodash/without'
import ky from 'ky'
import Fuse from 'fuse.js'
import SKeys, { SKey } from '../utils/searchkeys'
import { StoreModel } from './index'

const fuseOptions: Fuse.FuseOptions<SKey> = {
  keys: ['name', 'shortkeys'],
  threshold: 0.3,
  maxPatternLength: 8,
}

const defaultDisplayMore = (): boolean => {
  const value = localStorage.getItem('displayMore')
  return value? value !== 'false': false
}

export interface SearchKeysModel {
  kquery: string
  setKquery: Action<SearchKeysModel, string>

  keys: Array<SKey>
  setKeys: Action<SearchKeysModel, Array<SKey>>
  initialKeys: Thunk<SearchKeysModel>
  computedKeys: Computed<SearchKeysModel, Array<SKey>, StoreModel>

  pins: Array<string>
  addPin: Action<SearchKeysModel, string>
  removePin: Action<SearchKeysModel, string>

  pinKeys: Computed<SearchKeysModel, Array<SKey>>
  usageKeys: Computed<SearchKeysModel, Array<SKey>>
  moreKeys: Computed<SearchKeysModel, Array<SKey>>

  displayMore: boolean
  setDisplayMore: Action<SearchKeysModel, boolean>

  currentKey: SKey
  setCurrentKey: Action<SearchKeysModel, SKey>
  initialCurrentKey: Action<SearchKeysModel>
}

const searchKeysModel: SearchKeysModel = {
  kquery: '',
  setKquery: action((state, payload) => {
    state.kquery = payload
  }),

  keys: SKeys,
  setKeys: action((state, payload) => {
    state.keys = payload
  }),
  initialKeys: thunk(async actions => {
    try {
      const skeys = await ky.get(`${process.env.REACT_APP_KEYS_HOST}/searchkeys.json`).json<Array<SKey>>()
      if (skeys !== null) {
        actions.setKeys(skeys)
      }
    } catch (err) {
      console.error(err)
    }
  }),

  computedKeys: computed(
    [
      state => state.keys,
      state => state.kquery,
      (state, storeState) => state.pins,
    ],
    (keys, kquery, pins) => {
      let kk = keys
      if (kquery) {
        const fuse = new Fuse(kk, fuseOptions)
        kk = fuse.search<SKey, false, false>(kquery)
      }
      if (pins && pins.length) {
        kk.forEach(k => {
          k.pin = pins.includes(k.code)
        })
      }
      return kk
    }
  ),

  pins: localStorage.getItem('pins')?.split(',') || [],
  addPin: action((state, pin) => {
    state.pins = [pin, ...state.pins]
    localStorage.setItem('pins', state.pins.toString())
  }),
  removePin: action((state, pin) => {
    state.pins = without(state.pins, pin)
    localStorage.setItem('pins', state.pins.toString())
  }),

  pinKeys: computed(state =>
    state.computedKeys.filter(k => k.pin)
  ),

  usageKeys: computed(state =>
    state.computedKeys.filter(k => !k.pin && k.usage)
  ),

  moreKeys: computed(state =>
    state.computedKeys.filter(k => !k.pin && !k.usage)
  ),

  displayMore: defaultDisplayMore(),
  setDisplayMore: action((state, payload) => {
    state.displayMore = payload
    localStorage.setItem('displayMore', payload.toString())
  }),

  currentKey: SKeys.find(k => k.code === 'github') || SKeys[0],
  setCurrentKey: action((state, payload) => {
    state.currentKey = payload
    localStorage.setItem('currentKey', payload.code)
  }),
  initialCurrentKey: action((state) => {
    let key
    const params = new URLSearchParams(window.location.search)
    if (params.has('k')) {
      key = state.keys.find(k => k.code === params.get('k'))
    }
    if (!key) {
      const code = localStorage.getItem('currentKey')
      key = state.keys.find(k => k.code === code)
    }
    if (key) {
      state.currentKey = key
    }
  }),
}

export default searchKeysModel

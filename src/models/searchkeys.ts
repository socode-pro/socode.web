import { Action, action, Thunk, thunk, Computed, computed } from 'easy-peasy'
import ky from 'ky'
import Fuse from 'fuse.js'
import SKeys, { SKey } from '../utils/searchkeys'
import { StoreModel } from './index'
import * as config from '../config'

const fuseOptions: Fuse.FuseOptions<SKey> = {
  keys: ['name', 'shortkeys'],
  threshold: 0.3,
  maxPatternLength: 8,
}

export interface SearchKeysModel {
  kquery: string
  setKquery: Action<SearchKeysModel, string>

  keys: Array<SKey>
  setKeys: Action<SearchKeysModel, Array<SKey>>
  initialKeys: Thunk<SearchKeysModel>
  computedKeys: Computed<SearchKeysModel, Array<SKey>, StoreModel>

  pinKeys: Computed<SearchKeysModel, Array<SKey>>
  usageKeys: Computed<SearchKeysModel, Array<SKey>>
  moreKeys: Computed<SearchKeysModel, Array<SKey>>
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
      const skeys = await ky.get(`${config.keyshost()}/searchkeys.json`).json<Array<SKey>>()
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
      (state, storeState) => storeState.storage.values.pins
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

  pinKeys: computed(state =>
    state.computedKeys.filter(k => k.pin)
  ),

  usageKeys: computed(state =>
    state.computedKeys.filter(k => !k.pin && k.usage)
  ),

  moreKeys: computed(state =>
    state.computedKeys.filter(k => !k.pin && !k.usage)
  ),
}

export default searchKeysModel

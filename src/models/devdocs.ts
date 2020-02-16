import { Action, action, Thunk, thunk } from 'easy-peasy'
import Fuse from 'fuse.js'
import keyBy from 'lodash/keyBy'
import { getMetas, getDocIndex, DevDocMeta, DevDocIndex, DevDocEntrie } from '../services/devdocs'

export interface DocResults {
  [index: string]: DevDocEntrie
}

const fuseOptions: Fuse.FuseOptions<DevDocEntrie> = {
  keys: ['name'],
}

export interface DevdocsModel {
  metas: DevDocMeta[]
  setMetas: Action<DevdocsModel, DevDocMeta[]>

  indexs: {
    [key: string]: DevDocIndex
  }
  setIndexs: Action<DevdocsModel, { slug: string; index: DevDocIndex }>

  results: DocResults
  setResults: Action<DevdocsModel, { slug: string; query: string }>

  Initial: Thunk<DevdocsModel>
  getDocIndex: Thunk<DevdocsModel, DevDocMeta>
}

const devdocsModel: DevdocsModel = {
  metas: [],
  setMetas: action((state, payload) => {
    try {
      localStorage.setItem('devdoc_metas', JSON.stringify(payload))
      state.metas = payload
    } catch (err) {
      console.error(err)
    }
  }),

  indexs: {},
  setIndexs: action((state, payload) => {
    try {
      localStorage.setItem(`devdoc_${payload.slug}`, JSON.stringify(payload.index))
      state.indexs = { ...state.indexs, [payload.slug]: payload.index }
    } catch (err) {
      console.error(err)
    }
  }),

  results: {},
  setResults: action((state, payload) => {
    const index = state.indexs[payload.slug]
    const fuse = new Fuse(index.entries, fuseOptions)
    const items = fuse.search<DevDocEntrie, false, false>(payload.query)
    const results = keyBy(items, 'type')
    state.results = results
  }),

  Initial: thunk(async actions => {
    const metas = await getMetas()
    if (metas !== null) actions.setMetas(metas)
  }),
  getDocIndex: thunk(async (actions, payload) => {
    const index = await getDocIndex(payload)
    if (index !== null) actions.setIndexs({ slug: payload.slug, index })
  }),
}

export default devdocsModel

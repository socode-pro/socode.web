import { Action, action, Thunk, thunk } from 'easy-peasy'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import groupBy from 'lodash/groupBy'
import { Injections } from '../store'
import { DevDocMeta, DevDocIndex, DevDocEntrie } from '../services/devdocs.service'

export interface DocResults {
  [index: string]: Array<DevDocEntrie>
}

const fuseOptions: Fuse.FuseOptions<DevDocEntrie> = {
  keys: ['name'],
}

export interface DevdocsModel {
  metas: DevDocMeta[]
  setMetas: Action<DevdocsModel, { metas: DevDocMeta[]; setTime?: boolean }>
  initial: Thunk<DevdocsModel, void, Injections>

  indexs: {
    [key: string]: DevDocIndex
  }
  setIndexs: Action<DevdocsModel, { slug: string; index: DevDocIndex; setTime?: boolean }>
  initialIndex: Thunk<DevdocsModel, string>

  results: DocResults
  search: Action<DevdocsModel, { slug: string; query: string }>

  expandings: { [index: string]: boolean }
  expand: Action<DevdocsModel, string>

  docs: { [index: string]: string }
  setDocs: Action<DevdocsModel, { slug: string; path: string; doc: string }>
  currentDocKey: string
  setCurrentDocKey: Action<DevdocsModel, string>
  selectDoc: Thunk<DevdocsModel, { slug: string; path: string }>
}

const devdocsModel: DevdocsModel = {
  metas: [],
  setMetas: action((state, payload) => {
    try {
      localStorage.setItem('devdoc_metas', JSON.stringify(payload))
      state.metas = payload.metas
      if (payload.setTime) {
        localStorage.setItem('devdoc_metas_time', dayjs().toJSON())
      }
    } catch (err) {
      console.error(err)
    }
  }),
  initial: thunk(async (actions, payload, { injections }) => {
    try {
      const time = localStorage.getItem('devdoc_metas_time')
      if (
        time &&
        dayjs(time)
          .add(4, 'hour')
          .isAfter(dayjs())
      ) {
        const metasString = localStorage.getItem('devdoc_metas')
        if (metasString) {
          actions.setMetas({ metas: JSON.parse(metasString) })
          return
        }
      }

      const metas = await injections.devdocsService.getMetas()
      if (metas !== null) {
        actions.setMetas({ metas, setTime: true })
      }
    } catch (err) {
      console.error(err)
    }
  }),

  indexs: {},
  setIndexs: action((state, payload) => {
    try {
      localStorage.setItem(`devdoc_${payload.slug}`, JSON.stringify(payload.index))
      state.indexs = { ...state.indexs, [payload.slug]: payload.index }
      if (payload.setTime) {
        localStorage.setItem(`devdoc_${payload.slug}_time`, dayjs().toJSON())
      }
    } catch (err) {
      console.error(err)
    }
  }),
  initialIndex: thunk(async (actions, payload, { injections, getState }) => {
    if (getState().indexs[payload]) return

    try {
      const meta = getState().metas.find(m => m.name === payload)
      if (!meta) {
        throw new Error('meta null')
      }

      const time = localStorage.getItem(`devdoc_${meta.slug}_time`)
      if (time && meta.mtime <= parseInt(time, 10)) {
        const indexString = localStorage.getItem(`devdoc_${meta.slug}`)
        if (indexString) {
          actions.setIndexs({ slug: meta.slug, index: JSON.parse(indexString) })
          return
        }
      }

      const index = await injections.devdocsService.getDocIndex(payload)
      if (index !== null) {
        actions.setIndexs({ slug: meta.slug, index, setTime: true })
      }
    } catch (err) {
      console.error(err)
    }
  }),

  results: {},
  search: action((state, payload) => {
    const index = state.indexs[payload.slug]
    let items = index.entries
    if (payload.query) {
      const fuse = new Fuse(index.entries, fuseOptions)
      items = fuse.search<DevDocEntrie, false, false>(payload.query)
    }
    const results = groupBy(items, 'type')
    state.results = results
  }),

  expandings: {},
  expand: action((state, payload) => {
    state.expandings[payload] = !state.expandings[payload]
    // state.expandings = { ...state.expandings }
  }),

  docs: {},
  setDocs: action((state, payload) => {
    const dockey = `${payload.slug}_${payload.path}`
    state.docs[dockey] = payload.doc
  }),
  currentDocKey: '',
  setCurrentDocKey: action((state, payload) => {
    state.currentDocKey = payload
  }),
  selectDoc: thunk(async (actions, payload, { injections, getState }) => {
    const dockey = `${payload.slug}_${payload.path}`
    actions.setCurrentDocKey(dockey)

    if (getState().docs[dockey]) return

    const doc = await injections.devdocsService.getDoc(payload)
    if (doc !== null) {
      actions.setDocs({ ...payload, doc })
    }
  }),
}

export default devdocsModel

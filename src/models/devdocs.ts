import { Action, action, Thunk, thunk } from 'easy-peasy'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import groupBy from 'lodash/groupBy'
import { Injections } from '../store'
import { DevDocMeta, DevDocEntrie } from '../services/devdocs.service'

const fuseOptions: Fuse.FuseOptions<DevDocEntrie> = {
  keys: ['name'],
}

export interface DevdocsModel {
  metas: DevDocMeta[]
  setMetas: Action<DevdocsModel, { metas: DevDocMeta[]; setTime?: boolean }>
  initialMetas: Thunk<DevdocsModel, void, Injections>

  indexs: {
    [slug: string]: Array<DevDocEntrie>
  }
  setIndexs: Action<DevdocsModel, { slug: string; index: Array<DevDocEntrie>; setTime?: boolean }>
  initialIndex: Thunk<DevdocsModel, string>

  results: {
    [type: string]: Array<DevDocEntrie>
  }
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
      localStorage.setItem('devdoc_metas', JSON.stringify(payload.metas))
      state.metas = payload.metas
      if (payload.setTime) {
        localStorage.setItem('devdoc_metas_time', dayjs().toJSON())
      }
    } catch (err) {
      console.error(err)
    }
  }),
  initialMetas: thunk(async (actions, payload, { injections }) => {
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
      state.indexs[payload.slug] = payload.index
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
      let meta = getState().metas.find(m => m.slug === payload)
      if (!meta) {
        await actions.initialMetas()
        meta = getState().metas.find(m => m.slug === payload)
        if (!meta) {
          throw new Error('meta null')
        }
      }

      const time = localStorage.getItem(`devdoc_${meta.slug}_time`)
      if (time && meta.mtime <= parseInt(time, 10)) {
        const indexString = localStorage.getItem(`devdoc_${meta.slug}`)
        if (indexString) {
          actions.setIndexs({ slug: meta.slug, index: JSON.parse(indexString) })
          return
        }
      }

      const json = await injections.devdocsService.getDocIndex(meta)
      if (json !== null) {
        actions.setIndexs({ slug: meta.slug, index: json.entries, setTime: true })
      }
    } catch (err) {
      console.error(err)
    }
  }),

  results: {},
  search: action((state, payload) => {
    const index = state.indexs[payload.slug]
    if (!index) return

    let items = index
    if (payload.query) {
      const fuse = new Fuse(items, fuseOptions)
      items = fuse.search<DevDocEntrie, false, false>(payload.query)
    }
    state.results = groupBy(items, 'type')
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

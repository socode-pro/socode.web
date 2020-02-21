import { Action, action, Thunk, thunk } from 'easy-peasy'
import Fuse from 'fuse.js'
import dayjs from 'dayjs'
import groupBy from 'lodash/groupBy'
import { Injections } from '../store'
import { DevDocMeta, DevDocEntrie } from '../services/devdocs.service'

const fuseOptions: Fuse.FuseOptions<DevDocEntrie> = {
  keys: ['name'],
  threshold: 0.3,
  maxPatternLength: 16,
}

export interface DevdocsModel {
  loading: boolean
  setLoading: Action<DevdocsModel, boolean>

  docLoading: boolean
  setDocLoading: Action<DevdocsModel, boolean>

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

  expandings: { [type: string]: boolean }
  toggleExpanding: Action<DevdocsModel, string>
  expand: Action<DevdocsModel, { slug: string; path: string }>

  docs: { [index: string]: string }
  setDocs: Action<DevdocsModel, { slug: string; path: string; doc: string }>
  currentPath: string
  setCurrentPath: Action<DevdocsModel, string>
  selectDoc: Thunk<DevdocsModel, { slug: string; path: string }>
}

const devdocsModel: DevdocsModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),
  docLoading: false,
  setDocLoading: action((state, payload) => {
    state.docLoading = payload
  }),

  metas: [],
  setMetas: action((state, { metas, setTime }) => {
    try {
      localStorage.setItem('devdoc_metas', JSON.stringify(metas))
      state.metas = metas
      if (setTime) {
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
  setIndexs: action((state, { slug, index, setTime }) => {
    try {
      localStorage.setItem(`devdoc_${slug}`, JSON.stringify(index))
      state.indexs[slug] = index
      if (setTime) {
        localStorage.setItem(`devdoc_${slug}_time`, dayjs().toJSON())
      }
    } catch (err) {
      console.error(err)
    }
  }),
  initialIndex: thunk(async (actions, slug, { injections, getState }) => {
    if (getState().indexs[slug]) return
    actions.setLoading(true)

    try {
      let meta = getState().metas.find(m => m.slug === slug)
      if (!meta) {
        await actions.initialMetas()
        meta = getState().metas.find(m => m.slug === slug)
        if (!meta) {
          throw new Error('meta null')
        }
      }

      const time = localStorage.getItem(`devdoc_${meta.slug}_time`)
      if (time && meta.mtime <= parseInt(time, 10)) {
        const indexString = localStorage.getItem(`devdoc_${meta.slug}`)
        if (indexString) {
          actions.setIndexs({ slug: meta.slug, index: JSON.parse(indexString) })
          actions.setLoading(false)
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
    actions.setLoading(false)
  }),

  results: {},
  search: action((state, { slug, query }) => {
    const index = state.indexs[slug]
    if (!index) return

    let items = index
    if (query) {
      const fuse = new Fuse(items, fuseOptions)
      items = fuse.search<DevDocEntrie, false, false>(query)
    }
    state.results = groupBy(items, 'type')
  }),

  expandings: {},
  toggleExpanding: action((state, type) => {
    state.expandings[type] = !state.expandings[type]
  }),
  expand: action((state, { slug, path }) => {
    const index = state.indexs[slug]
    if (!index) return

    const item = index.find(i => i.path === path)
    if (item) {
      state.expandings[item.type] = true
    }
  }),

  docs: {},
  setDocs: action((state, { slug, path, doc }) => {
    state.docs[`${slug}_${path}`] = doc
  }),
  currentPath: '',
  setCurrentPath: action((state, path) => {
    state.currentPath = path
  }),
  selectDoc: thunk(async (actions, payload, { injections, getState }) => {
    const dockey = `${payload.slug}_${payload.path}`
    actions.setCurrentPath(payload.path)
    if (getState().docs[dockey]) return

    try {
      const meta = getState().metas.find(m => m.slug === payload.slug)
      if (!meta) {
        throw new Error('meta null')
      }
      actions.setDocLoading(true)
      const doc = await injections.devdocsService.getDoc({ mtime: meta.mtime, ...payload })
      if (doc !== null) {
        actions.setDocs({ ...payload, doc })
      }
    } catch (err) {
      console.error(err)
    }
    actions.setDocLoading(false)
  }),
}

export default devdocsModel

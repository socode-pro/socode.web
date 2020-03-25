import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import Fuse from 'fuse.js'
import groupBy from 'lodash/groupBy'
import { StoreModel } from './index'

const fuseOptions: Fuse.FuseOptions<DevDocEntrie> = {
  keys: ['name'],
  threshold: 0.3,
  maxPatternLength: 16,
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
  loading: boolean
  setLoading: Action<DevdocsModel, boolean>

  docLoading: boolean
  setDocLoading: Action<DevdocsModel, boolean>

  metas: DevDocMeta[]
  setMetas: Action<DevdocsModel, DevDocMeta[]>
  initialMetas: Thunk<DevdocsModel, void>

  indexs: {
    [slug: string]: Array<DevDocEntrie>
  }
  setIndexs: Action<DevdocsModel, { slug: string; index: Array<DevDocEntrie> }>
  loadIndex: Thunk<DevdocsModel, string, void, StoreModel>

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

  indexs: {},
  setIndexs: action((state, { slug, index }) => {
    state.indexs[slug] = index
  }),
  loadIndex: thunk(async (actions, slug, { getState, getStoreActions }) => {
    if (getState().indexs[slug]) {
      getStoreActions().search.setExpandView(true)
      return
    }

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

      const indexJson = await ky.get(`${process.env.REACT_APP_DOC_HOST}/${slug}/index.json?${meta.mtime}`).json<DevDocIndex>()
      if (indexJson !== null) {
        actions.setIndexs({ slug: meta.slug, index: indexJson.entries })
        getStoreActions().search.setExpandView(true)
      }
    } catch (err) {
      console.error('devdocsModel.initialIndex', err)
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
  selectDoc: thunk(async (actions, { slug, path }, { getState }) => {
    const dockey = `${slug}_${path}`
    actions.setCurrentPath(path)
    if (getState().docs[dockey]) return

    try {
      const meta = getState().metas.find(m => m.slug === slug)
      if (!meta) {
        throw new Error('meta null')
      }
      actions.setDocLoading(true)
      const doc = await ky.get(`${process.env.REACT_APP_DOC_HOST}/${slug}/${path.split('#')[0]}.html?${meta.mtime}`).text()
      if (doc !== null) {
        actions.setDocs({ slug, path, doc })
      }
    } catch (err) {
      console.error('devdocsModel.selectDoc', err)
    }
    actions.setDocLoading(false)
  }),
}

export default devdocsModel

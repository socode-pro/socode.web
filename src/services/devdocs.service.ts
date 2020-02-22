import ky from 'ky'
import * as config from '../config'

const api = ky.extend({
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [413],
  },
  timeout: 5000,
})

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

export const getMetas = async (): Promise<DevDocMeta[] | null> => {
  try {
    const resp = await api.get(`${config.dochost()}/docs.json`)
    return resp.json()
  } catch (error) {
    console.error('fetch:', error)
  }
  return null
}

export const getDocIndex = async ({ slug, mtime }: DevDocMeta): Promise<DevDocIndex | null> => {
  try {
    const resp = await api.get(`${config.dochost()}/${slug}/index.json?${mtime}`)
    return resp.json()
  } catch (error) {
    console.error('fetch:', error)
  }
  return null
}

export const getDoc = async ({ slug, mtime, path }): Promise<string | null> => {
  try {
    const resp = await api.get(`${config.dochost()}/${slug}/${path.split('#')[0]}.html?${mtime}`)
    return resp.text()
  } catch (error) {
    console.error('fetch:', error)
  }
  return null
}

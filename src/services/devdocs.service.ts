import axios from 'axios'
import * as global from '../config'

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

export interface DevDocIndex {
  entries: Array<DevDocEntrie>
  types: Array<{
    name: string
    slug: string
    count: number
  }>
}

export const getMetas = async (): Promise<DevDocMeta[] | null> => {
  try {
    const resp = await axios.get<DevDocMeta[]>(`${global.dochost()}/docs.json`)
    return resp.data
  } catch (error) {
    console.error(error)
  }
  return null
}

export const getDocIndex = async ({ slug, mtime }: DevDocMeta): Promise<DevDocIndex | null> => {
  try {
    const resp = await axios.get<DevDocIndex>(`${global.dochost()}/${slug}/index.json?${mtime}`)
    return resp.data
  } catch (error) {
    console.error(error)
  }
  return null
}

export const getDoc = async ({ slug, mtime, path }): Promise<string | null> => {
  try {
    const resp = await axios.get<string>(`${global.dochost()}/${slug}/${path}.html?${mtime}`)
    return resp.data
  } catch (error) {
    console.error(error)
  }
  return null
}

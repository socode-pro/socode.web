import axios, { AxiosError } from 'axios'
import qs from 'qs'
import * as env from '../env'

const axiosInstance = axios.create({
  // https://github.com/axios/axios#request-config
  timeout: 5000,
  headers: { 'Access-Control-Allow-Origin': '*' }
})

export enum SearchTimeRange {
  Anytime = '',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export enum SearchLanguage {
  English = 'en',
  中文 = 'zh'
}

export interface SearchResult {
  paging: boolean
  results: Array<SearchItem>
}

export interface SearchItem {
  url: string
  title: string
  content: string
  engine: string
  score: 1.0,
  category: string,
  pretty_url: string
}

export interface SearchParam {
  query: string,
  timeRange?: SearchTimeRange
  language?: SearchLanguage
  pageno?: number
}

const Sites = [
  'stackoverflow.com',
  'stackexchange.com',
  'github.com',
  'gitlab.com',
  'docs.microsoft.com',
  'developer.apple.com',
  'apache.org',
  'docs.oracle.com',
  'python.org',
  'spring.io',
  'reactjs.org',
  'vuejs.org',
  'eslint.org',
  'dev.mysql.com',
  'docs.docker.com',
  'segmentfault.com',
  'zhihu.com',
  'oschina.net',
  'iteye.com',
  'cnblogs.com',
  'csdn.net',
  // 'codecademy.com',
  // 'freecodecamp.org',
  // 'thecrazyprogrammer.com',
  // 'css-tricks.com',
  // 'stackabuse.com',
  // 'codingalpha.com',
]

export const search = async ({
  query,
  timeRange = SearchTimeRange.Anytime,
  language = SearchLanguage.English,
  pageno = 1
}: SearchParam): Promise<SearchResult | null> => {
  const q = `${query} site:${Sites.join(' OR site:')}`
  try {
    const response = await axiosInstance.post<SearchResult>(
      env.host(),
      qs.stringify({
        q,
        category_general: 'on',
        time_range: timeRange,
        language,
        format: 'json',
        pageno
      })
    )
    return response.data
  } catch (error) {
    if (error.isAxiosError) {
      const e: AxiosError = error
      console.warn(`status:${e.response?.status} msg:${e.message}`, e)
      throw e
    }
    console.error(error)
  }
  return null
}

export const Autocompleter = async (q: string): Promise<Array<string>> => {
  try {
    const response = await axiosInstance.get<Array<string>>(`${env.host()}/autocompleter`, {
      params: { q },
      // headers: {
      //   Cookie: 'autocomplete=google;',
      // }
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
  return []
}

import axios, { AxiosError } from 'axios'
import qs from 'qs'
import * as env from '../env'
import Language from '../utils/language'

const axiosInstance = axios.create({
  // https://github.com/axios/axios#request-config
  timeout: 5000,
  headers: { 'Access-Control-Allow-Origin': '*' },
})

export enum SearchTimeRange {
  Anytime = '',
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
}

export interface SearchResult {
  paging: boolean
  results: Array<SearchItem>
  unresponsive_engines: Array<string[]>
}

export interface SearchItem {
  url: string
  title: string
  content: string
  engine: string
  score: 1.0
  category: string
  pretty_url: string
}

export interface SearchParam {
  query: string
  timeRange?: SearchTimeRange
  language?: Language
  pageno?: number
}

const Sites = [
  'ruanyifeng.*', // 100
  'stackoverflow.*', // 95
  'mozilla.*', // 90
  'github.*', // 90
  'digitalocean.*', // 85
  'microsoft.*', // 80
  'dev.to', // 80
  'w3schools.com', // 80
  'infoq.*', // 80
  'stackexchange.*', // 75
  'apache.org', // 75

  'apple.*', // 70
  'ibm.*', // 70
  'v2ex.com', // 70
  'segmentfault.*', // 70
  'zhihu.com', // 70
  'oschina.net', // 60
  'iteye.com', // 60
  'cnblogs.com', // 60
  'juejin.im', // 60
  'weixin.qq.*', // 60

  'mvnrepository.*',
  'npmjs.com',
  'reactjs.org',
  'vuejs.org',
  'eslint.org',
  'visualstudio.*',
  'python.org',
  'golang.org',
  'nuget.org',
  'pypi.org',
  'mysql.com',
  'docker.com',
  'ruby-lang.org',
  'rubygems.org',
]

// shorturl.at/ovOUW too many, infeasible way
const ExcludeSites = ['youtube.*', 'wikipedia.*', 'medium.*', 'twitter.*', 'pornhub.*']

export const search = async ({
  query,
  timeRange = SearchTimeRange.Anytime,
  language = Language.English,
  pageno = 1,
}: SearchParam): Promise<SearchResult | null> => {
  const q = `${query} site:${Sites.join(' OR site:')}`
  // const q = `${query} -site:${ExcludeSites.join(' AND -site:')}`

  try {
    const response = await axiosInstance.post<SearchResult>(
      env.host(),
      qs.stringify({
        q,
        category_general: 'on',
        time_range: timeRange,
        language,
        format: 'json',
        pageno,
      })
    )

    if (response.data.unresponsive_engines.length) {
      console.warn(`unresponsive:${JSON.stringify(response.data.unresponsive_engines)}`)
    }

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

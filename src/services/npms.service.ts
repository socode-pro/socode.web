import ky from 'ky'

const api = ky.extend({
  timeout: 5000,
  prefixUrl: 'https://api.npms.io/v2/',
})

export interface NpmsParam {
  query: string
  pageno?: number
  // deprecated?: boolean
}

export interface NpmsResult {
  total: number
  results: Array<{
    package: NpmsPackage
  }>
}

export interface NpmsPackage {
  name: string
  scope: string
  version: string
  description: string
  date: Date
  links: {
    npm: string
    repository: string
  }
  publisher: {
    username: string
    email: string
  }
}

export const search = async ({ query, pageno }: NpmsParam): Promise<NpmsResult | null> => {
  // deprecated = false
  try {
    const sparams = new URLSearchParams()
    sparams.set('q', query)
    sparams.set('size', '10')
    if (pageno) {
      sparams.set('from', (pageno * 10).toString())
    }
    // if (deprecated) {
    //   sparams.set('not', 'deprecated')
    // }

    const data = await api.get('search', { searchParams: sparams }).json<NpmsResult>()
    return data
  } catch (err) {
    console.error('npms.search:', err)
  }
  return null
}

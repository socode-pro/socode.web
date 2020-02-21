import ky from 'ky'
import algoliasearch from 'algoliasearch'
import * as global from '../config'
import { IsAvoidKeys } from '../utils/skeys'

const api = ky.extend({
  timeout: 2000,
})

export interface SuggestItem {
  // github
  name: string
  watchers?: number
  description?: string
  avator?: string
  owner?: string

  // npm
  version?: string
  publisher?: string
  highlight?: string
  homepage?: string
}

export interface NpmsIOItem {
  package: {
    name: string
    scope: string
    version: string
    description: string
    links: {
      homepage?: string
    }
    publisher: {
      username: string
    }
  }
  highlight: string
}

const NpmSuggester = async (q: string): Promise<Array<SuggestItem>> => {
  try {
    const data = await api.get(`https://api.npms.io/v2/search/suggestions?size=7&q=${q}`).json<NpmsIOItem[]>()
    return data.map(d => {
      return {
        name: d.package.name,
        version: d.package.version,
        description: d.package.description,
        homepage: d.package.links.homepage,
        publisher: d.package.publisher.username,
        highlight: d.highlight,
      }
    })
  } catch (error) {
    console.warn('fetch:', error)
  }
  return []
}

const algolia = algoliasearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3')
const aindex = algolia.initIndex('repositories')
const GithubSuggester = async (query: string): Promise<Array<SuggestItem>> => {
  try {
    const res = await aindex.search<SuggestItem>(query, {
      query,
      hitsPerPage: 5,
      filters: 'watchers>100',
      restrictSearchableAttributes: ['name'],
      attributesToSnippet: ['description:50'],
    })
    return [...res.hits] // fix typescript check issus
  } catch (error) {
    console.warn(error)
  }
  return []
}

const MicrosoftSuggester = async (query: string): Promise<Array<SuggestItem>> => {
  try {
    const data = await api
      .get(`https://docs.microsoft.com/api/search/autocomplete?query=${query}`)
      .json<{ suggestions: Array<string> }>()
    return data.suggestions.map(d => ({ name: d }))
  } catch (error) {
    console.warn('fetch:', error)
  }
  return []
}

// const CaniuseSuggester = async (query: string): Promise<Array<SuggestItem>> => { // CORS
//   try {
//     const data = await api.get(`https://caniuse.com/process/query.php?search=${query}`).json<string>()
//     const result = data.split(',').map(w => {
//       return (
//         w
//           .split('-')
//           .pop()
//           ?.replace('_', ' ') || ''
//       )
//     })
//     return result.filter(r => !r).map(d => ({ name: d }))
//   } catch (error) {
//     console.warn('fetch:', error)
//   }
//   return []
// }

export const Suggester = async (q: string, code: string): Promise<Array<SuggestItem>> => {
  if (code === 'npm' || code === 'bundlephobia') {
    return NpmSuggester(q)
  }
  if (code === 'github') {
    return GithubSuggester(q)
  }
  if (code === 'microsoft') {
    return MicrosoftSuggester(q)
  }
  // if (kname === 'Can I use') {
  //   return CaniuseSuggester(q)
  // }
  if (IsAvoidKeys(code)) {
    return []
  }

  try {
    const data = await api
      .get(`${global.host()}/autocompleter`, {
        searchParams: { q },
      })
      .json<Array<string>>()
    return data.map(d => ({ name: d }))
  } catch (error) {
    console.warn('fetch:', error)
  }
  return []
}

// const gooSuggestUrl = 'https://suggestqueries.google.com/complete/search?client=toolbar&hl=zh-cn&q='
// export const GoogleSuggester = async (q: string): Promise<Array<string>> => { // CORS
//   try {
//     const response = await axios.get<any>(gooSuggestUrl + q, {
//       headers: {
//         Accept: 'text/html,application/xhtml+xml,application/xml;',
//       },
//     })
//     const parser = new DOMParser()
//     const xmlDoc = parser.parseFromString(response.data, 'text/xml')
//     const suggestions = xmlDoc.getElementsByTagName('suggestion')
//     const elements = Array.from(suggestions)
//     const result = elements.map(e => {
//       return e.getAttribute('data') || ''
//     })
//     return result
//   } catch (error) {
//     console.warn(error)
//   }
//   return []
// }

import axios from 'axios'
import algoliasearch from 'algoliasearch'
import * as global from '../config'
import { DocsearchKeys } from '../utils/skeys'

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
    const response = await axios.get<NpmsIOItem[]>(`https://api.npms.io/v2/search/suggestions?size=7&q=${q}`)
    return response.data.map(d => {
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
    console.warn(error)
  }
  return []
}

const algolia = algoliasearch('TLCDTR8BIO', '686cce2f5dd3c38130b303e1c842c3e3')
const aindex = algolia.initIndex('repositories')
const GithubSuggester = async (query: string): Promise<Array<SuggestItem>> => {
  try {
    const res = await aindex.search<SuggestItem>({
      query,
      hitsPerPage: 5,
      filters: 'watchers>100',
      restrictSearchableAttributes: ['name'],
      attributesToSnippet: ['description:50'],
    })
    return res.hits
  } catch (error) {
    console.warn(error)
  }
  return []
}

export const Suggester = async (q: string, kname: string): Promise<Array<SuggestItem>> => {
  if (kname === 'npm' || kname === 'bundlesize') {
    return NpmSuggester(q)
  }
  if (kname === 'Github') {
    return GithubSuggester(q)
  }
  if (kname === 'CheatSheets') {
    return []
  }
  if (
    DocsearchKeys()
      .map(k => k.name)
      .includes(kname)
  ) {
    return []
  }

  try {
    const response = await axios.get<Array<string>>(`${global.host()}/autocompleter`, {
      params: { q },
      headers: {
        // Cookie: 'autocomplete=google;',
        headers: { 'Access-Control-Allow-Origin': '*' },
      },
    })
    return response.data.map(d => ({ name: d }))
  } catch (error) {
    console.error(error)
  }
  return []
}

// const gooSuggestUrl = 'https://suggestqueries.google.com/complete/search?client=toolbar&hl=zh-cn&q='
// export const GoogleSuggester = async (q: string): Promise<Array<string>> => {
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

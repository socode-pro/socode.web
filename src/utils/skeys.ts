import _ from 'lodash/core'
import Language from './language'

export interface SKey {
  name: string
  hideName?: boolean
  shortkeys: string
  icon: string
  backgroundSize?: string
  backgroundPosition?: string
  width?: number
  template?: string
  availableLang?: Language
  disableLang?: Language
  bylang?: boolean
  bypglang?: boolean
  docsearch?: {
    appId?: string
    apiKey: string
    indexName: string
    algoliaOptions?: object
    transformData?: (suggestions: any) => any
  }
}

export const UsageKeys: { [key: string]: SKey } = {
  socode: { name: 'socode', shortkeys: 'sc', icon: 'socode.png', bylang: true, availableLang: Language.中文 },
  github: {
    name: 'Github',
    shortkeys: 'gh',
    icon: 'github.svg',
    template: 'https://github.com/search?l=%pl&q=%s',
    bypglang: true,
  },
  google: {
    name: 'Google',
    shortkeys: 'g',
    icon: 'google.png',
    template: 'https://google.com/search?q=%s&hl=%l',
    bylang: true,
  },
  cheatsheets: { name: 'CheatSheets', shortkeys: 'cs', icon: 'devhints.png' },
  npm: {
    name: 'npm',
    hideName: true,
    shortkeys: 'n',
    icon: 'npm.svg',
    backgroundSize: '86%',
    width: 60,
    template: 'https://npms.io/search?q=%s',
  }, // todo: inject result
}

export const MoreKeys: { [key: string]: SKey } = {
  duckduckgo: {
    name: 'Duckduckgo',
    shortkeys: 'dd',
    icon: 'duckduckgo.svg',
    template: 'https://duckduckgo.com/?q=%s',
    bylang: true,
    disableLang: Language.中文,
  },
  stackexchange: {
    name: 'StackExchange',
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: 'https://stackexchange.com/search?q=%s',
  },
  caniuse: {
    name: 'Can I use',
    shortkeys: 'ciu',
    icon: 'caniuse.svg',
    template: 'https://caniuse.com/#search=%s',
  }, // todo: inject result
  starhistory: { name: 'Star History', shortkeys: 'sh', icon: 'star.png', template: 'https://star-history.t9t.io/#%s' }, // selfbuild
  bundlesize: {
    name: 'bundlesize',
    shortkeys: 'bp',
    icon: 'bundlephobia.svg',
    template: 'https://bundlephobia.com/result?p=%s',
  },
  _30secondsofcode: {
    name: '30 seconds of code',
    shortkeys: '3s',
    icon: '30secondsofcode.png',
    template: 'https://www.30secondsofcode.org/?keyphrase=%s',
  }, // todo: inject result. selfbuild
  maven: {
    name: 'Maven',
    hideName: true,
    shortkeys: 'mv',
    icon: 'maven.png',
    backgroundSize: '88%',
    width: 70,
    template: 'https://mvnrepository.com/search?q=%s',
  },
  pypi: { name: 'PyPI', shortkeys: 'pp', icon: 'pypi.svg', template: 'https://pypi.org/search/?q=%s' },
  nuget: { name: 'NuGet', shortkeys: 'ng', icon: 'nuget.svg', template: 'https://nuget.org/packages?q=%s' },
  composer: { name: 'Composer', shortkeys: 'cp', icon: 'composer.png', template: 'https://packagist.org/?query=%s' },
  cocoapods: {
    name: 'CocoaPods',
    hideName: true,
    shortkeys: 'cc',
    icon: 'cocoapods.png',
    width: 110,
    template: 'https://cocoacontrols.com/search?q=%s',
  },
  rubygems: {
    name: 'RubyGems',
    shortkeys: 'rg',
    icon: 'rubygems.jpg',
    template: 'https://rubygems.org/search?query=%s',
  },
  godoc: { name: 'GoDoc', shortkeys: 'gd', icon: 'godoc.png', template: 'https://godoc.org/?q=%s' },
  cargo: { name: 'cargo', shortkeys: 'cg', icon: 'Cargo.png', template: 'https://crates.io/search?q=%s' },
  mdn: {
    name: 'MDN',
    hideName: true,
    shortkeys: 'mdn',
    icon: 'MDN.svg',
    width: 130,
    template: 'https://developer.mozilla.org/en-US/search?q=%s',
  },
  apple: {
    name: 'Apple Developer',
    shortkeys: 'ap',
    icon: 'apple.svg',
    template: 'https://developer.apple.com/search/?q=%s',
  },
  microsoft: {
    name: 'Microsoft Doc',
    shortkeys: 'ms',
    icon: 'microsoft.png',
    template: 'https://docs.microsoft.com/%l/search/?search=%s',
    bylang: true,
  },
  python: { name: 'Python', shortkeys: 'py', icon: 'python.png', template: 'https://python.org/search/?q=%s' },
  ruby: {
    name: 'Ruby',
    shortkeys: 'rb',
    icon: 'ruby.png',
    template: 'https://cse.google.com/cse?q=%s&cx=013598269713424429640%3Ag5orptiw95w',
  },
  go: { name: 'Go', shortkeys: 'go', icon: 'golang.png', template: 'https://golang.org/search?q=%s' },
  rust: {
    name: 'Rust',
    shortkeys: 'rs',
    icon: 'rust.png',
    template: 'https://doc.rust-lang.org/alloc/index.html?search=%s',
  },
}

export const DocsearchKeys: { [key: string]: SKey } = {
  react: {
    name: 'React',
    shortkeys: 'ra',
    icon: 'react.svg',
    bylang: true,
    docsearch: {
      apiKey: '36221914cce388c46d0420343e0bb32e',
      indexName: 'react',
    },
  },
  vue: {
    name: 'Vue',
    shortkeys: 'vue',
    icon: 'vue.png',
    bylang: true,
    docsearch: {
      appId: 'BH4D9OD16A',
      apiKey: '85cc3221c9f23bfbaa4e3913dd7625ea',
      indexName: 'vuejs',
      algoliaOptions: { facetFilters: ['version:v2'] },
    },
  },
  eslint: {
    name: 'ESLint',
    shortkeys: 'es',
    icon: 'eslint.svg',
    docsearch: {
      apiKey: '891b0e977d96c762a3821e0c00172ac9',
      indexName: 'eslint',
      algoliaOptions: { facetFilters: [['tags:docs', 'tags:blog']] },
    },
  },
  serverless: {
    name: 'serverless',
    shortkeys: 'sl',
    icon: 'serverless.svg',
    docsearch: {
      apiKey: 'd5a39b712b86965d93534207ef5423df',
      indexName: 'serverless',
    },
  },
  scala: {
    name: 'scala',
    shortkeys: 'scl',
    icon: 'scala.png',
    hideName: true,
    width: 72,
    docsearch: {
      apiKey: 'fbc439670f5d4e3730cdcb715c359391',
      indexName: 'scala-lang',
      algoliaOptions: { facetFilters: ['language:en'] },
    },
  },
  grafana: {
    name: 'grafana',
    shortkeys: 'gf',
    icon: 'grafana.svg',
    hideName: true,
    width: 130,
    docsearch: {
      apiKey: '0bd2bd6939038c5ce2c9395732dcf040',
      indexName: 'grafana',
      // start_urls: ['https://grafana.com/docs/grafana/latest/'],
      // https://grafana.com/docs/grafana/latest/
    },
  },
  babel: {
    name: 'babel',
    shortkeys: 'bb',
    icon: 'babel.svg',
    hideName: true,
    width: 60,
    backgroundPosition: 'left 0.2em center',
    docsearch: {
      apiKey: 'd42906b043c5422ea07b44fd49c40a0d',
      indexName: 'babeljs',
    },
  },
  gradle: {
    name: 'Gradle',
    shortkeys: 'gd',
    icon: 'gradle.svg',
    hideName: true,
    width: 88,
    backgroundPosition: 'left center',
    docsearch: {
      apiKey: '5eb5540d6bd412c7e6d2c687bf10a395',
      indexName: 'gradle',
      transformData: suggestions => {
        return suggestions.map(suggestion => {
          if (suggestion.anchor.substring(0, 10) === 'org.gradle') {
            suggestion.hierarchy.lvl0 = 'DSL Reference'
          }
          return suggestion
        })
      },
    },
  },
  gatsby: {
    name: 'Gatsby',
    shortkeys: 'gb',
    icon: 'gatsby.svg',
    hideName: true,
    width: 108,
    docsearch: {
      apiKey: '71af1f9c4bd947f0252e17051df13f9c',
      indexName: 'gatsbyjs',
    },
  },
  webpack: {
    name: 'webpack',
    shortkeys: 'wp',
    icon: 'webpack.svg',
    hideName: true,
    width: 100,
    docsearch: {
      apiKey: 'fac401d1a5f68bc41f01fb6261661490',
      indexName: 'webpack-js-org',
    },
  },
  netlify: {
    name: 'netlify',
    shortkeys: 'nl',
    icon: 'netlify.svg',
    docsearch: {
      apiKey: '260466eb2466a36278b2fdbcc56ad7ba',
      appId: '4RTNPM1QF9',
      indexName: 'docs-manual',
    },
  },
  graphql: {
    name: 'graphql',
    shortkeys: 'gq',
    icon: 'graphql.svg',
    docsearch: {
      apiKey: 'd103541f3e6041148aade2e746ed4d61',
      indexName: 'graphql',
    },
  },
  jquery: {
    name: 'jquery',
    shortkeys: 'jq',
    icon: 'jquery.png',
    hideName: true,
    width: 106,
    docsearch: {
      apiKey: '3cfde9aca378c8aab554d5bf1b23489b',
      indexName: 'jquery',
    },
  },
  electron: {
    name: 'Electron',
    shortkeys: 'et',
    icon: 'electron.svg',
    docsearch: {
      appId: 'L9LD9GHGQJ',
      apiKey: '24e7e99910a15eb5d9d93531e5682370',
      indexName: 'apis', // and tutorials,packages,apps
    },
  },
  ember: {
    name: 'Ember',
    shortkeys: 'eb',
    icon: 'ember.svg',
    hideName: true,
    width: 76,
    docsearch: {
      appId: 'Y1OMR4C7MF',
      apiKey: '5d01c83734dc36754d9e94cbf6f8964d',
      indexName: 'ember-guides',
    },
  },
}

export const GetKeyByName = (name: string): SKey | null => {
  const r1 = _.find(UsageKeys, { name })
  if (r1) return r1
  const r2 = _.find(DocsearchKeys, { name })
  if (r2) return r2
  const r3 = _.find(MoreKeys, { name })
  if (r3) return r3

  return null
}

export const GetKeyByShortkeys = (shortkeys: string): SKey | null => {
  const r1 = _.find(UsageKeys, { shortkeys })
  if (r1) return r1
  const r2 = _.find(DocsearchKeys, { shortkeys })
  if (r2) return r2
  const r3 = _.find(MoreKeys, { shortkeys })
  if (r3) return r3

  return null
}

export const IsDocsearchKeys = (name: string): boolean => {
  return Object.entries(DocsearchKeys)
    .map(([k, v]) => v.name)
    .includes(name)
}

export const IsAvoidKeys = (name: string): boolean => {
  return IsDocsearchKeys(name) || name === 'CheatSheets'
}

// export const DocsearchKeys = (): SKey[] => {
//   const keys: SKey[] = Object.entries(UsageKeys)
//     .filter(([k, v]) => v.docsearch)
//     .map(([k, v]) => v)

//   const mkeys: SKey[] = Object.entries(MoreKeys)
//     .filter(([k, v]) => v.docsearch)
//     .map(([k, v]) => v)

//   return keys.concat(mkeys)
// }

// export const AvoidKeys = (name: string): boolean => {
//   return (
//     DocsearchKeys()
//       .map(k => k.name)
//       .includes(name) || name === 'CheatSheets'
//   )
// }

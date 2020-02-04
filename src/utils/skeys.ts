import _ from 'lodash/core'

export interface SKey {
  name: string
  hideName?: boolean
  shortkeys: string
  icon: string
  backgroundSize?: string
  width?: number
  template?: string
  bylang?: boolean
  bypglang?: boolean
  docsearch?: {
    apiKey: string
    indexName: string
    algoliaOptions?: object
  }
}

export const UsageKeys: { [key: string]: SKey } = {
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
    backgroundSize: '50%',
    width: 100,
    template: 'https://npms.io/search?q=%s',
  }, // todo: inject result
}

export const UsageKeysCN: { [key: string]: SKey } = {
  socode: { name: 'socode', shortkeys: 'sc', icon: 'socode.png', bylang: true },
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
    backgroundSize: '50%',
    width: 100,
    template: 'https://npms.io/search?q=%s',
  },
}

export const MoreKeys: { [key: string]: SKey } = {
  duckduckgo: {
    name: 'Duckduckgo',
    shortkeys: 'dd',
    icon: 'duckduckgo.svg',
    template: 'https://duckduckgo.com/?q=%s',
    bylang: true,
  },
  stackexchange: {
    name: 'StackExchange',
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: 'https://stackexchange.com/search?q=%s',
  },
  caniuse: {
    name: 'caniuse',
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
    backgroundSize: '66%',
    width: 100,
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
    width: 120,
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
  eslint: {
    name: 'ESLint',
    shortkeys: 'es',
    icon: 'eslint.svg',
    template: 'https://eslint.org/docs/rules/%s',
    docsearch: {
      apiKey: '891b0e977d96c762a3821e0c00172ac9',
      indexName: 'eslint',
      algoliaOptions: { facetFilters: [['tags:docs', 'tags:blog']] },
    },
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
    bylang: true, // autocomplate
  },
  react: {
    name: 'React',
    shortkeys: 'rect',
    icon: 'react.svg',
    template: 'https://reactjs.org/docs/%s',
    bylang: true,
    docsearch: {
      apiKey: '36221914cce388c46d0420343e0bb32e',
      indexName: 'react',
    },
  },
  vue: { name: 'Vue', shortkeys: 'vue', icon: 'vue.png', template: 'https://vuejs.org/v2/%s', bylang: true }, // algolia autocomplate
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

export const MoreKeysCN: { [key: string]: SKey } = {
  stackexchange: {
    name: 'StackExchange',
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: 'https://stackexchange.com/search?q=%s',
  },
  caniuse: {
    name: 'caniuse',
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
    backgroundSize: '66%',
    width: 100,
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
    width: 120,
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
  eslint: { name: 'ESLint', shortkeys: 'es', icon: 'eslint.svg', template: 'https://eslint.org/docs/rules/%s' }, // algolia autocomplate
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
    bylang: true, // autocomplate
  },
  react: { name: 'React', shortkeys: 'rect', icon: 'react.svg', template: 'https://reactjs.org/docs/%s', bylang: true }, // algolia autocomplate
  vue: { name: 'Vue', shortkeys: 'vue', icon: 'vue.png', template: 'https://vuejs.org/v2/%s', bylang: true }, // algolia autocomplate
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

export const GetKeyByName = (name: string): SKey | null => {
  const r1 = _.find(UsageKeys, { name })
  if (r1) return r1
  const r2 = _.find(UsageKeysCN, { name })
  if (r2) return r2
  const r3 = _.find(MoreKeys, { name })
  if (r3) return r3
  const r4 = _.find(MoreKeysCN, { name })
  if (r4) return r4

  return null
}

export const GetKeyByShortkeys = (shortkeys: string): SKey | null => {
  const r1 = _.find(UsageKeys, { shortkeys })
  if (r1) return r1
  const r2 = _.find(UsageKeysCN, { shortkeys })
  if (r2) return r2
  const r3 = _.find(MoreKeys, { shortkeys })
  if (r3) return r3
  const r4 = _.find(MoreKeysCN, { shortkeys })
  if (r4) return r4

  return null
}

export const DocsearchKeys = (): SKey[] => {
  const keys: SKey[] = Object.entries(UsageKeys)
    .filter(([k, v]) => v.docsearch)
    .map(([k, v]) => v)

  const mkeys: SKey[] = Object.entries(MoreKeys)
    .filter(([k, v]) => v.docsearch)
    .map(([k, v]) => v)

  return keys.concat(mkeys)
}

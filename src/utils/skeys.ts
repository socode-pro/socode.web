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
}

export const SearchKeys: { [key: string]: SKey } = {
  google: {
    name: 'Google',
    shortkeys: 'g',
    icon: 'google.png',
    template: '//google.com/search?q=%s&hl=%l',
    bylang: true,
  }, // autocomplate
  duckduckgo: {
    name: 'Duckduckgo',
    shortkeys: 'dd',
    icon: 'duckduckgo.svg',
    template: '//duckduckgo.com/?q=%s',
    bylang: true,
  }, // autocomplate
  github: { name: 'Github', shortkeys: 'gh', icon: 'github.svg', template: '//github.com/search?q=%s' }, // autocomplate
  stackexchange: {
    name: 'StackExchange',
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: '//stackexchange.com/search?q=%s',
  },
  socode: { name: 'socode.pro', shortkeys: 'sc', icon: 'socode.png' },
}

export const SearchKeysCN: { [key: string]: SKey } = {
  socode: { name: 'socode.pro', shortkeys: 'sc', icon: 'socode.png', bylang: true },
  github: { name: 'Github', shortkeys: 'gh', icon: 'github.svg', template: '//github.com/search?q=%s' },
  stackexchange: {
    name: 'StackExchange',
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: '//stackexchange.com/search?q=%s',
  },
}

export const ToolKeys: { [key: string]: SKey } = {
  cheatsheets: { name: 'cheat sheets', shortkeys: 'cs', icon: 'sheets.svg' }, // selfbuild
  starhistory: { name: 'Star History', shortkeys: 'sh', icon: 'star.png', template: '//star-history.t9t.io/#%s' }, // selfbuild
  _30secondsofcode: {
    name: '30 seconds of code',
    shortkeys: '3s',
    icon: '30secondsofcode.png',
    template: '//www.30secondsofcode.org/?keyphrase=%s',
  }, // selfbuild
}

export const PackageKeys: { [key: string]: SKey } = {
  npm: {
    name: 'npm',
    hideName: true,
    shortkeys: 'n',
    icon: 'npm.svg',
    backgroundSize: '50%',
    width: 100,
    template: '//npmjs.com/search?q=%s',
  }, // autocomplate
  cocoapods: {
    name: 'CocoaPods',
    hideName: true,
    shortkeys: 'cc',
    icon: 'cocoapods.png',
    width: 120,
    template: '//cocoacontrols.com/search?q=%s',
  },
  maven: {
    name: 'Maven',
    hideName: true,
    shortkeys: 'mv',
    icon: 'maven.png',
    backgroundSize: '66%',
    width: 100,
    template: '//mvnrepository.com/search?q=%s',
  },
  pypi: { name: 'PyPI', shortkeys: 'pp', icon: 'pypi.svg', template: '//pypi.org/search/?q=%s' },
  nuget: { name: 'NuGet', shortkeys: 'ng', icon: 'nuget.svg', template: '//nuget.org/packages?q=%s' },
  composer: { name: 'Composer', shortkeys: 'cp', icon: 'composer.png', template: '//packagist.org/?query=%s' },
  rubygems: { name: 'RubyGems', shortkeys: 'rg', icon: 'rubygems.jpg', template: '//rubygems.org/search?query=%s' },
  godoc: { name: 'GoDoc', shortkeys: 'gd', icon: 'godoc.png', template: '//godoc.org/?q=%s' },
  cargo: { name: 'cargo', shortkeys: 'cg', icon: 'Cargo.png', template: '//crates.io/search?q=%s' },
}

export const DocKeys: { [key: string]: SKey } = {
  mdn: {
    name: 'Mozilla Developer Network',
    hideName: true,
    shortkeys: 'mdn',
    icon: 'MDN.svg',
    width: 130,
    template: '//developer.mozilla.org/en-US/search?q=%s',
  },
  eslint: { name: 'ESLint', shortkeys: 'es', icon: 'eslint.svg', template: '//eslint.org/docs/rules/%s' }, // algolia autocomplate
  apple: {
    name: 'Apple Developer',
    shortkeys: 'ap',
    icon: 'apple.svg',
    template: '//developer.apple.com/search/?q=%s',
  },
  microsoft: {
    name: 'Microsoft Doc',
    shortkeys: 'ms',
    icon: 'microsoft.png',
    template: '//docs.microsoft.com/%l/search/?search=%s',
    bylang: true, // autocomplate
  },
  react: { name: 'React', shortkeys: 'rect', icon: 'react.svg', template: '//reactjs.org/docs/%s', bylang: true }, // algolia autocomplate
  vue: { name: 'Vue', shortkeys: 'vue', icon: 'vue.png', template: '//vuejs.org/v2/%s', bylang: true }, // algolia autocomplate
  python: { name: 'Python', shortkeys: 'py', icon: 'python.png', template: '//python.org/search/?q=%s' },
  ruby: {
    name: 'Ruby',
    shortkeys: 'rb',
    icon: 'ruby.png',
    template: '//cse.google.com/cse?q=%s&cx=013598269713424429640%3Ag5orptiw95w',
  },
  go: { name: 'Go', shortkeys: 'go', icon: 'golang.png', template: '//golang.org/search?q=%s' },
  rust: { name: 'Rust', shortkeys: 'rs', icon: 'rust.png', template: '//doc.rust-lang.org/alloc/index.html?search=%s' },
}

export const GetKeyByName = (name: string): SKey | null => {
  const r1 = _.find(SearchKeys, { name })
  if (r1) return r1
  const r2 = _.find(SearchKeysCN, { name })
  if (r2) return r2
  const r3 = _.find(ToolKeys, { name })
  if (r3) return r3
  const r4 = _.find(PackageKeys, { name })
  if (r4) return r4
  const r5 = _.find(DocKeys, { name })
  if (r5) return r5

  return null
}

export const GetKeyByShortkeys = (shortkeys: string): SKey | null => {
  const r1 = _.find(SearchKeys, { shortkeys })
  if (r1) return r1
  const r2 = _.find(SearchKeysCN, { shortkeys })
  if (r2) return r2
  const r3 = _.find(ToolKeys, { shortkeys })
  if (r3) return r3
  const r4 = _.find(PackageKeys, { shortkeys })
  if (r4) return r4
  const r5 = _.find(DocKeys, { shortkeys })
  if (r5) return r5

  return null
}

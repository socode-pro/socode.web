export interface SKey {
  name?: string
  shortkeys: string
  icon: string
  backgroundSize?: string
  width?: number
}

export const SearchKeys: { [key: string]: SKey } = {
  google: { name: 'Google', shortkeys: 'g', icon: 'google.png' },
  duckduckgo: { name: 'Duckduckgo', shortkeys: 'dd', icon: 'duckduckgo.svg' },
  github: { name: 'Github', shortkeys: 'gh', icon: 'github.svg' },
  stackexchange: { name: 'StackExchange', shortkeys: 'se', icon: 'stackexchange.png' },
}

export const SearchKeysCN: { [key: string]: SKey } = {
  socode: { name: 'socode.pro', shortkeys: 'sc', icon: 'socode.png' },
  github: { name: 'Github', shortkeys: 'gh', icon: 'github.svg' },
  stackexchange: { name: 'StackExchange', shortkeys: 'se', icon: 'stackexchange.png' },
}

export const ToolKeys: { [key: string]: SKey } = {
  cheatsheets: { name: 'cheat sheets', shortkeys: 'cs', icon: 'sheets.svg' },
  starhistory: { name: 'Star History', shortkeys: 'sh', icon: 'star.png' },
  _30secondsofcode: { name: '30secondsof code', shortkeys: '3s', icon: '30secondsofcode.png' },
}

export const PackageKeys: { [key: string]: SKey } = {
  npm: { shortkeys: 'n', icon: 'npm.svg', backgroundSize: '50%', width: 100 },
  cocoapods: { shortkeys: 'cc', icon: 'cocoapods.png', width: 100 },
  maven: { name: 'Maven', shortkeys: 'mv', icon: 'sonatype.svg' },
  pypi: { name: 'PyPI', shortkeys: 'pp', icon: 'pypi.svg' },
  nuget: { name: 'NuGet', shortkeys: 'ng', icon: 'nuget.svg' },
  composer: { name: 'Composer', shortkeys: 'cp', icon: 'composer.png' },
  rubygems: { name: 'RubyGems', shortkeys: 'rg', icon: 'rubygems.jpg' },
  godoc: { name: 'GoDoc', shortkeys: 'gd', icon: 'godoc.png' },
  cargo: { name: 'cargo', shortkeys: 'cg', icon: 'Cargo.png' },
}

export const DocKeys: { [key: string]: SKey } = {
  eslint: { name: 'ESLint', shortkeys: 'es', icon: 'eslint.svg' },
  mdn: { shortkeys: 'mdn', icon: 'MDN.svg', width: 100 },
  apple: { name: 'Apple Developer', shortkeys: 'ap', icon: 'apple.svg' },
  microsoft: { name: 'Microsoft Doc', shortkeys: 'ms', icon: 'microsoft.png' },
  react: { name: 'React', shortkeys: 'rect', icon: 'react.svg' },
  vue: { name: 'Vue', shortkeys: 'vue', icon: 'vue.png' },
  python: { name: 'Python', shortkeys: 'py', icon: 'python.png' },
  ruby: { name: 'Ruby', shortkeys: 'rb', icon: 'ruby.png' },
  go: { name: 'Go', shortkeys: 'go', icon: 'golang.png' },
  rust: { name: 'Rust', shortkeys: 'rs', icon: 'rust.png' },
}

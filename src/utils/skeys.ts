export interface SKey {
  name: string
  shortkeys: string
  icon: string
  backgroundSize?: string
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

export const PackageKeys: { [key: string]: SKey } = {
  npm: { name: '', shortkeys: 'n', icon: 'npm.svg', backgroundSize: '50%' },
  cocoapods: { name: '', shortkeys: 'cc', icon: 'cocoapods.png' },
  maven: { name: 'Maven', shortkeys: 'mv', icon: 'sonatype.svg' },
  pypi: { name: 'PyPI', shortkeys: 'pp', icon: 'pypi.svg' },
  nuget: { name: 'NuGet', shortkeys: 'ng', icon: 'nuget.svg' },
  composer: { name: 'Composer', shortkeys: 'cp', icon: 'composer.png' },
  rubygems: { name: 'RubyGems', shortkeys: 'rg', icon: 'rubygems.jpg' },
  godoc: { name: 'GoDoc', shortkeys: 'gd', icon: 'godoc.png' },
  cargo: { name: 'cargo', shortkeys: 'cg', icon: 'Cargo.png' },
}

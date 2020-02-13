// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
enum Language {
  English = 'en',
  中文_简体 = 'zh_CN',
  中文_繁體 = 'zh_TW',
  Português = 'pt',
  日本語 = 'ja',
  русский = 'ru',
  Español = 'es',
  Deutsche = 'de',
  français = 'fr',
  Italiano = 'it',
}

export const navigatorLanguage = (navigator: string): Language => {
  if (navigator.startsWith(Language.English)) return Language.English
  if (navigator.startsWith(Language.中文_繁體)) return Language.中文_简体
  if (navigator.startsWith(Language.中文_简体) || navigator.startsWith('zh')) return Language.中文_简体
  if (navigator.startsWith(Language.Português)) return Language.Português
  if (navigator.startsWith(Language.日本語)) return Language.日本語
  if (navigator.startsWith(Language.русский)) return Language.русский
  if (navigator.startsWith(Language.Español)) return Language.Español
  if (navigator.startsWith(Language.Deutsche)) return Language.Deutsche
  if (navigator.startsWith(Language.français)) return Language.français
  if (navigator.startsWith(Language.Italiano)) return Language.Italiano
  return Language.English
}

// https://githut.info/
export enum ProgramLanguage {
  'All',
  'JavaScript',
  'Java',
  'Python',
  'CSS',
  'PHP',
  'Ruby',
  'C++',
  'C',
  'Shell',
  'C#',
  'Objective-C',
  'R',
  'VimL',
  'Go',
  'Perl',
  'CoffeeScript',
  'TeX',
  'Swift',
  'Scala',
  'Emacs Lisp',
  'Haskell',
  'Lua',
  'Clojure',
  'Matlab',
  'Arduino',
  'Groovy',
  'Puppet',
  'Rust',
  'PowerShell',
  'Erlang',
  'Visual Basic',
  'Processing',
  'Assembly',
  'TypeScript',
  'XSLT',
  'ActionScript',
  'ASP',
  'OCaml',
  'D',
  'Scheme',
  'Dart',
  'Common Lisp',
  'Julia',
  'F#',
  'Elixir',
  'FORTRAN',
  'Haxe',
  'Racket',
  'Logos',
}

export default Language

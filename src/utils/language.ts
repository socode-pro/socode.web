// https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
enum Language {
  English = 'en-us',
  中文 = 'zh-cn',
  Português = 'pt',
  日本語 = 'ja',
  русский = 'ru',
  Español = 'es',
  Deutsch = 'de',
  français = 'fr',
  Italiano = 'it',
}

export const navigatorLanguage = (navigator: string): Language => {
  if (navigator.startsWith(Language.English)) return Language.English
  if (navigator.startsWith(Language.中文)) return Language.中文
  if (navigator.startsWith(Language.Português)) return Language.Português
  if (navigator.startsWith(Language.日本語)) return Language.日本語
  if (navigator.startsWith(Language.русский)) return Language.русский
  if (navigator.startsWith(Language.Español)) return Language.Español
  if (navigator.startsWith(Language.Deutsch)) return Language.Deutsch
  if (navigator.startsWith(Language.français)) return Language.français
  if (navigator.startsWith(Language.Italiano)) return Language.Italiano
  return Language.English
}

export enum ProgramLanguage {
  C = 1,
  CPlus = 2,
  Go = 3,
  Rust = 4,
  Lua = 5,
  Perl = 6,

  CSharp = 21,
  FSharp = 22,
  Java = 23,
  Kotlin = 24,
  Groovy = 25,
  Scala = 26,
  Swift = 27,
  VisualBasic = 28,

  Javascript = 41,
  TypeScript = 42,
  Dart = 43,
  Python = 44,
  Php = 45,
  Ruby = 46,

  Erlang = 61,
  Elixir = 62,
  Clojure = 63,
  Lisp = 64,
  Haskell = 65,

  SQL = 81,
  Bash = 82,
  MATLAB = 83,
  R = 84,
}

export default Language

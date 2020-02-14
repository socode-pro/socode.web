import Language from './language'

export enum KeyCategory {
  Usage,
  Document,
  More,
}

export interface SKey {
  category: KeyCategory
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
  userUsage?: boolean
  homelink?: string
  awesome?: string
}

export const Keys: { [key: string]: SKey } = {
  socode: {
    category: KeyCategory.Usage,
    name: 'socode',
    shortkeys: 'sc',
    icon: 'socode.png',
    bylang: true,
    availableLang: Language.中文_简体,
  },
  github: {
    category: KeyCategory.Usage,
    name: 'Github',
    shortkeys: 'gh',
    icon: 'github.svg',
    template: 'https://github.com/search?l=%pl&q=%s',
    bypglang: true,
  },
  google: {
    category: KeyCategory.Usage,
    name: 'Google',
    shortkeys: 'g',
    icon: 'google.png',
    template: 'https://google.com/search?q=%s&hl=%l',
    bylang: true,
    disableLang: Language.中文_简体,
  },
  cheatsheets: {
    category: KeyCategory.Usage,
    name: 'CheatSheets',
    shortkeys: 'cs',
    icon: 'devhints.png',
  },
  npm: {
    category: KeyCategory.Usage,
    name: 'npm',
    hideName: true,
    shortkeys: 'n',
    icon: 'npm.svg',
    backgroundSize: '86%',
    width: 60,
    template: 'https://npms.io/search?q=%s',
  }, // todo: inject result

  babel: {
    category: KeyCategory.Document,
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
  bootstrap: {
    category: KeyCategory.Document,
    name: 'Bootstrap',
    shortkeys: 'bs',
    icon: 'bootstrap.svg',
    homelink: 'https://getbootstrap.com',
    docsearch: {
      apiKey: '5990ad008512000bba2cf951ccf0332f',
      indexName: 'bootstrap',
    },
  },
  dayjs: {
    category: KeyCategory.Document,
    name: 'dayjs',
    shortkeys: 'dj',
    icon: 'dayjs.png',
    docsearch: {
      apiKey: '015f468476ca8256cf1c8e8fb6d82cc3',
      indexName: 'dayjs',
    },
  },
  druid: {
    category: KeyCategory.Document,
    name: 'druid',
    shortkeys: 'du',
    icon: 'druid.png',
    hideName: true,
    width: 82,
    docsearch: {
      apiKey: '2de99082a9f38e49dfaa059bbe4c901d',
      indexName: 'apache_druid',
    },
  },
  // https://github.com/algolia/docsearch/issues/184
  // electron: { // self build index
  //   category: KeyCategory.Document,
  //   name: 'Electron',
  //   shortkeys: 'et',
  //   icon: 'electron.svg',
  //   homelink: 'https://www.electronjs.org',
  //   awesome: 'sindresorhus/awesome-electron',
  //   docsearch: {
  //     appId: 'L9LD9GHGQJ',
  //     apiKey: '24e7e99910a15eb5d9d93531e5682370',
  //     indexName: 'apis', // and tutorials,packages,apps
  //   },
  // },
  // ember: { // self build index
  //   category: KeyCategory.Document,
  //   name: 'Ember',
  //   shortkeys: 'eb',
  //   icon: 'ember.svg',
  //   hideName: true,
  //   width: 76,
  //   docsearch: {
  //     appId: 'Y1OMR4C7MF',
  //     apiKey: '5d01c83734dc36754d9e94cbf6f8964d',
  //     indexName: 'ember-guides',
  //   },
  // },
  eslint: {
    category: KeyCategory.Document,
    name: 'ESLint',
    shortkeys: 'es',
    icon: 'eslint.svg',
    docsearch: {
      apiKey: '891b0e977d96c762a3821e0c00172ac9',
      indexName: 'eslint',
      algoliaOptions: { facetFilters: [['tags:docs', 'tags:blog']] },
    },
  },
  express: {
    category: KeyCategory.Document,
    name: 'Express',
    shortkeys: 'ex',
    icon: 'expressjs.png',
    // hideName: true,
    // width: 80,
    // backgroundPosition: 'left top -2px',
    docsearch: {
      apiKey: '7164e33055faa6ecddefd9e08fc59f5d',
      indexName: 'expressjs',
      algoliaOptions: { facetFilters: ['lang:en'] }, // multi lang
    },
  },
  fastify: {
    category: KeyCategory.Document,
    name: 'fastify',
    shortkeys: 'ff',
    icon: 'fastify.png',
    hideName: true,
    width: 96,
    docsearch: {
      apiKey: 'f7c62ddab40e653f67a6e15be761d951',
      indexName: 'fastify',
      algoliaOptions: { facetFilters: ['version:latest', 'tags:docs'] },
    },
  },
  gatsby: {
    category: KeyCategory.Document,
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
  gulp: {
    category: KeyCategory.Document,
    name: 'Gulp',
    shortkeys: 'gp',
    icon: 'gulp.svg',
    backgroundPosition: 'left center',
    docsearch: {
      apiKey: 'a6ef919bce0b83de1bcbad1d4ef753f8',
      indexName: 'gulpjs',
    },
  },
  gradle: {
    category: KeyCategory.Document,
    name: 'Gradle',
    shortkeys: 'gd',
    icon: 'gradle.svg',
    hideName: true,
    width: 88,
    backgroundPosition: 'left center',
    homelink: 'https://gradle.org',
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
  grafana: {
    category: KeyCategory.Document,
    name: 'grafana',
    shortkeys: 'gf',
    icon: 'grafana.svg',
    hideName: true,
    width: 130,
    homelink: 'https://grafana.com',
    docsearch: {
      apiKey: '0bd2bd6939038c5ce2c9395732dcf040',
      indexName: 'grafana',
      // start_urls: ['https://grafana.com/docs/grafana/latest/'],
      // https://grafana.com/docs/grafana/latest/
    },
  },
  graphql: {
    category: KeyCategory.Document,
    name: 'graphql',
    shortkeys: 'gq',
    icon: 'graphql.svg',
    homelink: 'https://graphql.org',
    awesome: 'chentsulin/awesome-graphql',
    docsearch: {
      apiKey: 'd103541f3e6041148aade2e746ed4d61',
      indexName: 'graphql',
    },
  },
  jenkinsx: {
    category: KeyCategory.Document,
    name: 'Jenkins X',
    shortkeys: 'jk',
    icon: 'jenkinsx.svg',
    homelink: 'https://jenkins-x.io',
    docsearch: {
      apiKey: '8904bbd3ca621bef472e3de7e0e29532',
      indexName: 'jenkins_x',
      algoliaOptions: { facetFilters: ['en-us'] },
    },
  },
  jquery: {
    category: KeyCategory.Document,
    name: 'jquery',
    shortkeys: 'jq',
    icon: 'jquery.png',
    hideName: true,
    width: 106,
    homelink: 'https://jquery.com/',
    docsearch: {
      apiKey: '3cfde9aca378c8aab554d5bf1b23489b',
      indexName: 'jquery',
    },
  },
  leancloud: {
    category: KeyCategory.Document,
    name: 'LeanCloud',
    shortkeys: 'lc',
    icon: 'leancloud.png',
    availableLang: Language.中文_简体,
    hideName: true,
    width: 100,
    backgroundSize: '90%',
    homelink: 'https://leancloud.app',
    docsearch: {
      apiKey: '357b777ed18e79673a2c1de3f6c64478',
      indexName: 'leancloud',
    },
  },
  netlify: {
    category: KeyCategory.Document,
    name: 'netlify',
    shortkeys: 'nl',
    icon: 'netlify.svg',
    homelink: 'https://www.netlify.com',
    docsearch: {
      appId: '4RTNPM1QF9',
      apiKey: '260466eb2466a36278b2fdbcc56ad7ba',
      indexName: 'docs-manual',
    },
  },
  nestjs: {
    category: KeyCategory.Document,
    name: 'nestjs',
    shortkeys: 'ns',
    icon: 'nestjs.svg',
    homelink: 'https://nestjs.com',
    docsearch: {
      apiKey: '9ea53de1a6911255834352bbbe4d3417',
      indexName: 'nestjs',
    },
  },
  pipenv: {
    category: KeyCategory.Document,
    name: 'pipenv',
    shortkeys: 'pe',
    icon: 'pipenv.png',
    homelink: 'https://pipenv.kennethreitz.org',
    docsearch: {
      apiKey: '0dbb76467f0c180a1344fc46858df17b',
      indexName: 'pipenv',
    },
  },
  play: {
    category: KeyCategory.Document,
    name: 'play',
    shortkeys: 'pl',
    icon: 'play.svg',
    hideName: true,
    width: 60,
    homelink: 'https://www.playframework.com',
    docsearch: {
      apiKey: 'a0b34e68c804cf96e76adcb02d47159b',
      indexName: 'playframework',
      algoliaOptions: { facetFilters: ['tags: en'] },
    },
  },
  prettier: {
    category: KeyCategory.Document,
    name: 'prettier',
    shortkeys: 'pr',
    icon: 'prettier.png',
    docsearch: {
      apiKey: '9fcdb2a62af4c47cc5eecf3d5a747818',
      indexName: 'prettier',
    },
  },
  pytouch: {
    category: KeyCategory.Document,
    name: 'PyTouch',
    shortkeys: 'pt',
    icon: 'pytouch.svg',
    hideName: true,
    width: 116,
    homelink: 'https://pytorch.org',
    awesome: 'bharathgs/Awesome-pytorch-list',
    docsearch: {
      apiKey: 'e3b73ac141dff0b0fd27bdae9055bc73',
      indexName: 'pytorch',
    },
  },
  react: {
    category: KeyCategory.Document,
    name: 'React',
    shortkeys: 'ra',
    icon: 'react.svg',
    bylang: true,
    homelink: 'https://reactjs.org',
    awesome: 'enaqx/awesome-react',
    docsearch: {
      apiKey: '36221914cce388c46d0420343e0bb32e',
      indexName: 'react', // multi lang
    },
  },
  reactnative: {
    category: KeyCategory.Document,
    name: 'React Native',
    shortkeys: 'ran',
    icon: 'react.svg',
    bylang: true,
    homelink: 'https://facebook.github.io/react-native',
    awesome: 'jondot/awesome-react-native',
    docsearch: {
      apiKey: '2c98749b4a1e588efec53b2acec13025',
      indexName: 'react-native-versions',
    },
  },
  sass: {
    category: KeyCategory.Document,
    name: 'Sass',
    shortkeys: 'ss',
    icon: 'sass.svg',
    docsearch: {
      apiKey: 'a409ff5d6a2476083c1a8dd1f8c04ec5',
      indexName: 'sass-lang',
    },
  },
  scala: {
    category: KeyCategory.Document,
    name: 'scala',
    shortkeys: 'scl',
    icon: 'scala.png',
    hideName: true,
    width: 72,
    homelink: 'https://www.scala-lang.org',
    awesome: 'lauris/awesome-scala',
    docsearch: {
      apiKey: 'fbc439670f5d4e3730cdcb715c359391',
      indexName: 'scala-lang',
      algoliaOptions: { facetFilters: ['language:en'] },
    },
  },
  serverless: {
    category: KeyCategory.Document,
    name: 'serverless',
    shortkeys: 'sl',
    icon: 'serverless.svg',
    homelink: 'https://serverless.com',
    docsearch: {
      apiKey: 'd5a39b712b86965d93534207ef5423df',
      indexName: 'serverless',
    },
  },
  taro: {
    category: KeyCategory.Document,
    name: 'Taro',
    shortkeys: 'tr',
    icon: 'taro.png',
    availableLang: Language.中文_简体,
    docsearch: {
      apiKey: '57b9948bff42bc0dbc6c219556fbae35',
      indexName: 'taro',
    },
  },
  typescript: {
    category: KeyCategory.Document,
    name: 'Typescript',
    shortkeys: 'ts',
    icon: 'typescript.svg',
    hideName: true,
    width: 116,
    docsearch: {
      apiKey: '3c2db2aef0c7ff26e8911267474a9b2c',
      indexName: 'typescriptlang',
    },
  },
  vue: {
    category: KeyCategory.Document,
    name: 'Vue',
    shortkeys: 'vue',
    icon: 'vue.png',
    bylang: true,
    homelink: 'https://vuejs.org',
    awesome: 'vuejs/awesome-vue',
    docsearch: {
      appId: 'BH4D9OD16A',
      apiKey: '85cc3221c9f23bfbaa4e3913dd7625ea',
      indexName: 'vuejs',
      algoliaOptions: { facetFilters: ['version:v2'] },
    }, // multi language
  },
  webpack: {
    category: KeyCategory.Document,
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

  _30secondsofcode: {
    category: KeyCategory.More,
    name: '30 seconds of code',
    shortkeys: '3s',
    icon: '30secondsofcode.png',
    template: 'https://www.30secondsofcode.org/?keyphrase=%s',
  }, // todo: inject result. selfbuild
  android: {
    category: KeyCategory.More,
    name: 'Android',
    shortkeys: 'ad',
    icon: 'android.svg',
    homelink: 'https://developer.android.com',
    awesome: 'JStumpp/awesome-android',
    template: 'https://developer.android.com/s/results?q=%s',
  },
  apple: {
    category: KeyCategory.More,
    name: 'Apple Developer',
    shortkeys: 'ap',
    icon: 'apple.svg',
    homelink: 'https://developer.apple.com',
    template: 'https://developer.apple.com/search/?q=%s',
  },
  bundlephobia: {
    category: KeyCategory.More,
    name: 'Bundlephobia',
    shortkeys: 'bp',
    icon: 'bundlephobia.svg',
    template: 'https://bundlephobia.com/result?p=%s',
  },
  caniuse: {
    category: KeyCategory.More,
    name: 'Can I use',
    shortkeys: 'ciu',
    icon: 'caniuse.svg',
    template: 'https://caniuse.com/#search=%s',
  }, // todo: inject result
  cargo: {
    category: KeyCategory.More,
    name: 'cargo',
    shortkeys: 'cg',
    icon: 'Cargo.png',
    template: 'https://crates.io/search?q=%s',
  },
  composer: {
    category: KeyCategory.More,
    name: 'Composer',
    shortkeys: 'cp',
    icon: 'composer.png',
    template: 'https://packagist.org/?query=%s',
  },
  cocoapods: {
    category: KeyCategory.More,
    name: 'CocoaPods',
    hideName: true,
    shortkeys: 'cc',
    icon: 'cocoapods.png',
    width: 110,
    template: 'https://cocoacontrols.com/search?q=%s',
  },
  docker: {
    category: KeyCategory.More,
    name: 'Docker',
    hideName: true,
    shortkeys: 'dk',
    icon: 'docker.svg',
    width: 100,
    homelink: 'https://docs.docker.com',
    awesome: 'veggiemonk/awesome-docker',
    template: 'https://docs.docker.com/search/?q=%s',
  },
  duckduckgo: {
    category: KeyCategory.More,
    name: 'Duckduckgo',
    shortkeys: 'dd',
    icon: 'duckduckgo.svg',
    template: 'https://duckduckgo.com/?q=%s',
    bylang: true,
    disableLang: Language.中文_简体,
  },
  flask: {
    category: KeyCategory.More,
    name: 'Flask',
    shortkeys: 'fl',
    icon: 'flask.png',
    homelink: 'https://flask.palletsprojects.com',
    awesome: 'humiaozuzu/awesome-flask',
    template: 'https://flask.palletsprojects.com/en/1.1.x/search/?q=%s',
  },
  flutter: {
    category: KeyCategory.More,
    name: 'Flutter',
    hideName: true,
    shortkeys: 'ft',
    icon: 'flutter.png',
    width: 110,
    homelink: 'https://flutter.dev',
    awesome: 'Solido/awesome-flutter',
    template: 'https://flutter.dev/search?q=%s',
  },
  go: {
    category: KeyCategory.More,
    name: 'Go',
    shortkeys: 'go',
    icon: 'golang.png',
    homelink: 'https://golang.org',
    awesome: 'avelino/awesome-go',
    template: 'https://golang.org/search?q=%s',
  },
  godoc: {
    category: KeyCategory.More,
    name: 'GoDoc',
    shortkeys: 'god',
    icon: 'godoc.png',
    template: 'https://godoc.org/?q=%s',
  },
  googledev: {
    category: KeyCategory.More,
    name: 'Google Developers',
    shortkeys: 'ggd',
    icon: 'googledev.svg',
    disableLang: Language.中文_简体,
    hideName: true,
    width: 140,
    bylang: true,
    homelink: 'https://developers.google.com',
    template: 'https://developers.google.com/s/results?q=%s&hl=%l',
  },
  java: {
    category: KeyCategory.More,
    name: 'Java',
    shortkeys: 'j',
    icon: 'java.png',
    awesome: 'akullpp/awesome-java',
    template: 'https://docs.oracle.com/apps/search/search.jsp?category=java&q=%s',
  },
  jscoach: {
    category: KeyCategory.More,
    name: 'JS.coach',
    shortkeys: 'jc',
    icon: 'jscoach.svg',
    template: 'https://js.coach/?search=%s',
  },
  // learnxiny: {
  //   category: KeyCategory.More,
  //   name: 'Learn X in Y minutes',
  //   shortkeys: 'xy',
  //   icon: 'learnxiny.png',
  // },
  maven: {
    category: KeyCategory.More,
    name: 'Maven',
    hideName: true,
    shortkeys: 'mv',
    icon: 'maven.png',
    backgroundSize: '88%',
    width: 70,
    template: 'https://mvnrepository.com/search?q=%s',
  },
  mdn: {
    category: KeyCategory.More,
    name: 'MDN',
    hideName: true,
    shortkeys: 'mdn',
    icon: 'MDN.svg',
    width: 130,
    template: 'https://developer.mozilla.org/en-US/search?q=%s',
  },
  mongodb: {
    category: KeyCategory.More,
    name: 'MongoDB',
    shortkeys: 'mg',
    icon: 'mongodb.svg',
    hideName: true,
    width: 110,
    homelink: 'https://docs.mongodb.com',
    template: 'https://docs.mongodb.com/?searchProperty=manual&query=%s',
  },
  microsoft: {
    category: KeyCategory.More,
    name: 'Microsoft Doc',
    shortkeys: 'ms',
    icon: 'microsoft.png',
    awesome: 'quozd/awesome-dotnet',
    template: 'https://docs.microsoft.com/%l/search/?search=%s',
    bylang: true,
  },
  nodejs: {
    category: KeyCategory.More,
    name: 'Node.js',
    shortkeys: 'nd',
    icon: 'nodejs.svg',
    // hideName: true,
    // width: 50,
    backgroundPosition: 'left center',
    homelink: 'https://nodejs.org',
    awesome: 'sindresorhus/awesome-nodejs',
    template: 'https://google.com/search?q=%s%20site:nodejs.org',
  },
  nuget: {
    category: KeyCategory.More,
    name: 'NuGet',
    shortkeys: 'ng',
    icon: 'nuget.svg',
    template: 'https://nuget.org/packages?q=%s',
  },
  pypi: {
    category: KeyCategory.More,
    name: 'PyPI',
    shortkeys: 'pp',
    icon: 'pypi.svg',
    template: 'https://pypi.org/search/?q=%s',
  },
  python: {
    category: KeyCategory.More,
    name: 'Python',
    shortkeys: 'py',
    icon: 'python.png',
    homelink: 'https://python.org',
    awesome: 'vinta/awesome-python',
    template: 'https://python.org/search/?q=%s',
  },
  stackexchange: {
    category: KeyCategory.More,
    name: 'StackExchange',
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: 'https://stackexchange.com/search?q=%s',
  },
  starhistory: {
    category: KeyCategory.More,
    name: 'StarHistory',
    shortkeys: 'sh',
    icon: 'star.png',
    homelink: 'https://star-history.t9t.io',
    template: 'https://star-history.t9t.io/#%s',
  }, // selfbuild
  swift: {
    category: KeyCategory.More,
    name: 'Swift',
    shortkeys: 'sw',
    icon: 'swift.svg',
    hideName: true,
    width: 95,
    homelink: 'https://swift.org/',
    awesome: 'matteocrippa/awesome-swift',
    template: 'https://google.com/search?q=%s%20site:swift.org',
  },
  ruby: {
    category: KeyCategory.More,
    name: 'Ruby',
    shortkeys: 'rb',
    icon: 'ruby.png',
    homelink: 'https://www.ruby-lang.org',
    awesome: 'markets/awesome-ruby',
    template: 'https://cse.google.com/cse?q=%s&cx=013598269713424429640%3Ag5orptiw95w',
  },
  rubygems: {
    category: KeyCategory.More,
    name: 'RubyGems',
    shortkeys: 'rg',
    icon: 'rubygems.jpg',
    template: 'https://rubygems.org/search?query=%s',
  },
  rust: {
    category: KeyCategory.More,
    name: 'Rust',
    shortkeys: 'rs',
    icon: 'rust.png',
    homelink: 'https://rust-lang.org',
    awesome: 'rust-unofficial/awesome-rust',
    template: 'https://doc.rust-lang.org/alloc/index.html?search=%s',
  },
}

export const IsDocsearchKeys = (name: string): boolean => {
  return Object.entries(Keys)
    .filter(([, k]) => k.category === KeyCategory.Document)
    .map(([, k]) => k.name)
    .includes(name)
}

export const IsAvoidKeys = (name: string): boolean => {
  return IsDocsearchKeys(name) || name === 'CheatSheets'
}

// export const GetKeyByName = (name: string): SKey | null => {
//   const r1 = _.find(UsageKeys, { name })
//   if (r1) return r1
//   const r2 = _.find(DocsearchKeys, { name })
//   if (r2) return r2
//   const r3 = _.find(MoreKeys, { name })
//   if (r3) return r3

//   return null
// }

// export const GetKeyByShortkeys = (shortkeys: string): SKey | null => {
//   const r1 = _.find(UsageKeys, { shortkeys })
//   if (r1) return r1
//   const r2 = _.find(DocsearchKeys, { shortkeys })
//   if (r2) return r2
//   const r3 = _.find(MoreKeys, { shortkeys })
//   if (r3) return r3

//   return null
// }

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

import Language from './language'

export interface SKey {
  code: string
  name: string
  pin?: boolean
  usage?: boolean
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
  homelink?: string
  awesome?: string
  devdocs?: string
  docsearch?: ReadonlyArray<{
    appId?: string
    apiKey: string
    indexName: string
    algoliaOptions?: object
    transformData?: (suggestions: any) => any
    lang: Language
  }>
  readmes?: {
    base: string
    paths: ReadonlyArray<{
      path: string
      lang: Language
    }>
    searched?: boolean
  }
}

export const Keys: SKey[] = [
  {
    code: '_30seconds',
    name: '30 seconds of code',
    shortkeys: '3s',
    icon: '30secondsofcode.png',
    template: 'https://www.30secondsofcode.org/?keyphrase=%s',
  }, // todo: inject result. selfbuild
  {
    code: 'android',
    name: 'Android',
    shortkeys: 'ad',
    icon: 'android.svg',
    homelink: 'https://developer.android.com',
    awesome: 'JStumpp/awesome-android',
    template: 'https://developer.android.com/s/results?q=%s',
  },
  {
    code: 'angular',
    name: 'Angular',
    shortkeys: 'ng',
    icon: 'angular.svg',
    homelink: 'https://angular.io',
    awesome: 'PatrickJS/awesome-angular',
    devdocs: 'angular',
  },
  {
    code: 'ansible',
    name: 'Ansible',
    shortkeys: 'as',
    icon: 'ansible.svg',
    devdocs: 'ansible~2.9',
  },
  {
    code: 'apache',
    name: 'Apache',
    shortkeys: 'apc',
    icon: 'apache.png',
    devdocs: 'apache_http_server',
  },
  {
    code: 'apple',
    name: 'Apple Developer',
    shortkeys: 'ap',
    icon: 'apple.svg',
    homelink: 'https://developer.apple.com',
    template: 'https://developer.apple.com/search/?q=%s',
  },
  {
    code: 'aws',
    name: 'AWS',
    shortkeys: 'aws',
    icon: 'aws.svg',
    hideName: true,
    width: 60,
    homelink: 'https://aws.amazon.com',
    awesome: 'donnemartin/awesome-aws',
    template: 'https://aws.amazon.com/search/?searchQuery=%s',
  },
  {
    code: 'babel',
    name: 'Babel',
    shortkeys: 'bb',
    icon: 'babel.svg',
    hideName: true,
    width: 60,
    backgroundPosition: 'left 0.2em center',
    homelink: 'https://babeljs.io',
    devdocs: 'babel',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'd42906b043c5422ea07b44fd49c40a0d',
        indexName: 'babeljs',
      },
    ],
  },
  {
    code: 'bash',
    name: 'Bash',
    shortkeys: 'bs',
    icon: 'bash.svg',
    devdocs: 'bash',
  },
  {
    code: 'bootstrap',
    name: 'Bootstrap',
    shortkeys: 'bts',
    icon: 'bootstrap.svg',
    homelink: 'https://getbootstrap.com',
    devdocs: 'bootstrap~4',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '5990ad008512000bba2cf951ccf0332f',
        indexName: 'bootstrap',
      },
    ],
  },
  {
    code: 'bundlephobia',
    name: 'Bundlephobia',
    shortkeys: 'bp',
    icon: 'bundlephobia.svg',
    template: 'https://bundlephobia.com/result?p=%s',
  },
  {
    code: 'c_lang',
    name: 'C',
    shortkeys: 'c',
    icon: 'c_lang.svg',
    devdocs: 'c',
  },
  {
    code: 'cpp',
    name: 'C++',
    shortkeys: 'cpp',
    icon: 'cpp.svg',
    devdocs: 'cpp',
  },
  {
    code: 'caniuse',
    name: 'Can I use',
    shortkeys: 'ciu',
    icon: 'caniuse.svg',
    template: 'https://caniuse.com/#search=%s',
  }, // todo: inject result
  { code: 'cargo', name: 'cargo', shortkeys: 'cg', icon: 'Cargo.png', template: 'https://crates.io/search?q=%s' },
  {
    code: 'clojure',
    name: 'Clojure',
    shortkeys: 'cj',
    icon: 'clojure.svg',
    homelink: 'https://clojure.org',
    awesome: 'razum2um/awesome-clojure',
    devdocs: 'clojure~1.10',
  },
  {
    code: 'composer',
    name: 'Composer',
    shortkeys: 'cp',
    icon: 'composer.png',
    template: 'https://packagist.org/?query=%s',
  },
  {
    code: 'cocoapods',
    name: 'CocoaPods',
    hideName: true,
    shortkeys: 'cc',
    icon: 'cocoapods.png',
    width: 110,
    template: 'https://cocoacontrols.com/search?q=%s',
  },
  { code: 'cheatsheets', name: 'CheatSheets', shortkeys: 'cs', icon: 'devhints.png', usage: true },
  {
    code: 'crystal',
    name: 'Crystal',
    shortkeys: 'crs',
    icon: 'crystal.svg',
    homelink: 'https://crystal-lang.org',
    awesome: 'veelenga/awesome-crystal',
    devdocs: 'crystal~0.31',
  },
  {
    code: 'css',
    name: 'css',
    shortkeys: 'css',
    icon: 'css.svg',
    devdocs: 'css',
  },
  {
    code: 'dart',
    name: 'Dart',
    shortkeys: 'dt',
    icon: 'dart.svg',
    homelink: 'https://dart.dev',
    awesome: 'yissachar/awesome-dart',
    devdocs: 'dart~2',
  },
  {
    code: 'dayjs',
    name: 'dayjs',
    shortkeys: 'day',
    icon: 'dayjs.png',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '015f468476ca8256cf1c8e8fb6d82cc3',
        indexName: 'dayjs',
      },
    ],
  },
  {
    code: 'django',
    name: 'Django',
    shortkeys: 'dj',
    hideName: true,
    width: 100,
    homelink: 'https://www.djangoproject.com',
    awesome: 'wsvincent/awesome-django',
    icon: 'django.svg',
    devdocs: 'django~3.0',
  },
  {
    code: 'druid',
    name: 'druid',
    shortkeys: 'du',
    icon: 'druid.png',
    hideName: true,
    width: 82,
    homelink: 'https://druid.apache.org',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '2de99082a9f38e49dfaa059bbe4c901d',
        indexName: 'apache_druid',
      },
    ],
  },
  {
    code: 'docker',
    name: 'Docker',
    hideName: true,
    shortkeys: 'dk',
    icon: 'docker.svg',
    width: 100,
    homelink: 'https://docs.docker.com',
    awesome: 'veggiemonk/awesome-docker',
    devdocs: 'docker~19',
    // template: 'https://docs.docker.com/search/?q=%s',
  },
  {
    code: 'duckduckgo',
    name: 'Duckduckgo',
    usage: true,
    shortkeys: 'dd',
    icon: 'duckduckgo.svg',
    template: 'https://duckduckgo.com/?q=%s',
    bylang: true,
    disableLang: Language.中文_简体,
  },
  {
    name: 'Electron',
    code: 'electron',
    shortkeys: 'et',
    icon: 'electron.svg',
    homelink: 'https://www.electronjs.org',
    awesome: 'sindresorhus/awesome-electron',
    devdocs: 'electron',
    // docsearch: { // self build: https://github.com/algolia/docsearch/issues/184
    //   appId: 'L9LD9GHGQJ',
    //   apiKey: '24e7e99910a15eb5d9d93531e5682370',
    //   indexName: 'apis', // and tutorials,packages,apps
    // },
  },
  {
    code: 'elixir',
    name: 'Elixir',
    shortkeys: 'ex',
    icon: 'elixir.png',
    homelink: 'https://elixir-lang.org/',
    awesome: 'h4cc/awesome-elixir',
    devdocs: 'elixir~1.9',
  },
  {
    code: 'ember',
    name: 'Ember',
    shortkeys: 'eb',
    icon: 'ember.svg',
    hideName: true,
    width: 76,
    homelink: 'https://www.emberjs.com',
    devdocs: 'ember',
    // docsearch: { // self build
    //   appId: 'Y1OMR4C7MF',
    //   apiKey: '5d01c83734dc36754d9e94cbf6f8964d',
    //   indexName: 'ember-guides',
    // },
  },
  {
    code: 'eslint',
    name: 'ESLint',
    shortkeys: 'es',
    icon: 'eslint.svg',
    homelink: 'https://eslint.org',
    devdocs: 'eslint',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '891b0e977d96c762a3821e0c00172ac9',
        indexName: 'eslint',
        algoliaOptions: { facetFilters: [['tags:docs', 'tags:blog']] },
      },
    ],
  },
  {
    code: 'erlang',
    name: 'Erlang',
    shortkeys: 'el',
    icon: 'erlang.png',
    homelink: 'https://www.erlang.org',
    devdocs: 'erlang~21',
  },
  {
    code: 'explainshell',
    name: 'explainshell',
    usage: true,
    shortkeys: 'she',
    icon: 'shell.png',
    template: 'https://explainshell.com/explain?cmd=%s',
  },
  {
    code: 'express',
    name: 'Express',
    shortkeys: 'ep',
    icon: 'expressjs.png',
    homelink: 'https://expressjs.com',
    devdocs: 'express',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '7164e33055faa6ecddefd9e08fc59f5d',
        indexName: 'expressjs',
        algoliaOptions: { facetFilters: ['lang:en'] }, // fake multi lang
      },
    ],
  },
  {
    code: 'fastify',
    name: 'fastify',
    shortkeys: 'ff',
    icon: 'fastify.png',
    hideName: true,
    width: 96,
    homelink: 'https://www.fastify.io',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'f7c62ddab40e653f67a6e15be761d951',
        indexName: 'fastify',
        algoliaOptions: { facetFilters: ['version:latest', 'tags:docs'] },
      },
    ],
  },
  {
    code: 'flask',
    name: 'Flask',
    shortkeys: 'fl',
    icon: 'flask.png',
    homelink: 'https://flask.palletsprojects.com',
    awesome: 'humiaozuzu/awesome-flask',
    template: 'https://flask.palletsprojects.com/en/1.1.x/search/?q=%s',
  },
  {
    code: 'flutter',
    name: 'Flutter',
    shortkeys: 'ft',
    icon: 'flutter.svg',
    // hideName: true,
    // width: 110,
    homelink: 'https://flutter.dev',
    awesome: 'Solido/awesome-flutter',
    template: 'https://flutter.dev/search?q=%s',
  },
  {
    code: 'fontawesome',
    name: 'Font Awesome',
    shortkeys: 'fa',
    icon: 'fontawesome.svg',
    homelink: 'https://fontawesome.com',
    template: 'https://fontawesome.com/icons?d=gallery&q=%s',
  },
  {
    code: 'free_programming_books',
    name: 'Free Programming Books',
    shortkeys: 'fpb',
    usage: true,
    icon: 'free_programming_books.png',
    homelink: 'https://github.com/EbookFoundation/free-programming-books',
    readmes: {
      base: 'EbookFoundation/free-programming-books',
      searched: true,
      paths: [
        {
          lang: Language.English,
          path: '/free-programming-books.md',
        },
        {
          lang: Language.中文_简体,
          path: '/free-programming-books-zh.md',
        },
        {
          lang: Language.Português,
          path: '/free-programming-books-pt_BR.md',
        },
        {
          lang: Language.日本語,
          path: '/free-programming-books-ja.md',
        },
        {
          lang: Language.русский,
          path: '/free-programming-books-ru.md',
        },
        {
          lang: Language.Español,
          path: '/free-programming-books-es.md',
        },
        {
          lang: Language.français,
          path: '/free-programming-books-fr.md',
        },
        {
          lang: Language.Deutsche,
          path: '/free-programming-books-de.md',
        },
        {
          lang: Language.Italiano,
          path: '/free-programming-books-it.md',
        },

        {
          lang: Language.한국어,
          path: '/free-programming-books-ko.md',
        },
        {
          lang: Language.العربية,
          path: '/free-programming-books-ar.md',
        },
        {
          lang: Language.Polski,
          path: '/free-programming-books-pl.md',
        },
      ],
    },
  },
  {
    code: 'gatsby',
    name: 'Gatsby',
    shortkeys: 'gb',
    icon: 'gatsby.svg',
    hideName: true,
    width: 108,
    homelink: 'https://www.gatsbyjs.org',
    awesome: 'prayash/awesome-gatsby',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '71af1f9c4bd947f0252e17051df13f9c',
        indexName: 'gatsbyjs',
      },
    ],
  },
  {
    code: 'git',
    name: 'git',
    usage: true,
    shortkeys: 'git',
    icon: 'git.svg',
    devdocs: 'git',
  },
  {
    code: 'github',
    name: 'Github',
    shortkeys: 'gh',
    icon: 'github.svg',
    template: 'https://github.com/search?l=%pl&q=%s',
    bypglang: true,
    usage: true,
  },
  {
    code: 'go',
    name: 'Go',
    shortkeys: 'go',
    icon: 'golang.png',
    homelink: 'https://golang.org',
    awesome: 'avelino/awesome-go',
    devdocs: 'go',
    // template: 'https://golang.org/search?q=%s',
  },
  { code: 'godoc', name: 'GoDoc', shortkeys: 'god', icon: 'godoc.png', template: 'https://godoc.org/?q=%s' },
  {
    code: 'googledev',
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
  {
    code: 'google',
    name: 'Google',
    shortkeys: 'gg',
    icon: 'google.png',
    template: 'https://google.com/search?q=%s&hl=%l',
    bylang: true,
    disableLang: Language.中文_简体,
    usage: true,
  },
  {
    code: 'gradle',
    name: 'Gradle',
    shortkeys: 'gd',
    icon: 'gradle.svg',
    hideName: true,
    width: 88,
    backgroundPosition: 'left center',
    homelink: 'https://gradle.org',
    awesome: 'ksoichiro/awesome-gradle',
    docsearch: [
      {
        lang: Language.English,
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
    ],
  },
  {
    code: 'grafana',
    name: 'grafana',
    shortkeys: 'gf',
    icon: 'grafana.svg',
    hideName: true,
    width: 130,
    homelink: 'https://grafana.com',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '0bd2bd6939038c5ce2c9395732dcf040',
        indexName: 'grafana',
        // start_urls: ['https://grafana.com/docs/grafana/latest/'],
        // https://grafana.com/docs/grafana/latest/
      },
    ],
  },
  {
    code: 'graphql',
    name: 'graphql',
    shortkeys: 'gq',
    icon: 'graphql.svg',
    homelink: 'https://graphql.org',
    awesome: 'chentsulin/awesome-graphql',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'd103541f3e6041148aade2e746ed4d61',
        indexName: 'graphql',
      },
    ],
  },
  {
    code: 'gulp',
    name: 'Gulp',
    shortkeys: 'gp',
    icon: 'gulp.svg',
    backgroundPosition: 'left center',
    homelink: 'https://gulpjs.com',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'a6ef919bce0b83de1bcbad1d4ef753f8',
        indexName: 'gulpjs',
      },
    ],
  },
  {
    code: 'haskell',
    name: 'Haskell',
    shortkeys: 'hs',
    icon: 'haskell.svg',
    homelink: 'https://www.haskell.org',
    devdocs: 'haskell~8',
  },
  {
    code: 'hex',
    name: 'hex',
    shortkeys: 'hex',
    icon: 'hex.png',
    template: 'https://hex.pm/packages?search=%s',
  },
  {
    code: 'hugo',
    name: 'Hugo',
    shortkeys: 'hg',
    icon: 'hugo.svg',
    hideName: true,
    width: 110,
    docsearch: [
      {
        lang: Language.English,
        apiKey: '167e7998590aebda7f9fedcf86bc4a55',
        indexName: 'hugodocs',
      },
    ],
  },
  {
    code: 'html',
    name: 'HTML',
    shortkeys: 'html',
    icon: 'html.svg',
    devdocs: 'html',
  },
  {
    code: 'influxdata',
    name: 'InfluxDB',
    shortkeys: 'id',
    icon: 'influxdata.svg',
    homelink: 'https://www.influxdata.com',
    devdocs: 'influxdata',
  },
  {
    code: 'iconfont',
    name: 'Iconfont',
    shortkeys: 'if',
    icon: 'iconfont.svg',
    template: 'https://www.iconfont.cn/search/index?searchType=icon&fromCollection=1&q=%s',
  },
  {
    code: 'java',
    name: 'Java',
    shortkeys: 'jv',
    icon: 'java.png',
    awesome: 'akullpp/awesome-java',
    devdocs: 'openjdk~8',
    template: 'https://docs.oracle.com/apps/search/search.jsp?category=java&q=%s',
  },
  {
    code: 'javascript',
    name: 'Javascript',
    shortkeys: 'js',
    icon: 'javascript.svg',
    awesome: 'sorrycc/awesome-javascript',
    devdocs: 'javascript',
  },
  {
    code: 'jekyll',
    name: 'Jekyll',
    shortkeys: 'jk',
    icon: 'jekyll.svg',
    hideName: true,
    width: 80,
    homelink: 'https://jekyllrb.com',
    devdocs: 'jekyll',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '50fe39c839958dfad797000f33e2ec17',
        indexName: 'jekyllrb',
      },
    ],
  },
  {
    code: 'jenkinsx',
    name: 'Jenkins X',
    shortkeys: 'jk',
    icon: 'jenkinsx.svg',
    homelink: 'https://jenkins-x.io',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '8904bbd3ca621bef472e3de7e0e29532',
        indexName: 'jenkins_x',
        algoliaOptions: { facetFilters: ['en-us'] },
      },
    ],
  },
  {
    code: 'jquery',
    name: 'jquery',
    shortkeys: 'jq',
    icon: 'jquery.png',
    hideName: true,
    width: 106,
    homelink: 'https://jquery.com/',
    devdocs: 'jquery_core',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '3cfde9aca378c8aab554d5bf1b23489b',
        indexName: 'jquery',
      },
    ],
  },
  {
    code: 'jscoach',
    name: 'JS.coach',
    shortkeys: 'jc',
    usage: true,
    icon: 'jscoach.svg',
    template: 'https://js.coach/?search=%s',
  },
  {
    code: 'jsdelivr',
    name: 'jsDelivr',
    shortkeys: 'jd',
    icon: 'jsdelivr.svg',
    hideName: true,
    width: 100,
    template: 'https://www.jsdelivr.com/?query=%s',
  },
  {
    code: 'koa',
    name: 'koa',
    hideName: true,
    width: 80,
    shortkeys: 'koa',
    icon: 'koa.svg',
    homelink: 'https://koajs.com',
    awesome: 'ellerbrock/awesome-koa',
    devdocs: 'koa',
  },
  {
    code: 'kotlin',
    name: 'Kotlin',
    shortkeys: 'kl',
    icon: 'kotlin.svg',
    homelink: 'https://kotlinlang.org',
    awesome: 'KotlinBy/awesome-kotlin',
    devdocs: 'kotlin',
    // docsearch: {
    //   appId: '7961PKYRXV',
    //   apiKey: '604fa45d89af86bdf9eed4cc862b2d0b',
    //   indexName: 'prod_KOTLINLANG',
    // },
  },
  // learnxiny: {
  //     //   name: 'Learn X in Y minutes',
  //   shortkeys: 'xy',
  //   icon: 'learnxiny.png',
  // },
  {
    code: 'laravel',
    name: 'Laravel',
    shortkeys: 'lar',
    icon: 'laravel.svg',
    homelink: 'https://laravel.com',
    awesome: 'chiraggude/awesome-laravel',
    devdocs: 'laravel~5.7',
    // self build algolia
  },
  {
    code: 'leancloud',
    name: 'LeanCloud',
    shortkeys: 'lc',
    icon: 'leancloud.png',
    availableLang: Language.中文_简体,
    hideName: true,
    width: 100,
    backgroundSize: '90%',
    homelink: 'https://leancloud.app',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '357b777ed18e79673a2c1de3f6c64478',
        indexName: 'leancloud',
      },
    ],
  },
  {
    code: 'learn_regex',
    name: 'Learn Regex',
    usage: true,
    shortkeys: 'lr',
    icon: 'regex.svg',
    homelink: 'https://github.com/ziishaned/learn-regex',
    readmes: {
      base: 'ziishaned/learn-regex',
      paths: [
        {
          lang: Language.English,
          path: '/README.md',
        },
        {
          lang: Language.Español,
          path: '/translations/README-es.md',
        },
        {
          lang: Language.français,
          path: '/translations/README-fr.md',
        },
        {
          lang: Language.Português,
          path: '/translations/README-pt_BR.md',
        },
        {
          lang: Language.中文_简体,
          path: '/translations/README-cn.md',
        },
        {
          lang: Language.日本語,
          path: '/translations/README-ja.md',
        },
        {
          lang: Language.한국어,
          path: '/translations/README-ko.md',
        },
        {
          lang: Language.Polski,
          path: '/translations/README-pl.md',
        },
        {
          lang: Language.русский,
          path: '/translations/README-ru.md',
        },
      ],
    },
  },
  {
    code: 'less',
    name: 'less',
    hideName: true,
    width: 80,
    shortkeys: 'ls',
    icon: 'less.svg',
    homelink: 'http://lesscss.org',
    devdocs: 'less',
  },
  {
    code: 'lodash',
    name: 'lodash',
    shortkeys: 'ld',
    icon: 'lodash.svg',
    homelink: 'https://lodash.com',
    devdocs: 'lodash~4',
  },
  {
    code: 'lua',
    name: 'lua',
    shortkeys: 'lua',
    icon: 'lua.svg',
    homelink: 'https://www.lua.org',
    devdocs: 'lua~5.3',
  },
  {
    code: 'markdown',
    name: 'Markdown',
    shortkeys: 'md',
    icon: 'markdown.svg',
    backgroundPosition: 'left center',
    devdocs: 'markdown',
  },
  {
    code: 'mariadb',
    name: 'MariaDB',
    shortkeys: 'mdb',
    icon: 'mariadb.svg',
    homelink: 'https://mariadb.org',
    devdocs: 'mariadb',
  },
  {
    code: 'maven',
    name: 'Maven Repository',
    hideName: true,
    shortkeys: 'mv',
    icon: 'maven.png',
    backgroundSize: '88%',
    width: 70,
    template: 'https://mvnrepository.com/search?q=%s',
  },
  {
    code: 'meteor',
    name: 'Meteor',
    shortkeys: 'mt',
    icon: 'meteor.svg',
    homelink: 'https://www.meteor.com',
    devdocs: 'meteor~1.5',
  },
  {
    code: 'material',
    name: 'Material-UI',
    shortkeys: 'mu',
    icon: 'material.svg',
    homelink: 'https://material-ui.com',
    docsearch: [
      {
        lang: Language.English,
        appId: 'BH4D9OD16A',
        apiKey: '1d8534f83b9b0cfea8f16498d19fbcab',
        indexName: 'material-ui',
      },
    ],
  },
  {
    code: 'mongodb',
    name: 'MongoDB',
    shortkeys: 'mg',
    icon: 'mongodb.svg',
    hideName: true,
    width: 110,
    homelink: 'https://docs.mongodb.com',
    awesome: 'ramnes/awesome-mongodb',
    template: 'https://docs.mongodb.com/?searchProperty=manual&query=%s',
  },
  {
    code: 'dotnet',
    name: '.NET',
    shortkeys: 'net',
    icon: 'microsoft.png',
    awesome: 'quozd/awesome-dotnet',
    // template: 'https://docs.microsoft.com/%l/search/?search=%s',
    template: 'https://docs.microsoft.com/zh-cn/dotnet/api/index?term=%s',
    bylang: true,
  },
  {
    code: 'netlify',
    name: 'netlify',
    shortkeys: 'nl',
    icon: 'netlify.svg',
    homelink: 'https://www.netlify.com',
    docsearch: [
      {
        lang: Language.English,
        appId: '4RTNPM1QF9',
        apiKey: '260466eb2466a36278b2fdbcc56ad7ba',
        indexName: 'docs-manual',
      },
    ],
  },
  {
    code: 'nestjs',
    name: 'nestjs',
    shortkeys: 'ns',
    icon: 'nestjs.svg',
    homelink: 'https://nestjs.com',
    awesome: 'juliandavidmr/awesome-nestjs',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '9ea53de1a6911255834352bbbe4d3417',
        indexName: 'nestjs',
      },
    ],
  },
  {
    code: 'nginx',
    name: 'NGINX',
    hideName: true,
    width: 100,
    backgroundSize: '86%',
    shortkeys: 'nx',
    icon: 'nginx.svg',
    homelink: 'https://www.nginx.com',
    devdocs: 'nginx',
  },
  {
    code: 'node',
    name: 'Node.js',
    shortkeys: 'nd',
    icon: 'nodejs.svg',
    backgroundPosition: 'left center',
    homelink: 'https://nodejs.org',
    awesome: 'sindresorhus/awesome-nodejs',
    devdocs: 'node',
    // template: 'https://google.com/search?q=%s%20site:nodejs.org',
  },
  {
    code: 'npm',
    name: 'npm',
    hideName: true,
    shortkeys: 'npm',
    icon: 'npm.svg',
    backgroundSize: '86%',
    width: 60,
    homelink: 'https://www.npmjs.com',
    template: 'https://npms.io/search?q=%s',
    usage: true,
  }, // todo: inject result
  { code: 'nuget', name: 'NuGet', shortkeys: 'ng', icon: 'nuget.svg', template: 'https://nuget.org/packages?q=%s' },
  {
    code: 'perl',
    name: 'Perl',
    shortkeys: 'pl',
    icon: 'perl.svg',
    homelink: 'https://www.perl.org',
    devdocs: 'perl~5.26',
  },
  {
    code: 'pipenv',
    name: 'pipenv',
    shortkeys: 'pe',
    icon: 'pipenv.png',
    homelink: 'https://pipenv.kennethreitz.org',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '0dbb76467f0c180a1344fc46858df17b',
        indexName: 'pipenv',
      },
    ],
  },
  {
    code: 'phoenix',
    name: 'Phoenix',
    shortkeys: 'px',
    icon: 'phoenix.svg',
    homelink: 'http://www.phoenixframework.org/',
    devdocs: 'phoenix',
  },
  {
    code: 'php',
    name: 'PHP',
    hideName: true,
    width: 80,
    shortkeys: 'php',
    icon: 'php.svg',
    homelink: 'https://www.php.net',
    awesome: 'ziadoz/awesome-php',
    devdocs: 'php',
  },
  {
    code: 'play',
    name: 'play',
    shortkeys: 'pl',
    icon: 'play.svg',
    hideName: true,
    width: 60,
    homelink: 'https://www.playframework.com',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'a0b34e68c804cf96e76adcb02d47159b',
        indexName: 'playframework',
        algoliaOptions: { facetFilters: ['tags: en'] },
      },
    ],
  },
  {
    code: 'postgresql',
    name: 'PostgreSQL',
    shortkeys: 'pg',
    icon: 'postgresql.svg',
    homelink: 'https://www.postgresql.org',
    awesome: 'dhamaniasad/awesome-postgres',
    devdocs: 'postgresql~12',
  },
  {
    code: 'prettier',
    name: 'prettier',
    shortkeys: 'pr',
    icon: 'prettier.png',
    homelink: 'https://prettier.io',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '9fcdb2a62af4c47cc5eecf3d5a747818',
        indexName: 'prettier',
      },
    ],
  },
  {
    code: 'public_apis',
    name: 'Public APIs',
    shortkeys: 'pa',
    icon: 'api.svg',
    usage: true,
    homelink: 'https://github.com/public-apis/public-apis',
    readmes: {
      base: 'zicjin/public-apis',
      searched: true,
      paths: [
        {
          lang: Language.English,
          path: '/README.md',
        },
      ],
    },
  },
  {
    code: 'puppeteer',
    name: 'Puppeteer',
    shortkeys: 'pp',
    icon: 'puppeteer.svg',
    homelink: 'https://pptr.dev',
    awesome: 'transitive-bullshit/awesome-puppeteer',
    devdocs: 'puppeteer',
  },
  {
    code: 'python',
    name: 'Python',
    shortkeys: 'py',
    icon: 'python.svg',
    homelink: 'https://python.org',
    awesome: 'vinta/awesome-python',
    devdocs: 'python~3.8',
    // template: 'https://python.org/search/?q=%s',
  },
  {
    code: 'pytouch',
    name: 'PyTouch',
    shortkeys: 'pt',
    icon: 'pytouch.svg',
    hideName: true,
    width: 116,
    homelink: 'https://pytorch.org',
    awesome: 'bharathgs/Awesome-pytorch-list',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'e3b73ac141dff0b0fd27bdae9055bc73',
        indexName: 'pytorch',
      },
    ],
  },
  { code: 'pypi', name: 'PyPI', shortkeys: 'pp', icon: 'pypi.svg', template: 'https://pypi.org/search/?q=%s' },
  {
    code: 'react',
    name: 'React',
    shortkeys: 'ra',
    usage: true,
    icon: 'react.svg',
    homelink: 'https://reactjs.org',
    awesome: 'enaqx/awesome-react',
    devdocs: 'react',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '36221914cce388c46d0420343e0bb32e',
        indexName: 'react',
      },
      {
        lang: Language.中文_简体,
        apiKey: '72499aaa151dba0828babe727c7b86ee',
        indexName: 'reactjs_zh-hans',
      },
      {
        lang: Language.Português,
        apiKey: 'c87837f14775a7c3e2226c3a9e75a7e3',
        indexName: 'reactjs_pt-br',
      },
      {
        lang: Language.日本語,
        apiKey: '0a814a89e0c31ab1d55d440f967517b4',
        indexName: 'reactjs_ja',
      },
      {
        lang: Language.русский,
        apiKey: 'dc8fe7f1f08bb0814a56d2ba8c1ea871',
        indexName: 'reactjs_ru',
      },
      {
        lang: Language.Español,
        apiKey: 'c768ab92aabcfa2883092851022a378b',
        indexName: 'reactjs_es',
      },
      {
        lang: Language.français,
        apiKey: '30595603d779427c7cede78a212e435b',
        indexName: 'reactjs_fr',
      },
      {
        lang: Language.Italiano,
        apiKey: '9b7d68e6dea8533a9582f0e8087e0b6d',
        indexName: 'reactjs_it',
      },
      {
        lang: Language.한국어,
        apiKey: '61afa0daa482db2154b69c27d642f815',
        indexName: 'reactjs_ko',
      },
      {
        lang: Language.العربية,
        apiKey: '8cdefb44db3f046e4954b1310456c271',
        indexName: 'reactjs_ar',
      },
      {
        lang: Language.Polski,
        apiKey: '810e1f53c2483bf56839cdda229ffb29',
        indexName: 'reactjs_pl',
      },
    ],
  },
  {
    code: 'react_native',
    name: 'React Native',
    shortkeys: 'ran',
    icon: 'react.svg',
    bylang: true,
    homelink: 'https://facebook.github.io/react-native',
    awesome: 'jondot/awesome-react-native',
    devdocs: 'react_native',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '2c98749b4a1e588efec53b2acec13025',
        indexName: 'react-native-versions',
      },
    ],
  },
  {
    code: 'redis',
    name: 'Redis',
    shortkeys: 'rd',
    icon: 'redis.svg',
    homelink: 'https://redis.io',
    devdocs: 'redis',
  },
  {
    code: 'rails',
    name: 'Rails',
    hideName: true,
    width: 100,
    shortkeys: 'ra',
    icon: 'rails.svg',
    homelink: 'https://www.ruby-lang.org',
    awesome: 'markets/awesome-ruby',
    devdocs: 'rails~6.0',
  },
  {
    code: 'ruby',
    name: 'Ruby',
    shortkeys: 'rb',
    icon: 'ruby.svg',
    homelink: 'https://www.ruby-lang.org',
    awesome: 'markets/awesome-ruby',
    devdocs: 'ruby~2.6',
    // template: 'https://cse.google.com/cse?q=%s&cx=013598269713424429640%3Ag5orptiw95w',
  },
  {
    code: 'rubygems',
    name: 'RubyGems',
    shortkeys: 'rg',
    icon: 'rubygems.jpg',
    template: 'https://rubygems.org/search?query=%s',
  },
  {
    code: 'rust',
    name: 'Rust',
    shortkeys: 'rs',
    icon: 'rust.svg',
    homelink: 'https://rust-lang.org',
    awesome: 'rust-unofficial/awesome-rust',
    devdocs: 'rust',
    // template: 'https://doc.rust-lang.org/alloc/index.html?search=%s',
  },
  {
    code: 'sass',
    name: 'Sass',
    shortkeys: 'ss',
    icon: 'sass.svg',
    devdocs: 'sass',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'a409ff5d6a2476083c1a8dd1f8c04ec5',
        indexName: 'sass-lang',
      },
    ],
  },
  {
    code: 'scala',
    name: 'scala',
    shortkeys: 'scl',
    icon: 'scala.png',
    hideName: true,
    width: 72,
    homelink: 'https://www.scala-lang.org',
    awesome: 'lauris/awesome-scala',
    devdocs: 'scala~2.13_library',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'fbc439670f5d4e3730cdcb715c359391',
        indexName: 'scala-lang',
        algoliaOptions: { facetFilters: ['language:en'] },
      },
    ],
  },
  {
    code: 'serverless',
    name: 'serverless',
    shortkeys: 'sl',
    icon: 'serverless.svg',
    homelink: 'https://serverless.com',
    awesome: 'anaibol/awesome-serverless',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'd5a39b712b86965d93534207ef5423df',
        indexName: 'serverless',
      },
    ],
  },
  {
    code: 'socode',
    name: 'socode',
    shortkeys: 'sc',
    icon: 'socode.png',
    bylang: true,
    availableLang: Language.中文_简体,
    usage: true,
  },
  {
    code: 'spotify',
    name: 'Spotify',
    hideName: true,
    width: 100,
    shortkeys: 'sp',
    icon: 'spotify.svg',
    homelink: 'https://developer.spotify.com',
    template: 'https://developer.spotify.com/documentation/?query=%s',
  },
  {
    code: 'sqlite',
    name: 'SQLite',
    hideName: true,
    width: 80,
    shortkeys: 'sql',
    icon: 'sqlite.svg',
    homelink: 'https://www.sqlite.org',
    devdocs: 'sqlite',
  },
  {
    code: 'stackexchange',
    name: 'StackExchange',
    usage: true,
    shortkeys: 'se',
    icon: 'stackexchange.png',
    template: 'https://stackexchange.com/search?q=%s',
  },
  {
    code: 'starhistory',
    name: 'StarHistory',
    shortkeys: 'sh',
    usage: true,
    icon: 'star.png',
    homelink: 'https://star-history.t9t.io',
    template: 'https://star-history.t9t.io/#%s',
  }, // selfbuild
  {
    code: 'swift',
    name: 'Swift',
    shortkeys: 'sw',
    icon: 'swift.svg',
    hideName: true,
    width: 95,
    homelink: 'https://swift.org/',
    awesome: 'matteocrippa/awesome-swift',
    template: 'https://google.com/search?q=%s%20site:swift.org',
  },
  {
    code: 'tldr',
    name: 'tldr',
    usage: true,
    shortkeys: 'tl',
    icon: 'tldr.svg',
    hideName: true,
    width: 80,
    template: 'https://tldr.ostera.io/%s',
  },
  {
    code: 'taro',
    name: 'Taro',
    shortkeys: 'tr',
    icon: 'taro.png',
    availableLang: Language.中文_简体,
    homelink: 'https://taro-docs.jd.com',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '57b9948bff42bc0dbc6c219556fbae35',
        indexName: 'taro',
      },
    ],
  },
  {
    code: 'tensorflow_python',
    name: 'Tensorflow Python',
    shortkeys: 'tf',
    icon: 'tensorflow.svg',
    homelink: 'https://www.tensorflow.org',
    awesome: 'jtoy/awesome-tensorflow',
    devdocs: 'tensorflow~python',
  },
  {
    code: 'tools',
    name: 'Tools Tiles',
    usage: true,
    shortkeys: 'tt',
    icon: 'tiles.png',
  },
  {
    code: 'typescript',
    name: 'Typescript',
    shortkeys: 'ts',
    icon: 'typescript.svg',
    hideName: true,
    width: 116,
    homelink: 'https://www.typescriptlang.org',
    awesome: 'dzharii/awesome-typescript',
    devdocs: 'typescript',
    docsearch: [
      {
        lang: Language.English,
        apiKey: '3c2db2aef0c7ff26e8911267474a9b2c',
        indexName: 'typescriptlang',
      },
    ],
  },
  {
    code: 'utf',
    name: 'UTF8 Icons',
    hideName: true,
    width: 80,
    shortkeys: 'utf',
    icon: 'utf.svg',
    template: 'https://www.utf8icons.com/search?query=%s',
  },
  {
    code: 'vue',
    name: 'Vue',
    shortkeys: 'vue',
    usage: true,
    icon: 'vue.png',
    homelink: 'https://vuejs.org',
    awesome: 'vuejs/awesome-vue',
    devdocs: 'vue~2',
    docsearch: [
      {
        appId: 'BH4D9OD16A',
        apiKey: '85cc3221c9f23bfbaa4e3913dd7625ea',
        indexName: 'vuejs',
        algoliaOptions: { facetFilters: ['version:v2'] },
        lang: Language.English,
      },
      {
        appId: 'BH4D9OD16A',
        apiKey: '5638280abff9d207417bb03be05f0b25',
        indexName: 'vuejs_cn2',
        algoliaOptions: { facetFilters: ['version:v2'] },
        lang: Language.中文_简体,
      },
      {
        appId: 'BH4D9OD16A',
        apiKey: '0a75952972806d9ad07e387d08e9cc4c',
        indexName: 'vuejs_jp',
        algoliaOptions: { facetFilters: ['version:v2'] },
        lang: Language.日本語,
      },
      {
        appId: 'BH4D9OD16A',
        apiKey: 'c6f9366f6f7fe057ee3e01747b603d9f',
        indexName: 'vuejs_ru',
        algoliaOptions: { facetFilters: ['version:v2'] },
        lang: Language.русский,
      },
      {
        appId: 'BH4D9OD16A',
        apiKey: 'fd19a0f4b0ab402d2b6f9f95e9003e3b',
        indexName: 'vuejs-es',
        lang: Language.Español,
      },
    ],
  },
  {
    code: 'webpack',
    name: 'Webpack',
    shortkeys: 'wp',
    icon: 'webpack.svg',
    hideName: true,
    width: 100,
    devdocs: 'webpack',
    homelink: 'https://webpack.js.org',
    awesome: 'webpack-contrib/awesome-webpack',
    docsearch: [
      {
        lang: Language.English,
        apiKey: 'fac401d1a5f68bc41f01fb6261661490',
        indexName: 'webpack-js-org',
      },
    ],
  },
  {
    code: 'yarn',
    name: 'yarn',
    shortkeys: 'yr',
    icon: 'yarn.svg',
    homelink: 'https://yarnpkg.com',
    devdocs: 'yarn',
  },
]

export const IsDocsearchKeys = (code: string): boolean => {
  return Keys.filter(k => k.docsearch)
    .map(k => k.code)
    .includes(code)
}

export const IsDevdocsKeys = (code: string): boolean => {
  return Keys.filter(k => k.devdocs)
    .map(k => k.code)
    .includes(code)
}

export const IsReadmeKeys = (code: string): boolean => {
  return Keys.filter(k => k.readmes)
    .map(k => k.code)
    .includes(code)
}

export const IsAvoidKeys = (code: string): boolean => {
  return IsDocsearchKeys(code) || IsDevdocsKeys(code) || IsReadmeKeys(code) || code === 'cheatsheets' || code === 'tools' || code === 'starhistory'
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

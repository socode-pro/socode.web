export interface Stack {
  id: string
  name: string
  repos: string[]
  predefined?: boolean
}

const Stacks: Stack[] = [
  {
    id: 'java-web-frameworks',
    name: 'Java Web Frameworks',
    repos: [
      'spring-projects/spring-boot',
      'eclipse-vertx/vert.x',
      'spring-projects/spring-framework',
      'playframework/playframework',
      'grails/grails-core',
      'perwendel/spark',
      'dropwizard/dropwizard',
      'vaadin/framework',
      'jhipster/generator-jhipster',
    ],
    predefined: true,
  },
  {
    id: 'node-web-frameworks',
    name: 'Node Web Frameworks',
    repos: [
      'nestjs/nest',
      'koajs/koa',
      'fastify/fastify',
      'adonisjs/core',
      'restify/node-restify',
      'meteor/meteor',
      'expressjs/express',
      'hapijs/hapi',
      'balderdashy/sails',
    ],
    predefined: true,
  },
  {
    id: 'micro-service',
    name: 'Micro service',
    repos: [
      'containous/traefik',
      'envoyproxy/envoy',
      'istio/istio',
      'linkerd/linkerd2',
      'hashicorp/consul',
      'ctripcorp/apollo',
      'kubernetes/kubernetes',
      // 'caddyserver/caddy',
    ],
    predefined: true,
  },
  {
    id: 'java-micro-service',
    name: 'Java Micro service',
    repos: [
      'apache/dubbo',
      'alibaba/Sentinel',
      'resilience4j/resilience4j',
      'alibaba/nacos',
      'spring-cloud/spring-cloud-gateway',
      'spring-cloud/spring-cloud-sleuth',
    ],
    predefined: true,
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    repos: [
      'kubernetes/minikube',
      'rancher/rancher',
      'rancher/k3s',
      'kubernetes-sigs/kubespray',
      'kubesphere/kubesphere',
      'openshift/origin',
      'gardener/gardener',
    ],
    predefined: true,
  },
  {
    id: 'data-processing',
    name: 'Data Processing',
    repos: ['apache/spark', 'apache/kafka', 'apache/storm', 'apache/Beam', 'apache/Flink', 'apache/pulsar', 'antirez/redis'],
    predefined: true,
  },
  {
    id: 'cluster-db',
    name: 'Cluster Database',
    repos: [
      'mongodb/mongo',
      'apache/cassandra',
      'basho/riak',
      'cockroachdb/cockroach',
      'pingcap/tidb',
      'ravendb/ravendb',
      'apache/couchdb',
    ],
    predefined: true,
  },
  {
    id: 'time-series-db',
    name: 'TimeSeries Database',
    repos: [
      'prometheus/prometheus',
      'influxdata/influxdb',
      'apache/druid',
      'elastic/elasticsearch',
      'grafana/loki',
      'Microsoft/Trill',
      'timescale/timescaledb',
      'taosdata/TDengine',
    ],
    predefined: true,
  },
  {
    id: 'client-db',
    name: 'Client Database',
    repos: [
      'louischatriot/nedb',
      'pubkey/rxdb',
      'pouchdb/pouchdb',
      'objectbox/objectbox-java',
      'realm/realm-cocoa',
      'Tencent/wcdb',
      'ccgus/fmdb',
    ],
    predefined: true,
  },
  {
    id: 'crawler',
    name: 'Crawler',
    repos: [
      'scrapy/scrapy',
      'code4craft/webmagic',
      'henrylee2cn/pholcus',
      'binux/pyspider',
      'bda-research/node-crawler',
      'apifytech/apify-js',
      'yujiosaka/headless-chrome-crawler',
      'dotnetcore/DotnetSpider',
      'crawlab-team/crawlab',
      'gaojiuli/toapi',
      'gocolly/colly',
      'matthewmueller/x-ray',
      'simplecrawler/simplecrawler',
    ],
    predefined: true,
  },
  {
    id: 'image-server',
    name: 'Image Server',
    repos: ['imgproxy/imgproxy', 'h2non/imaginary', 'buaazp/zimg', 'imazen/imageflow'],
    predefined: true,
  },
  {
    id: 'webfront-frameworks',
    name: 'WebFront Frameworks',
    repos: ['facebook/react', 'vuejs/vue', 'angular/angular', 'sveltejs/svelte', 'emberjs/ember.js', 'jquery/jquery'],
    predefined: true,
  },
  {
    id: 'react-ui',
    name: 'React UI',
    repos: [
      'ant-design/ant-design',
      'mui-org/material-ui',
      'Semantic-Org/Semantic-UI-React',
      'react-bootstrap/react-bootstrap',
      'palantir/blueprint',
      'segmentio/evergreen',
      'react-toolbox/react-toolbox',
      'OfficeDev/office-ui-fabric-react',
      'grommet/grommet',
      'JetBrains/ring-ui',
    ],
    predefined: true,
  },
  {
    id: 'vue-ui',
    name: 'Vue UI',
    repos: [
      'ElemeFE/element',
      'ElemeFE/mint-ui',
      'PanJiaChen/vue-element-admin',
      'youzan/vant',
      'buefy/buefy',
      'vuetifyjs/vuetify',
      'vueComponent/ant-design-vue',
    ],
    predefined: true,
  },
  {
    id: 'angular-ui',
    name: 'Angular UI',
    repos: ['ionic-team/ionic', 'primefaces/primeng', 'akveo/nebular', 'NG-ZORRO/ng-zorro-antd', 'angular/components'],
    predefined: true,
  },
  {
    id: 'non-dependent-ui',
    name: 'Non-dependent UI',
    repos: [
      'Dogfalo/materialize',
      'google/material-design-lite',
      'nostalgic-css/NES.css',
      'jgthms/bulma',
      'tailwindcss/tailwindcss',
      'picturepan2/spectre',
      'primer/css',
      'milligram/milligram',
      'basscss/basscss',
      'foundation/foundation-sites',
    ],
    predefined: true,
  },
  {
    id: 'static-web',
    name: 'Static Web',
    repos: [
      'zeit/next.js',
      'nuxt/nuxt.js',
      'jekyll/jekyll',
      'gohugoio/hugo',
      'gatsbyjs/gatsby',
      'hexojs/hexo',
      'vuejs/vuepress',
      'saberland/saber',
      'docpad/docpad',
    ],
    predefined: true,
  },
  {
    id: 'wechat-mini-app',
    name: 'Wechat Mini App',
    repos: [
      'Meituan-Dianping/mpvue',
      'NervJS/taro',
      'Tencent/omi',
      'didi/chameleon',
      'dcloudio/uni-app',
      'remaxjs/remax',
      'didi/mpx',
    ],
    predefined: true,
  },
  {
    id: 'web-chart',
    name: 'Web Chart',
    repos: [
      'antvis/g2',
      'antvis/G6',
      'antvis/f2',
      'frappe/charts',
      'highcharts/highcharts',
      'processing/p5.js',
      'plotly/plotly.js',
      'apache/incubator-echarts',
      'apexcharts/apexcharts.js',
      'chartjs/Chart.js',
      'c3js/c3',
      'cube-js/cube.js',
      'uber/react-vis',
      'hshoff/vx',
      'timqian/chart.xkcd',
    ],
    predefined: true,
  },
  {
    id: 'slack',
    name: 'Slack Like',
    repos: [
      'RocketChat/Rocket.Chat',
      'withspectrum/spectrum',
      'vector-im/riot-web',
      'mattermost/mattermost-server',
      'wireapp/wire-server',
      'zulip/zulip',
    ],
    predefined: true,
  },
  {
    id: 'forum',
    name: 'Forum',
    repos: [
      'flarum/flarum',
      'withspectrum/spectrum',
      'discourse/discourse',
      'NodeBB/NodeBB',
    ],
    predefined: true,
  }
]

// MQ, Sub/Push
// console.log(JSON.stringify(Stacks))

export default Stacks
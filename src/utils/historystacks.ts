export enum StackType {
  Backend,
  Frontend,
  Private,
}

export interface Stack {
  id: string
  name: string
  nameChinese?: string
  repos: string[]
  type: StackType
  hidden?: boolean
}

const Stacks: Stack[] = [
  {
    id: "java-web-frameworks",
    name: "Java Web Frameworks",
    type: StackType.Backend,
    repos: [
      "spring-projects/spring-boot",
      "eclipse-vertx/vert.x",
      "spring-projects/spring-framework",
      "playframework/playframework",
      "grails/grails-core",
      "perwendel/spark",
      "dropwizard/dropwizard",
      "vaadin/framework",
      "jhipster/generator-jhipster",
    ],
  },
  {
    id: "node-web-frameworks",
    name: "Node Web Frameworks",
    type: StackType.Backend,
    repos: [
      "nestjs/nest",
      "koajs/koa",
      "fastify/fastify",
      "adonisjs/core",
      "restify/node-restify",
      "meteor/meteor",
      "expressjs/express",
      "hapijs/hapi",
      "balderdashy/sails",
    ],
  },
  {
    id: "micro-service",
    name: "Micro service",
    nameChinese: "微服务",
    type: StackType.Backend,
    repos: [
      "containous/traefik",
      "envoyproxy/envoy",
      "istio/istio",
      "linkerd/linkerd2",
      "hashicorp/consul",
      "ctripcorp/apollo",
      "kubernetes/kubernetes",
      // 'caddyserver/caddy',
    ],
  },
  {
    id: "java-micro-service",
    name: "Java Micro service",
    nameChinese: "Java 微服务",
    type: StackType.Backend,
    repos: [
      "apache/dubbo",
      "alibaba/Sentinel",
      "resilience4j/resilience4j",
      "alibaba/nacos",
      "spring-cloud/spring-cloud-gateway",
      "spring-cloud/spring-cloud-sleuth",
    ],
  },
  {
    id: "kubernetes",
    name: "Kubernetes",
    nameChinese: "Kubernetes 管理",
    type: StackType.Backend,
    repos: [
      "kubernetes/minikube",
      "rancher/rancher",
      "rancher/k3s",
      "kubernetes-sigs/kubespray",
      "kubesphere/kubesphere",
      "openshift/origin",
      "gardener/gardener",
    ],
  },
  {
    id: "data-processing",
    name: "Data Processing",
    nameChinese: "数据处理",
    type: StackType.Backend,
    repos: [
      "apache/spark",
      "apache/kafka",
      "apache/storm",
      "apache/Beam",
      "apache/Flink",
      "apache/pulsar",
      "antirez/redis",
    ],
  },
  {
    id: "cluster-db",
    name: "Cluster Database",
    nameChinese: "分布式数据库",
    type: StackType.Backend,
    repos: [
      "mongodb/mongo",
      "apache/cassandra",
      "basho/riak",
      "cockroachdb/cockroach",
      "pingcap/tidb",
      "ravendb/ravendb",
      "apache/couchdb",
    ],
  },
  {
    id: "time-series-db",
    name: "TimeSeries Database",
    nameChinese: "时间序列数据库",
    type: StackType.Backend,
    repos: [
      "prometheus/prometheus",
      "influxdata/influxdb",
      "apache/druid",
      "elastic/elasticsearch",
      "grafana/loki",
      "Microsoft/Trill",
      "timescale/timescaledb",
      "taosdata/TDengine",
    ],
  },
  {
    id: "crawler",
    name: "Crawler",
    nameChinese: "爬虫",
    type: StackType.Backend,
    repos: [
      "scrapy/scrapy",
      "code4craft/webmagic",
      "henrylee2cn/pholcus",
      "binux/pyspider",
      "bda-research/node-crawler",
      "apifytech/apify-js",
      "yujiosaka/headless-chrome-crawler",
      "dotnetcore/DotnetSpider",
      "crawlab-team/crawlab",
      "gaojiuli/toapi",
      "gocolly/colly",
      "matthewmueller/x-ray",
      "simplecrawler/simplecrawler",
    ],
  },
  {
    id: "mq",
    name: "Message Queue",
    nameChinese: "消息队列",
    type: StackType.Backend,
    repos: [
      "rabbitmq/rabbitmq-server",
      "RichardKnop/machinery",
      "nats-io/nats-server",
      "fireworq/fireworq",
      "OptimalBits/bull",
      "agenda/agenda",
      "celery/celery",
      "nsqio/nsq",
      "travisjeffery/jocko",
    ],
  },
  {
    id: "image-server",
    name: "Image Server",
    type: StackType.Backend,
    repos: ["imgproxy/imgproxy", "h2non/imaginary", "buaazp/zimg", "imazen/imageflow"],
  },
  {
    id: "slack",
    name: "Slack Like",
    type: StackType.Backend,
    repos: [
      "RocketChat/Rocket.Chat",
      "vector-im/riot-web",
      "mattermost/mattermost-server",
      "wireapp/wire-server",
      "zulip/zulip",
    ],
  },
  {
    id: "forum",
    name: "Forum",
    nameChinese: "社区",
    type: StackType.Backend,
    repos: ["flarum/flarum", "withspectrum/spectrum", "discourse/discourse", "NodeBB/NodeBB"],
  },
  {
    id: "java-web-cache",
    name: "Java Web Cache",
    type: StackType.Backend,
    repos: ["infinispan/infinispan", "hazelcast/hazelcast", "ehcache/ehcache3", "ben-manes/caffeine"],
  },
  {
    id: "webfront-frameworks",
    name: "WebFront Frameworks",
    type: StackType.Frontend,
    repos: ["facebook/react", "vuejs/vue", "angular/angular", "sveltejs/svelte", "emberjs/ember.js", "jquery/jquery"],
  },
  {
    id: "react-ui",
    name: "React UI",
    type: StackType.Frontend,
    repos: [
      "ant-design/ant-design",
      "mui-org/material-ui",
      "Semantic-Org/Semantic-UI-React",
      "react-bootstrap/react-bootstrap",
      "palantir/blueprint",
      "segmentio/evergreen",
      "react-toolbox/react-toolbox",
      "OfficeDev/office-ui-fabric-react",
      "grommet/grommet",
      "JetBrains/ring-ui",
    ],
  },
  {
    id: "vue-ui",
    name: "Vue UI",
    type: StackType.Frontend,
    repos: [
      "ElemeFE/element",
      "ElemeFE/mint-ui",
      "PanJiaChen/vue-element-admin",
      "youzan/vant",
      "buefy/buefy",
      "vuetifyjs/vuetify",
      "vueComponent/ant-design-vue",
      "iview/iview",
    ],
  },
  {
    id: "angular-ui",
    name: "Angular UI",
    type: StackType.Frontend,
    repos: ["ionic-team/ionic", "primefaces/primeng", "akveo/nebular", "NG-ZORRO/ng-zorro-antd", "angular/components"],
  },
  {
    id: "non-dependent-ui",
    name: "Non-dependent UI",
    type: StackType.Frontend,
    repos: [
      "Dogfalo/materialize",
      "google/material-design-lite",
      "nostalgic-css/NES.css",
      "jgthms/bulma",
      "tailwindcss/tailwindcss",
      "picturepan2/spectre",
      "primer/css",
      "milligram/milligram",
      "basscss/basscss",
      "foundation/foundation-sites",
    ],
  },
  {
    id: "static-web",
    name: "Static Web",
    nameChinese: "静态网站",
    type: StackType.Frontend,
    repos: [
      "zeit/next.js",
      "nuxt/nuxt.js",
      "jekyll/jekyll",
      "gohugoio/hugo",
      "gatsbyjs/gatsby",
      "hexojs/hexo",
      "vuejs/vuepress",
      "saberland/saber",
      "docpad/docpad",
    ],
  },
  {
    id: "web-chart",
    name: "Web Chart",
    nameChinese: "Web 图表",
    type: StackType.Frontend,
    repos: [
      "antvis/g2",
      "antvis/G6",
      "antvis/f2",
      "frappe/charts",
      "highcharts/highcharts",
      "processing/p5.js",
      "plotly/plotly.js",
      "apache/incubator-echarts",
      "apexcharts/apexcharts.js",
      "chartjs/Chart.js",
      "c3js/c3",
      "cube-js/cube.js",
      "uber/react-vis",
      "hshoff/vx",
      "timqian/chart.xkcd",
    ],
  },
  {
    id: "wechat-mini-app",
    name: "Wechat Mini App",
    nameChinese: "微信小程序",
    type: StackType.Frontend,
    repos: [
      "Meituan-Dianping/mpvue",
      "NervJS/taro",
      "Tencent/omi",
      "didi/chameleon",
      "dcloudio/uni-app",
      "remaxjs/remax",
      "didi/mpx",
    ],
  },
  {
    id: "client-db",
    name: "Client Database",
    nameChinese: "客户端数据库",
    type: StackType.Frontend,
    repos: [
      "louischatriot/nedb",
      "pubkey/rxdb",
      "pouchdb/pouchdb",
      "objectbox/objectbox-java",
      "realm/realm-cocoa",
      "Tencent/wcdb",
      "ccgus/fmdb",
    ],
  },
  {
    id: "web-markdown",
    name: "Web Markdown",
    type: StackType.Frontend,
    repos: ["pandao/editor.md", "nhn/tui.editor", "joemccann/dillinger", "benweet/stackedit"],
  },
]

// console.log(JSON.stringify(Stacks))

export default Stacks

import { createStore } from 'easy-peasy'
import model from './models'
import * as searchService from './services/socode.service'
import * as devdocsService from './services/devdocs.service'
import * as npmsService from './services/npms.service'
import * as historyCacheChinaService from './services/historyCache.qinniu.service'
import * as historyCacheService from './services/historyCache.service'

const historyService = process.env.REACT_APP_REGION === 'china' ? historyCacheChinaService : historyCacheService
// const historyService = historyCacheService

export interface Injections {
  searchService: typeof searchService
  devdocsService: typeof devdocsService
  npmsService: typeof npmsService
  historyService: typeof historyService
}

const store = createStore(model, {
  // 👇 provide injections to our store
  injections: { searchService, devdocsService, npmsService, historyService } as Injections,
})

export default store

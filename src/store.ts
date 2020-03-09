import { createStore, persist } from 'easy-peasy'
import model from './models'
import * as searchService from './services/socode.service'
import * as npmsService from './services/npms.service'
import * as historyCacheChinaService from './services/historyCache.qinniu.service'
import * as historyCacheService from './services/historyCache.service'

const historyService = process.env.REACT_APP_REGION === 'china' ? historyCacheChinaService : historyCacheService

export interface Injections {
  searchService: typeof searchService
  npmsService: typeof npmsService
  historyService: typeof historyService
}

const store = createStore(persist(model), {
  // 👇 provide injections to our store
  injections: { searchService, npmsService, historyService } as Injections,
})

export default store

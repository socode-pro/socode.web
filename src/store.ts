import { createStore, persist } from 'easy-peasy'
import model from './models'
import * as searchService from './services/socode.service'
import * as npmsService from './services/npms.service'
import * as historyCacheQinniuService from './services/historyCache.qinniu.service'
// import * as historyCacheFirebaseService from './services/historyCache.firebase.service'

// const historyService = process.env.REACT_APP_REGION === 'china' ? historyCacheQinniuService : historyCacheFirebaseService
const historyService = historyCacheQinniuService

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

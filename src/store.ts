import { createStore, persist } from 'easy-peasy'
import model from './models'
import * as searchService from './services/socode.service'
import * as npmsService from './services/npms.service'
import * as starsCacheService from './services/stars.cache.service'
// import * as starsCacheFirebaseService from './services/stars.cache.firebase.service'

// const historyService = process.env.REACT_APP_REGION === 'china' ? starsCacheService : starsCacheFirebaseService
const starsService = starsCacheService

export interface Injections {
  searchService: typeof searchService
  npmsService: typeof npmsService
  starsService: typeof starsService
}

const store = createStore(persist(model), {
  // 👇 provide injections to our store
  injections: { searchService, npmsService, starsService } as Injections,
})

export default store

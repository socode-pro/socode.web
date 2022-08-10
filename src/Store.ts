import { createStore, persist, PersistConfig, createTypedHooks } from "easy-peasy"
import model, { StoreModel } from "./models"
import * as searchService from "./services/socode.service"
import * as npmsService from "./services/npms.service"
import * as starsCacheService from "./services/stars.cache.service"
// import * as starsCacheFirebaseService from './services/stars.cache.firebase.service'

export const { useStoreActions, useStoreDispatch, useStoreState } = createTypedHooks<StoreModel>()

// const historyService = process.env.REACT_APP_REGION === 'china' ? starsCacheService : starsCacheFirebaseService
const starsService = starsCacheService

export interface Injections {
  searchService: typeof searchService
  npmsService: typeof npmsService
  starsService: typeof starsService
}

const persistConfig: PersistConfig<typeof model> = {
  deny: ["trending"],
}

const store = createStore(persist(model, persistConfig), {
  injections: { searchService, npmsService, starsService } as Injections,
})

const debugStore = createStore(model, {
  // 👇 provide injections to our store
  injections: { searchService, npmsService, starsService } as Injections,
})

export default process.env.NODE_ENV === "production" ? store : debugStore

import { createStore } from 'easy-peasy'
import model from './models'
import * as searchService from './services/socode.service'

export interface Injections {
  searchService: typeof searchService
}

const store = createStore(model, {
  // 👇 provide injections to our store
  injections: { searchService } as Injections
})

export default store

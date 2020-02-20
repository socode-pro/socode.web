import { createStore } from 'easy-peasy'
import model from './models'
import * as searchService from './services/socode.service'
import * as devdocsService from './services/devdocs.service'

export interface Injections {
  searchService: typeof searchService
  devdocsService: typeof devdocsService
}

const store = createStore(model, {
  // 👇 provide injections to our store
  injections: { searchService, devdocsService } as Injections,
})

export default store

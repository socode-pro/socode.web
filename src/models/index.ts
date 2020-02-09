import searchModel, { SearchModel } from './search'
import storageModel, { StorageModel } from './storage'
import devhintsModel, { DevhintsModel } from './devhints'

export interface StoreModel {
  search: SearchModel
  storage: StorageModel
  devhints: DevhintsModel
}

const storeModel: StoreModel = {
  search: searchModel,
  storage: storageModel,
  devhints: devhintsModel,
}

export default storeModel

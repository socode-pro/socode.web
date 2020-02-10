import searchModel, { SearchModel } from './search'
import storageModel, { StorageModel } from './storage'
import devhintsModel, { DevhintsModel } from './devhints'
import awesomeModel, { AwesomeModel } from './awesome'

export interface StoreModel {
  search: SearchModel
  storage: StorageModel
  devhints: DevhintsModel
  awesome: AwesomeModel
}

const storeModel: StoreModel = {
  search: searchModel,
  storage: storageModel,
  devhints: devhintsModel,
  awesome: awesomeModel,
}

export default storeModel

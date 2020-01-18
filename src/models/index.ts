import searchModel, { SearchModel } from './search'
import storageModel, { StorageModel } from './storage'

export interface StoreModel {
  search: SearchModel
  storage: StorageModel
}

const storeModel: StoreModel = {
  search: searchModel,
  storage: storageModel
};

export default storeModel

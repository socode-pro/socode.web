import searchModel, { SearchModel } from './search'

export interface StoreModel {
  search: SearchModel
}

const storeModel: StoreModel = {
  search: searchModel,
};

export default storeModel

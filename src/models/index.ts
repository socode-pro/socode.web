import searchModel, { SearchModel } from './search'
import storageModel, { StorageModel } from './storage'
import devhintsModel, { DevhintsModel } from './devhints'
import learnxinyModel, { LearnxinyModel } from './learnxiny'
import awesomeModel, { AwesomeModel } from './awesome'

export interface StoreModel {
  search: SearchModel
  storage: StorageModel
  devhints: DevhintsModel
  learnxiny: LearnxinyModel
  awesome: AwesomeModel
}

const storeModel: StoreModel = {
  search: searchModel,
  storage: storageModel,
  devhints: devhintsModel,
  learnxiny: learnxinyModel,
  awesome: awesomeModel,
}

export default storeModel

import searchModel, { SearchModel } from './search'
import storageModel, { StorageModel } from './storage'
import devhintsModel, { DevhintsModel } from './devhints'
import learnxinyModel, { LearnxinyModel } from './learnxiny'
import awesomeModel, { AwesomeModel } from './awesome'
import readmeModel, { ReadmeModel } from './readme'
import devdocsModel, { DevdocsModel } from './devdocs'
import historyModel, { HistoryModel } from './history'
import searchKeysModel, { SearchKeysModel } from './searchkeys'

export interface StoreModel {
  search: SearchModel
  storage: StorageModel
  devhints: DevhintsModel
  learnxiny: LearnxinyModel
  awesome: AwesomeModel
  readme: ReadmeModel
  devdocs: DevdocsModel
  history: HistoryModel
  searchKeys: SearchKeysModel
}

const storeModel: StoreModel = {
  search: searchModel,
  storage: storageModel,
  devhints: devhintsModel,
  learnxiny: learnxinyModel,
  awesome: awesomeModel,
  readme: readmeModel,
  devdocs: devdocsModel,
  history: historyModel,
  searchKeys: searchKeysModel,
}

export default storeModel

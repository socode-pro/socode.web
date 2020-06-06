import searchModel, { SearchModel } from "./search"
import storageModel, { StorageModel } from "./storage"
import profileModel, { ProfileModel } from "./profile"
import devhintsModel, { DevhintsModel } from "./devhints"
import learnxinyModel, { LearnxinyModel } from "./learnxiny"
import awesomeModel, { AwesomeModel } from "./awesome"
import readmeModel, { ReadmeModel } from "./readme"
import devdocsModel, { DevdocsModel } from "./devdocs"
import starsModel, { StarsModel } from "./stars"
import searchKeysModel, { SearchKeysModel } from "./searchkeys"
import trendingModel, { TrendingModel } from "./trending"
import displayModel, { DisplayModel } from "./display"

export interface StoreModel {
  search: SearchModel
  storage: StorageModel
  profile: ProfileModel
  devhints: DevhintsModel
  learnxiny: LearnxinyModel
  awesome: AwesomeModel
  readme: ReadmeModel
  devdocs: DevdocsModel
  stars: StarsModel
  searchKeys: SearchKeysModel
  trending: TrendingModel
  display: DisplayModel
}

const storeModel: StoreModel = {
  search: searchModel,
  storage: storageModel,
  profile: profileModel,
  devhints: devhintsModel,
  learnxiny: learnxinyModel,
  awesome: awesomeModel,
  readme: readmeModel,
  devdocs: devdocsModel,
  stars: starsModel,
  searchKeys: searchKeysModel,
  trending: trendingModel,
  display: displayModel,
}

export default storeModel

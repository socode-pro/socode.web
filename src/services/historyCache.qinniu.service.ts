import ky from 'ky'
import dayjs from 'dayjs'
import qiniu from 'qiniu'
import { Repository, getStarHistory, fetchCurrentStars } from './history.service'

const config = new qiniu.conf.Config({
  zone: qiniu.zone.Zone_z0,
  useHttpsDomain: true,
})

export const getRepoData = async (repoName: string, userToken?: string): Promise<Repository | null> => {
  try {
    const repository = await ky.get(`https://socode.s3-cn-east-1.qiniucs.com/${repoName}`).json<Repository>()
    if (
      dayjs(repository.lastRefreshDate)
        .add(7, 'day')
        .isBefore(dayjs())
    ) {
      return fetchCurrentStars(repository, userToken)
    }
    return repository
  } catch (err) {
    return getStarHistory(repoName, userToken)
  }
}

export const saveRepoToStore = (repo: Repository): void => {
  repo.requiredCacheUpdate = false

  // get uploadToken
  const uploadToken = 'test'
  const formUploader = new qiniu.form_up.FormUploader(config)
  const putExtra = new qiniu.form_up.PutExtra()
  formUploader.put(uploadToken, repo.name, JSON.stringify(repo), putExtra, (err, respBody, respInfo) => {
    if (err) {
      throw err
    }
    if (respInfo.statusCode === 200) {
      console.log(respBody)
    } else {
      console.warn(respInfo.statusCode + respBody)
    }
  })
}

export const removeRepoFromStore = (repo: Repository | undefined): void => {
  if (!repo) return
  repo.requiredCacheUpdate = true

  // delete
}

import ky from 'ky'
import dayjs from 'dayjs'
import { Repository, getStarHistory, fetchCurrentStars } from './history.service'
import * as config from '../config'

const api = ky.extend({
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set('Access-Control-Allow-Origin', '*')
      },
    ],
  },
})

export const getRepoData = async (repoName: string, userToken?: string): Promise<Repository | null> => {
  try {
    const repository = await api.get(`https://os.socode.pro/${repoName.replace('/', '_')}.json`).json<Repository>()
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

export const saveRepoToStore = async (repo: Repository): Promise<void> => {
  repo.requiredCacheUpdate = false

  try {
    await api.post(`${config.nesthost()}/qiniu`, { json: repo })
  } catch (err) {
    console.error('saveRepoToStore:', err)
  }
}

export const removeRepoFromStore = async (repo: Repository | undefined): Promise<void> => {
  if (!repo) return
  repo.requiredCacheUpdate = true

  try {
    const sparams = new URLSearchParams()
    sparams.set('key', `${repo.name.replace('/', '_')}.json`)
    await api.delete(`${config.nesthost()}/qiniu`, { body: sparams })
  } catch (err) {
    console.error('removeRepoFromStore:', err)
  }
}

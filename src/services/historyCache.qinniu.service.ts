import ky from 'ky'
import dayjs from 'dayjs'
import { Repository, getStarHistory, fetchCurrentStars } from './history.service'
import * as config from '../config'

interface HistoryGetParam {
  repo: string
  region?: string
  githubToken?: string
}

export const getRepoData = async ({ repo, region, githubToken }: HistoryGetParam): Promise<Repository | null> => {
  try {
    const repository = await ky.get(`https://${region === 'CN'? 'os': 'os-us'}.socode.pro/${repo.replace('/', '_')}.json`).json<Repository>()
    if (
      dayjs(repository.lastRefreshDate)
        .add(7, 'day')
        .isBefore(dayjs())
    ) {
      return fetchCurrentStars(repository, githubToken)
    }
    return repository
  } catch (err) {
    return getStarHistory(repo, githubToken)
  }
}

export const saveRepoToStore = async (repo: Repository): Promise<void> => {
  repo.requiredCacheUpdate = false

  try {
    await ky.post(`${config.nesthost()}/qiniu`, { json: repo })
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
    await ky.delete(`${config.nesthost()}/qiniu`, { body: sparams })
  } catch (err) {
    console.error('removeRepoFromStore:', err)
  }
}

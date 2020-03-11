import ky from 'ky'
import dayjs from 'dayjs'
import { Repository, getStarHistory, fetchCurrentStars } from './history.service'
import * as config from '../config'

let countryCode = ''
ky.get('https://freegeoip.app/json/').json<{ country_code: string }>().then(j => { countryCode = j.country_code })

export const getRepoData = async (repoName: string, userToken?: string): Promise<Repository | null> => {
  console.log(countryCode)
  try {
    const repository = await ky.get(`https://${countryCode === 'CN'? 'os': 'os-us'}.socode.pro/${repoName.replace('/', '_')}.json`).json<Repository>()
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

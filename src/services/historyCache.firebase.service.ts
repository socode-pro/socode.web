import dayjs from 'dayjs'
import firebase from 'firebase/app'
import 'firebase/database'
import { encode } from 'firebase-encode'
import { Repository, getStarHistory, fetchCurrentStars } from './history.service'

const fbconfig = {
  apiKey: 'AIzaSyBPuZu6gbYL_IxW6UCYusHHrbzxHpsWNSE',
  authDomain: 'github-stars-history.firebaseapp.com',
  databaseURL: 'https://github-stars-history.firebaseio.com',
  projectId: 'github-stars-history',
  storageBucket: 'github-stars-history.appspot.com',
  messagingSenderId: '860963673180',
}
const firebaseApp = firebase.initializeApp(fbconfig)
const fbdb = firebaseApp.database()
const firebaseReposRef = fbdb.ref('repos_v3')

interface HistoryGetParam {
  repo: string
  region?: string
  githubToken?: string
}

export const getRepoData = async ({ repo, region, githubToken }: HistoryGetParam): Promise<Repository | null> => {
  return new Promise<Repository | null>(resolve => {
    firebaseReposRef.child(encode(repo)).on('value', snapshot => {
      const repository = snapshot.val()
      if (!repository) {
        resolve(getStarHistory(repo, githubToken))
      } else if (
        dayjs(repository.lastRefreshDate)
          .add(7, 'day')
          .isBefore(dayjs())
      ) {
        resolve(fetchCurrentStars(repository, githubToken))
      } else {
        resolve(repository)
      }
    })
  }).catch(err => {
    return Promise.reject(err)
  })
}

export const saveRepoToStore = (repo: Repository): void => {
  repo.requiredCacheUpdate = false
  firebaseReposRef.child(encode(repo.name)).set(repo)
}

export const removeRepoFromStore = (repo: Repository | undefined): void => {
  if (!repo) return
  repo.requiredCacheUpdate = true
  firebaseReposRef.child(encode(repo.name)).remove()
}

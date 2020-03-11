import { Action, action, Computed, computed, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import Stacks, { Stack } from '../utils/historystacks'
import { generateUuid , winSearchParams } from '../utils/assist'
import { Injections } from '../store'
import { StoreModel } from './index'
import { Repository } from '../services/history.service'
import { error, warn } from '../utils/toast'
import * as config from '../config'

export interface HistoryModel {
  presetStacks: Array<Stack>
  setPresetStacks: Action<HistoryModel, Array<Stack>>
  initialPresetStacks: Thunk<HistoryModel>

  userStacks: Array<Stack>
  initialUserStacks: Action<HistoryModel>

  addUserStack: Action<HistoryModel, string>
  removeUserStack: Action<HistoryModel, string>
  addStackRepo: Action<HistoryModel, { stackid: string; repo: string }>
  addStackRepoAndData: Thunk<HistoryModel, { stackid: string; repo: string }, Injections>
  removeStackRepo: Action<HistoryModel, { stackid: string; repo: string }>

  allStacks: Computed<HistoryModel, Array<Stack>>

  currentStack: Stack | null
  setCurrentStack: Action<HistoryModel, Stack>
  initialCurrentStack: Action<HistoryModel>

  loading: boolean
  setLoading: Action<HistoryModel, boolean>

  repositorys: Array<Repository>
  clearRepositorys: Action<HistoryModel>
  pushRepository: Action<HistoryModel, Repository>

  selectStack: Thunk<HistoryModel, Stack, Injections, StoreModel>
}

const historyModel: HistoryModel = {
  presetStacks: Stacks,
  setPresetStacks: action((state, payload) => {
    state.presetStacks = payload
  }),
  initialPresetStacks: thunk(async actions => {
    try {
      const stacks = await ky.get(`${config.keyshost()}/historystacks.json`).json<Array<Stack>>()
      if (stacks !== null) {
        actions.setPresetStacks(stacks)
      }
    } catch (err) {
      console.error(err)
    }
  }),

  userStacks: [],
  initialUserStacks: action(state => {
    const userstacks = localStorage.getItem('userstacks')
    if (userstacks) {
      state.userStacks = JSON.parse(userstacks)
    }
  }),

  addUserStack: action((state, name) => {
    const stack: Stack = {
      id: generateUuid(),
      name,
      repos: [],
    }
    state.userStacks.push(stack)
    localStorage.setItem('userstacks', JSON.stringify(state.userStacks))
  }),
  removeUserStack: action((state, id) => {
    state.userStacks = state.userStacks.filter(s => s.id !== id)
    localStorage.setItem('userstacks', JSON.stringify(state.userStacks))
  }),

  addStackRepo: action((state, { stackid, repo }) => {
    const stack = state.userStacks.find(s => s.id === stackid)
    if (stack && !stack.repos.includes(repo)) stack.repos.push(repo)
    localStorage.setItem('userstacks', JSON.stringify(state.userStacks))
  }),
  addStackRepoAndData: thunk(async (actions, payload, { injections }) => {
    actions.addStackRepo(payload)
    actions.setLoading(true)
    try {
      const data = await injections.historyService.getRepoData(payload.repo)
      if (data) {
        actions.pushRepository(data)
        if (data.requiredCacheUpdate) {
          injections.historyService.saveRepoToStore(data)
        }
      }
    } catch (err) {
      if (err.message.startsWith('Unfortunately')) {
        warn(err.message)
      } else {
        error(err.message)
      }
    }
    actions.setLoading(false)
  }),
  removeStackRepo: action((state, { stackid, repo }) => {
    const stack = state.userStacks.find(s => s.id === stackid)
    if (!stack) return
    stack.repos = stack.repos.filter(r => r !== repo)
    localStorage.setItem('userstacks', JSON.stringify(state.userStacks))

    if (state.currentStack?.id === stack.id) {
      // removeRepoFromStore(state.repositorys.find(r => r.name === repo))
      state.repositorys = state.repositorys.filter(r => r.name !== repo)
    }
  }),

  allStacks: computed(state => state.presetStacks.concat(state.userStacks)),

  currentStack: null,
  setCurrentStack: action((state, stack) => {
    state.currentStack = stack
  }),
  initialCurrentStack: action(state => {
    const searchParams = new URLSearchParams(window.location.search)
    const stackid = searchParams.get('stack')
    state.currentStack = state.allStacks.find(s => s.id === stackid) || null
  }),

  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  repositorys: [],
  clearRepositorys: action(state => {
    state.repositorys = []
  }),
  pushRepository: action((state, payload) => {
    state.repositorys.push(payload)
  }),

  selectStack: thunk(async (actions, stack, { injections, getStoreState }) => {
    actions.setCurrentStack(stack)
    actions.clearRepositorys()
    actions.setLoading(true)
    const userToken = getStoreState().storage.values.githubToken
    winSearchParams({ stack: stack.id })

    await Promise.all(
      stack.repos.map(async name => {
        try {
          const data = await injections.historyService.getRepoData(name, userToken)
          if (data) {
            actions.pushRepository(data)
            if (data.requiredCacheUpdate) {
              injections.historyService.saveRepoToStore(data)
            }
          }
        } catch (err) {
          if (err.message.startsWith('Unfortunately')) {
            warn(err.message)
          } else {
            error(err.message)
          }
        }
      })
    )

    actions.setLoading(false)
  }),
}

export default historyModel

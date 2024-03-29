import { Action, action, Computed, computed, Thunk, thunk, ActionOn, actionOn } from "easy-peasy"
import ky, { HTTPError } from "ky"
import Stacks, { Stack, StackType } from "../utils/historystacks"
import { setupPathParams } from "../utils/pathParam"
import { generateUuid } from "../utils/keygen"
import { Injections } from "../Store"
import { StoreModel } from "./index"
import { Repository } from "../services/stars.service"
import { error, warn } from "../utils/toast"

export enum DisplayType {
  Backend,
  Frontend,
  Private,
  Hidden,
}

export interface StarsModel {
  displayType: DisplayType
  setDisplayType: Action<StarsModel, DisplayType>

  presetStacks: Array<Stack>
  setPresetStacks: Action<StarsModel, Array<Stack>>
  initialPresetStacks: Thunk<StarsModel>

  displayStacks: Computed<StarsModel, Array<Stack>>
  backStacks: Computed<StarsModel, Array<Stack>>
  frontStacks: Computed<StarsModel, Array<Stack>>

  hiddenStacks: Computed<StarsModel, Array<Stack>>
  addHiddenStack: Action<StarsModel, string>
  removeHiddenStack: Action<StarsModel, string>

  privateStacks: Array<Stack>
  addPrivateStack: Action<StarsModel, { name: string; repos?: string[] }>
  removePrivateStack: Action<StarsModel, string>
  addPrivateStackRepo: Action<StarsModel, { stackid: string; repo: string }>
  addPrivateStackRepoAndData: Thunk<StarsModel, { stackid: string; repo: string }, Injections, StoreModel>
  removePrivateStackRepo: Action<StarsModel, { stackid: string; repo: string }>
  onPrivateStack: ActionOn<StarsModel>

  currentStack: Stack | null
  setCurrentStack: Action<StarsModel, Stack>
  initialCurrentStack: Thunk<StarsModel, void, void, StoreModel>

  loading: boolean
  setLoading: Action<StarsModel, boolean>

  repositorys: Array<Repository>
  clearRepositorys: Action<StarsModel>
  pushRepository: Action<StarsModel, Repository>

  selectStack: Thunk<StarsModel, Stack, Injections, StoreModel>
}

const defaultPresetStacks = (): Array<Stack> => {
  const hiddenStacks = JSON.parse(localStorage.getItem("hidden_stacks") || "[]")
  Stacks.forEach((s) => {
    s.hidden = hiddenStacks.includes(s.id)
  })
  return Stacks
}

const starsModel: StarsModel = {
  displayType: JSON.parse(localStorage.getItem("displayType") || "0"),
  setDisplayType: action((state, payload) => {
    state.displayType = payload
    localStorage.setItem("displayType", payload.toString())
  }),

  presetStacks: defaultPresetStacks(),
  setPresetStacks: action((state, payload) => {
    state.presetStacks = payload
  }),
  initialPresetStacks: thunk(async (actions) => {
    try {
      const stacks = await ky.get(`${process.env.REACT_APP_KEYS_HOST}/historystacks.json`).json<Array<Stack>>()
      if (stacks !== null) {
        const hiddenStacks = JSON.parse(localStorage.getItem("hidden_stacks") || "[]")
        stacks.forEach((s) => {
          s.hidden = hiddenStacks.includes(s.id)
        })
        actions.setPresetStacks(stacks)
      }
    } catch (err) {
      console.error(err)
    }
  }),

  displayStacks: computed((state) => state.presetStacks.filter((s) => !s.hidden).concat(state.privateStacks)),
  backStacks: computed((state) => state.displayStacks.filter((s) => s.type === StackType.Backend)),
  frontStacks: computed((state) => state.displayStacks.filter((s) => s.type === StackType.Frontend)),

  hiddenStacks: computed((state) => state.presetStacks.filter((s) => s.hidden)),
  addHiddenStack: action((state, name) => {
    const stack = state.presetStacks.find((s) => s.id === name)
    if (!stack) return
    stack.hidden = true

    const hiddenStacks = JSON.parse(localStorage.getItem("hidden_stacks") || "[]")
    if (!hiddenStacks.includes(name)) {
      hiddenStacks.push(name)
      localStorage.setItem("hidden_stacks", JSON.stringify(hiddenStacks))
    }
  }),
  removeHiddenStack: action((state, name) => {
    const stack = state.presetStacks.find((s) => s.id === name)
    if (!stack) return
    stack.hidden = false

    let hiddenStacks = JSON.parse(localStorage.getItem("hidden_stacks") || "[]")
    if (hiddenStacks.includes(name)) {
      hiddenStacks = hiddenStacks.filter((e) => e !== name)
      localStorage.setItem("hidden_stacks", JSON.stringify(hiddenStacks))
    }
  }),

  privateStacks: JSON.parse(localStorage.getItem("private_stacks") || "[]"),
  addPrivateStack: action((state, { name, repos = [] }) => {
    const stack: Stack = {
      id: generateUuid(),
      name,
      repos,
      type: StackType.Private,
    }
    state.privateStacks.push(stack)
  }),
  removePrivateStack: action((state, id) => {
    state.privateStacks = state.privateStacks.filter((s) => s.id !== id)
  }),

  addPrivateStackRepo: action((state, { stackid, repo }) => {
    const stack = state.privateStacks.find((s) => s.id === stackid)
    if (stack && !stack.repos.includes(repo)) {
      stack.repos.push(repo)
      setupPathParams({ stack: stackid, repos: stack.repos.toString() })
    }
  }),
  addPrivateStackRepoAndData: thunk(async (actions, { stackid, repo }, { injections, getStoreState }) => {
    actions.addPrivateStackRepo({ stackid, repo })
    actions.setLoading(true)
    const { region } = getStoreState().storage
    const { profile } = getStoreState().profile
    try {
      const data = await injections.starsService.getRepoData({
        repo,
        country: region.country_code,
        token: profile?.githubToken,
      })
      if (data) {
        actions.pushRepository(data)
        if (data.requiredCacheUpdate) {
          injections.starsService.saveRepoToStore(data)
        }
      }
    } catch (err) {
      if ((err as HTTPError).message.startsWith("Unfortunately")) {
        warn((err as HTTPError).message)
      } else {
        error((err as HTTPError).message)
      }
    }
    actions.setLoading(false)
  }),
  removePrivateStackRepo: action((state, { stackid, repo }) => {
    const stack = state.privateStacks.find((s) => s.id === stackid)
    if (!stack) return
    stack.repos = stack.repos.filter((r) => r !== repo)
    setupPathParams({ stack: stackid, repos: stack.repos.toString() })

    if (state.currentStack?.id === stack.id) {
      // removeRepoFromStore(state.repositorys.find(r => r.name === repo))
      state.repositorys = state.repositorys.filter((r) => r.name !== repo)
    }
  }),
  onPrivateStack: actionOn(
    (actions, storeActions) => [
      actions.addPrivateStack,
      actions.removePrivateStack,
      actions.addPrivateStackRepo,
      actions.removePrivateStackRepo,
    ],
    (state, target) => {
      localStorage.setItem("private_stacks", JSON.stringify(state.privateStacks))
    }
  ),

  currentStack: null,
  setCurrentStack: action((state, stack) => {
    state.currentStack = stack
  }),
  initialCurrentStack: thunk(async (actions, payload, { getState }) => {
    const searchParams = new URLSearchParams(window.location.search)
    const stackid = searchParams.get("stack")
    let stack = getState().displayStacks.find((s) => s.id === stackid)
    if (stack) {
      actions.setDisplayType(stack.type as unknown as DisplayType)
      actions.selectStack(stack)
    } else {
      const repos = (searchParams.get("repos") || "").split(",")
      if (repos.length && repos[0]) {
        actions.setDisplayType(DisplayType.Private)
        actions.addPrivateStack({ name: "querystring", repos })
        stack = getState().privateStacks.find((s) => s.name === "querystring")
        if (stack) {
          actions.selectStack(stack)
        }
      }
    }
  }),

  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  repositorys: [],
  clearRepositorys: action((state) => {
    state.repositorys = []
  }),
  pushRepository: action((state, payload) => {
    state.repositorys.push(payload)
  }),

  selectStack: thunk(async (actions, stack, { injections, getStoreState }) => {
    actions.setCurrentStack(stack)
    actions.clearRepositorys()
    actions.setLoading(true)
    const { region } = getStoreState().storage
    const { profile } = getStoreState().profile

    if (stack.type === StackType.Private) {
      setupPathParams({ key: "github_stars", stack: stack.id, repos: stack.repos.toString() })
    } else {
      setupPathParams({ key: "github_stars", stack: stack.id, repos: "" })
    }

    await Promise.all(
      stack.repos.map(async (repo) => {
        try {
          const data = await injections.starsService.getRepoData({
            repo,
            country: region.country_code,
            token: profile?.githubToken,
          })
          if (data) {
            actions.pushRepository(data)
            if (data.requiredCacheUpdate) {
              injections.starsService.saveRepoToStore(data)
            }
          }
        } catch (err) {
          if ((err as HTTPError).message.startsWith("Unfortunately")) {
            warn((err as HTTPError).message)
          } else {
            error((err as HTTPError).message)
          }
        }
      })
    )

    actions.setLoading(false)
  }),
}

export default starsModel

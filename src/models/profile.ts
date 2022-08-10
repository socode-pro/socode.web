import { Action, action, Thunk, thunk } from "easy-peasy"
import ky, { HTTPError } from "ky"
import { InterfaceLanguage } from "../utils/language"

const { location, history } = window

export enum DarkMode {
  Light,
  FlowSystem,
  Dark,
}

export interface Settings {
  language?: InterfaceLanguage
  useOriginUrl?: boolean
  openNewPage?: boolean
  displayTrending?: boolean
  darkMode?: DarkMode
  addressBarKeys?: Array<string>
}

export enum UserRole {
  Admin = "admin",
  Collaborator = "collaborator",
  User = "user",
}

export interface Profile {
  id: number
  username: string
  email?: string
  displayName?: string
  githubToken?: string
  googleToken?: string
  avatar?: string
  role: UserRole
  invitationCode: string
  invitationCount: number
  settings?: Settings // In order to transfer data, not to be state
}

export interface ProfileModel {
  jwt: string | null
  setJwt: Action<ProfileModel, { jwt: string | null; storage?: boolean }>

  settings: Settings
  setSettings: Action<ProfileModel, { settings: Settings; storage?: boolean; post?: boolean }>

  profile: Profile | null
  setProfile: Action<ProfileModel, { profile: Profile | null; storage?: boolean }>

  logout: Thunk<ProfileModel>
  loadProfile: Thunk<ProfileModel>
  injectParams: Thunk<ProfileModel>
  postInvited: Thunk<ProfileModel>
}

const profileModel: ProfileModel = {
  settings: {
    language: navigator.language.startsWith(InterfaceLanguage.中文)
      ? InterfaceLanguage.中文
      : InterfaceLanguage.English,
    useOriginUrl: false,
    openNewPage: true,
    displayTrending: true,
    darkMode: DarkMode.Light,
    addressBarKeys: ["css", "javascript"],
  },
  setSettings: action((state, { settings, storage = true, post = true }) => {
    state.settings = { ...state.settings, ...settings }

    if (storage) {
      localStorage.setItem("settings", JSON.stringify(state.settings))
    }

    if (post && state.jwt) {
      ky.post(`${process.env.REACT_APP_NEST}/users/settings`, {
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        json: state.settings,
      })
    }
  }),

  jwt: localStorage.getItem("jwt") || null,
  setJwt: action((state, { jwt, storage = true }) => {
    state.jwt = jwt
    if (storage) {
      localStorage.setItem("jwt", jwt || "")
    }
  }),

  profile: null,
  setProfile: action((state, { profile, storage = true }) => {
    state.profile = profile
    if (storage) {
      localStorage.setItem("profile", JSON.stringify(state.profile))
    }
  }),

  logout: thunk(async (actions) => {
    actions.setProfile({ profile: null })
    actions.setJwt({ jwt: null })
  }),

  loadProfile: thunk(async (actions, payload, { getState }) => {
    const localSettings = localStorage.getItem("settings")
    if (localSettings) {
      actions.setSettings({
        settings: JSON.parse(localSettings),
        storage: false,
        post: false,
      })
    }

    const localJwt = localStorage.getItem("jwt")
    if (localJwt) {
      actions.setJwt({ jwt: localJwt, storage: false })
    }

    // 第一屏不显示Profile的话可以移除
    // const localProfiles = localStorage.getItem("profile")
    // if (localProfiles) {
    //   actions.setProfile({ profile: JSON.parse(localProfiles), storage: false })
    // }

    try {
      const { jwt } = getState()
      if (!jwt) {
        actions.logout()
        return
      }

      const data = await ky
        .get(`${process.env.REACT_APP_NEST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .json<Profile>()

      const { settings, ...profile } = data
      actions.setProfile({ profile })

      if (settings) {
        actions.setSettings({ settings, post: false })
      } else if (localSettings) {
        // post to nest
        actions.setSettings({ settings: JSON.parse(localSettings), storage: false })
      }
    } catch (err) {
      console.error((err as HTTPError).message)
      actions.logout()
    }
  }),

  injectParams: thunk(async (actions) => {
    const params = new URLSearchParams(window.location.search)

    if (params.has("invitationCode")) {
      const code = params.get("invitationCode")
      if (code) {
        localStorage.setItem("invitationCode", code)
      }
    }

    if (params.has("jwt")) {
      const jwt = params.get("jwt")
      params.delete("jwt")
      if (jwt) {
        actions.setJwt({ jwt })
        await actions.loadProfile()
        await actions.postInvited()
      }
      history.pushState(null, "", `${location.pathname}?${params.toString()}`)
    }
  }),

  postInvited: thunk(async (actions, payload, { getState }) => {
    const code = localStorage.getItem("invitationCode")
    if (!code) return
    const { jwt } = getState()
    if (!jwt) return

    const pparams = new URLSearchParams()
    pparams.set("invitationCode", code)
    try {
      await ky.post(`${process.env.REACT_APP_NEST}/users/invited`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        body: pparams,
      })
      localStorage.removeItem("invitationCode")
    } catch (err) {
      console.error(err)
    }
  }),
}

export default profileModel

import { Action, action, Thunk, thunk } from "easy-peasy"
import ky from "ky"
import { InterfaceLanguage } from "../utils/language"

const { location, history } = window

export enum DarkMode {
  Light,
  FlowSystem,
  Dark,
}

export interface Settings {
  language?: InterfaceLanguage
  openNewTab?: boolean
  displayTrending?: boolean
  darkMode?: DarkMode
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
  setJwt: Action<ProfileModel, string | null>

  settings: Settings
  setSettings: Action<ProfileModel, Settings>

  profile: Profile | null
  setProfile: Action<ProfileModel, Profile | null>

  logout: Thunk<ProfileModel>
  loadProfile: Thunk<ProfileModel>
  injectParams: Thunk<ProfileModel>
  judgeInvited: Thunk<ProfileModel>
}

const profileModel: ProfileModel = {
  jwt: localStorage.getItem("jwt") || null,
  setJwt: action((state, payload) => {
    state.jwt = payload
    localStorage.setItem("jwt", payload || "")
  }),

  settings: {
    language: navigator.language.startsWith(InterfaceLanguage.中文)
      ? InterfaceLanguage.中文
      : InterfaceLanguage.English,
    openNewTab: true,
    displayTrending: true,
    darkMode: DarkMode.Light,
  },
  setSettings: action((state, payload) => {
    state.settings = { ...state.settings, ...payload }
    localStorage.setItem("settings", JSON.stringify(state.settings))

    if (state.jwt) {
      ky.post(`${process.env.REACT_APP_NEST}/users/settings`, {
        headers: {
          Authorization: `Bearer ${state.jwt}`,
        },
        json: state.settings,
      })
    }
  }),

  profile: null,
  setProfile: action((state, payload) => {
    state.profile = payload
  }),

  logout: thunk(async (actions) => {
    actions.setProfile(null)
    actions.setJwt(null)
  }),

  loadProfile: thunk(async (actions, payload, { getState }) => {
    const localSettings = localStorage.getItem("settings")
    try {
      const { jwt } = getState()
      if (!jwt) throw new Error("jwt null")

      const data = await ky
        .get(`${process.env.REACT_APP_NEST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .json<Profile>()

      const { settings, ...profile } = data
      actions.setProfile(profile)

      if (localSettings) {
        actions.setSettings(JSON.parse(localSettings))
      } else if (settings) {
        actions.setSettings(settings)
      }
    } catch (err) {
      console.warn(err)
      actions.logout()
      if (localSettings) {
        actions.setSettings(JSON.parse(localSettings))
      }
    }
  }),

  injectParams: thunk(async (actions) => {
    // const info2: Profile = {
    //   id: 11,
    //   role: UserRole.User,
    //   username: "zicjin@gmail.com",
    //   email: "zicjin@gmail.com",
    //   displayName: "Cheney Jin",
    //   avatar: "https://avatars2.githubusercontent.com/u/199482",
    //   // githubToken: "***REMOVED***",
    //   googleToken: "***REMOVED***",
    //   invitationCode: "zxcasdsa",
    //   invitationCount: 0,
    //   jwt: "zxfdsfdf",
    // }
    // actions.setProfile(info2)

    const params = new URLSearchParams(window.location.search)

    if (params.has("jwt")) {
      const jwt = params.get("jwt")
      if (jwt) {
        actions.setJwt(jwt)
        await actions.loadProfile()
        await actions.judgeInvited()
      }
      params.delete("jwt")
      history.pushState(null, "", `${location.pathname}?${params.toString()}`)
    }

    if (params.has("invitationCode")) {
      const code = params.get("invitationCode")
      if (code) {
        localStorage.setItem("invitationCode", code)
      }
    }
  }),

  judgeInvited: thunk(async (actions, payload, { getState }) => {
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

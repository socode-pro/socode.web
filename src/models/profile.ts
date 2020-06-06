import { Action, action, Thunk, thunk } from "easy-peasy"
import ky from "ky"

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
  jwt: string
}

export interface ProfileModel {
  profile: Profile | null
  setProfile: Action<ProfileModel, Profile | null>

  loadProfile: Thunk<ProfileModel, string>
  injectParams: Thunk<ProfileModel>
  judgeInvited: Thunk<ProfileModel>
}

const profileModel: ProfileModel = {
  profile: JSON.parse(localStorage.getItem("profile") || "null"),
  setProfile: action((state, payload) => {
    state.profile = payload
    localStorage.setItem("profile", JSON.stringify(payload))
  }),

  loadProfile: thunk(async (actions, jwt) => {
    try {
      const profile = await ky
        .get(`${process.env.REACT_APP_NEST}/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .json<Profile>()
      actions.setProfile({ ...profile, jwt })
    } catch (err) {
      console.error(err)
      actions.setProfile(null)
      // when jwt fail, setProfile(null)
    }
  }),

  injectParams: thunk(async (actions) => {
    const params = new URLSearchParams(window.location.search)

    if (params.has("jwt")) {
      const jwt = params.get("jwt") || ""
      if (jwt) {
        await actions.loadProfile(jwt)
        await actions.judgeInvited()
      }
      params.delete("jwt")
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
    const jwt = getState().profile?.jwt
    if (!jwt) {
      console.error("jwt null")
      return
    }

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

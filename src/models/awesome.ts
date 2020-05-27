import { Action, action, Thunk, thunk } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"

export interface AwesomeModel {
  loading: boolean
  setLoading: Action<AwesomeModel, boolean>

  markdown: string
  setMarkdown: Action<AwesomeModel, string>
  // setMarkdownStorage: Action<AwesomeModel, { name: string; markdown: string }>
  getMarkdown: Thunk<AwesomeModel, { name: string; awesome: string }>
}

const awesomeModel: AwesomeModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  markdown: "",
  setMarkdown: action((state, payload) => {
    state.markdown = payload
  }),
  // setMarkdownStorage: action((state, payload) => {
  //   try {
  //     localStorage.setItem(`awesome_${payload.name}`, payload.markdown)
  //     state.markdown = payload.markdown
  //     localStorage.setItem(`awesome_${payload.name}_time`, dayjs().toJSON())
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }),
  getMarkdown: thunk(async (actions, payload) => {
    const path = payload.awesome + (payload.awesome.split("/").length <= 2 ? "/master" : "")
    actions.setLoading(true)
    try {
      // const time = localStorage.getItem(`awesome_${payload.name}_time`)
      // if (
      //   time &&
      //   dayjs(time)
      //     .add(1, 'day')
      //     .isAfter(dayjs())
      // ) {
      //   const markdown = localStorage.getItem(`awesome_${payload.name}`)
      //   if (markdown) {
      //     actions.setMarkdown(markdown || '')
      //     actions.setLoading(false)
      //     return
      //   }
      // }

      // const markdown = await ky.get(`https://raw.githubusercontent.com/${path}/README.md`).text()
      const markdown = await ky.get(`https://githubraw.socode.pro/${path}/README.md`).text()
      // await actions.setMarkdownStorage({ name: payload.name, markdown })
      await actions.setMarkdown(markdown)
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const markdown = await ky.get(`https://githubraw.socode.pro/${path}/readme.md`).text()
          // await actions.setMarkdownStorage({ name: payload.name, markdown })
          await actions.setMarkdown(markdown)
        } catch (e) {
          console.error("AwesomeModel.getMarkdown.retry", e)
        }
      } else {
        console.warn("AwesomeModel.getMarkdown", err)
      }
    }
    actions.setLoading(false)
  }),
}

export default awesomeModel

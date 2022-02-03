import { Action, action, Thunk, thunk } from "easy-peasy"
import ky from "ky"
import dayjs from "dayjs"
import { StoreModel } from "./index"

export interface ReadmeModel {
  loading: boolean
  setLoading: Action<ReadmeModel, boolean>

  markdown: string
  setMarkdown: Action<ReadmeModel, { name: string; readme: string; storage?: boolean }>
  getMarkdown: Thunk<ReadmeModel, { base: string; path: string }, void, StoreModel>
}

const readmeModel: ReadmeModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  markdown: "",
  setMarkdown: action((state, { name, readme, storage }) => {
    state.markdown = readme
    if (storage) {
      localStorage.setItem(`readme_${name}`, readme)
      localStorage.setItem(`readme_${name}_time`, dayjs().toJSON())
    }
  }),
  getMarkdown: thunk(async (actions, { base, path }, { getStoreState }) => {
    if (!path) return

    const insideFirewall = getStoreState().storage.insideFirewall
    const domain = insideFirewall ? `${process.env.REACT_APP_NEST}/firewall` : "https://raw.githubusercontent.com"

    actions.setLoading(true)
    const name = base + path
    try {
      // const time = localStorage.getItem(`readme_${name}_time`)
      // if (
      //   time &&
      //   dayjs(time)
      //     .add(1, 'day')
      //     .isAfter(dayjs())
      // ) {
      //   const markdown = localStorage.getItem(`readme_${name}`)
      //   if (markdown) {
      //     actions.setMarkdown({ name, readme: markdown || '' })
      //     actions.setLoading(false)
      //     return
      //   }
      // }

      const markdown = await ky.get(`${domain}/${base}/master${path}`).text()
      actions.setMarkdown({ name, readme: markdown || "", storage: true })
    } catch (err) {
      console.warn("ReadmeModel.getMarkdown", err)
    }
    actions.setLoading(false)
  }),
}

export default readmeModel

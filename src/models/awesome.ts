import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'

export interface AwesomeModel {
  markdown: string
  setMarkdown: Action<AwesomeModel, { name: string; markdown: string }>
  getMarkdown: Thunk<AwesomeModel, { name: string; awesome: string }>
}

const awesomeModel: AwesomeModel = {
  markdown: '',
  setMarkdown: action((state, payload) => {
    try {
      localStorage.setItem(`markdown_${payload.name}`, payload.markdown)
      localStorage.setItem(`markdown_${payload.name}_time`, dayjs().toJSON())
      state.markdown = payload.markdown
    } catch (err) {
      console.error(err)
    }
  }),
  getMarkdown: thunk(async (actions, payload) => {
    try {
      const time = localStorage.getItem(`markdown_${payload.name}_time`)
      if (
        time &&
        dayjs(time)
          .add(1, 'day')
          .isAfter(dayjs())
      ) {
        const markdown = localStorage.getItem(`markdown_${payload.name}`)
        if (markdown) {
          actions.setMarkdown({ name: payload.name, markdown: markdown || '' })
          return
        }
      }

      const resp = await axios.get(`https://raw.githubusercontent.com/${payload.awesome}/master/readme.md`)
      actions.setMarkdown({ name: payload.name, markdown: resp.data })
    } catch (err) {
      if (err.isAxiosError) {
        const e: AxiosError = err
        if (e.response?.status === 404) {
          try {
            const resp = await axios.get(`https://raw.githubusercontent.com/${payload.awesome}/master/README.md`)
            actions.setMarkdown({ name: payload.name, markdown: resp.data })
          } catch (e) {
            console.error(`retry:${e}`)
          }
        }
      } else {
        console.error(err)
      }
    }
  }),
}

export default awesomeModel

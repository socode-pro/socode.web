import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

export interface AwesomeModel {
  markdown: string
  setMarkdown: Action<AwesomeModel, { name: string; markdown: string; setTime?: boolean }>
  getMarkdown: Thunk<AwesomeModel, { name: string; awesome: string }>
}

const awesomeModel: AwesomeModel = {
  markdown: '',
  setMarkdown: action((state, payload) => {
    try {
      localStorage.setItem(`markdown_${payload.name}`, payload.markdown)
      state.markdown = payload.markdown
      if (payload.setTime) {
        localStorage.setItem(`markdown_${payload.name}_time`, dayjs().toJSON())
      }
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

      const markdown = await ky.get(`https://raw.githubusercontent.com/${payload.awesome}/master/readme.md`).text()
      actions.setMarkdown({ name: payload.name, markdown, setTime: true })
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const markdown = await ky.get(`https://raw.githubusercontent.com/${payload.awesome}/master/README.md`).text()
          actions.setMarkdown({ name: payload.name, markdown, setTime: true })
        } catch (e) {
          console.error('AwesomeModel.getMarkdown.retry', e)
        }
      } else {
        console.warn('AwesomeModel.getMarkdown', err)
      }
    }
  }),
}

export default awesomeModel

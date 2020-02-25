import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

export interface AwesomeModel {
  markdown: string
  setMarkdown: Action<AwesomeModel, string>
  setMarkdownStorage: Action<AwesomeModel, { name: string; markdown: string }>
  getMarkdown: Thunk<AwesomeModel, { name: string; awesome: string }>
}

const awesomeModel: AwesomeModel = {
  markdown: '',
  setMarkdown: action((state, payload) => {
    state.markdown = payload
  }),
  setMarkdownStorage: action((state, payload) => {
    try {
      localStorage.setItem(`awesome_${payload.name}`, payload.markdown)
      state.markdown = payload.markdown
      localStorage.setItem(`awesome_${payload.name}_time`, dayjs().toJSON())
    } catch (err) {
      console.error(err)
    }
  }),
  getMarkdown: thunk(async (actions, payload) => {
    try {
      const time = localStorage.getItem(`awesome_${payload.name}_time`)
      if (
        time &&
        dayjs(time)
          .add(1, 'day')
          .isAfter(dayjs())
      ) {
        const markdown = localStorage.getItem(`awesome_${payload.name}`)
        if (markdown) {
          actions.setMarkdown(markdown || '')
          return
        }
      }

      const markdown = await ky.get(`https://raw.githubusercontent.com/${payload.awesome}/master/readme.md`).text()
      await actions.setMarkdownStorage({ name: payload.name, markdown })
    } catch (err) {
      if (err.response?.status === 404) {
        try {
          const markdown = await ky.get(`https://raw.githubusercontent.com/${payload.awesome}/master/README.md`).text()
          await actions.setMarkdownStorage({ name: payload.name, markdown })
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

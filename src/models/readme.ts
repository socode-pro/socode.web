import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

export interface ReadmeModel {
  markdown: string
  setMarkdown: Action<ReadmeModel, string>
  setMarkdownStorage: Action<ReadmeModel, { name: string; readme: string }>
  getMarkdown: Thunk<ReadmeModel, { base: string; path: string }>
}

const readmeModel: ReadmeModel = {
  markdown: '',
  setMarkdown: action((state, payload) => {
    state.markdown = payload
  }),
  setMarkdownStorage: action((state, { name, readme }) => {
    try {
      localStorage.setItem(`readme_${name}`, readme)
      state.markdown = readme
      localStorage.setItem(`readme_${name}_time`, dayjs().toJSON())
    } catch (err) {
      console.error(err)
    }
  }),
  getMarkdown: thunk(async (actions, { base, path }) => {
    if (!path) return
    const name = base + path
    try {
      const time = localStorage.getItem(`readme_${name}_time`)
      if (
        time &&
        dayjs(time)
          .add(1, 'day')
          .isAfter(dayjs())
      ) {
        const markdown = localStorage.getItem(`readme_${name}`)
        if (markdown) {
          actions.setMarkdown(markdown || '')
          return
        }
      }

      const markdown = await ky.get(`https://raw.githubusercontent.com/${base}/master${path}`).text()
      actions.setMarkdownStorage({ name, readme: markdown })
    } catch (err) {
      console.warn('ReadmeModel.getMarkdown', err)
    }
  }),
}

export default readmeModel
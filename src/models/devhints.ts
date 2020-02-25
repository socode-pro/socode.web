import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

export interface DevhintsModel {
  loading: boolean
  setLoading: Action<DevhintsModel, boolean>
  html: string
  setHtml: Action<DevhintsModel, string>
  setHtmlStorage: Action<DevhintsModel, string>
  getHtml: Thunk<DevhintsModel>
}

const devhintsModel: DevhintsModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  html: '',
  setHtml: action((state, html) => {
    state.html = html
  }),
  setHtmlStorage: action((state, html) => {
    try {
      localStorage.setItem('devhintsHtml', html)
      state.html = html
      localStorage.setItem('devhintsTime', dayjs().toJSON())
    } catch (err) {
      console.error(err)
    }
  }),
  getHtml: thunk(async actions => {
    try {
      const time = localStorage.getItem('devhintsTime')
      if (
        time &&
        dayjs(time)
          .add(7, 'day')
          .isAfter(dayjs())
      ) {
        const devhintsHtml = localStorage.getItem('devhintsHtml')
        if (devhintsHtml) {
          actions.setHtml(devhintsHtml || '')
          return
        }
      }

      actions.setLoading(true)
      const html = await ky.get('https://devhints.io/').text()
      await actions.setHtmlStorage(html)
    } catch (err) {
      console.warn('DevhintsModel.getHtml:', err)
    }
    actions.setLoading(false)
  }),
}

export default devhintsModel

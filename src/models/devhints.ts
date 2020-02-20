import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

export interface DevhintsModel {
  loading: boolean
  setLoading: Action<DevhintsModel, boolean>
  html: string
  setHtml: Action<DevhintsModel, { html: string; setTime?: boolean }>
  getHtml: Thunk<DevhintsModel>
}

const devhintsModel: DevhintsModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  html: '',
  setHtml: action((state, payload) => {
    try {
      localStorage.setItem('devhintsHtml', payload.html)
      state.html = payload.html
      if (payload.setTime) {
        localStorage.setItem('devhintsTime', dayjs().toJSON())
      }
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
          actions.setHtml({ html: devhintsHtml || '' })
          return
        }
      }

      actions.setLoading(true)
      const html = await ky.get('https://devhints.io/').text()
      actions.setHtml({ html, setTime: true })
    } catch (err) {
      console.warn('DevhintsModel.getHtml:', err)
    }
    actions.setLoading(false)
  }),
}

export default devhintsModel

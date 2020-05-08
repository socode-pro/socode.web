import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
import dayjs from 'dayjs'

export interface DevhintsModel {
  loading: boolean
  setLoading: Action<DevhintsModel, boolean>
  html: string
  setHtml: Action<DevhintsModel, { html: string; storage?: boolean }>
  getHtml: Thunk<DevhintsModel>
}

const devhintsModel: DevhintsModel = {
  loading: false,
  setLoading: action((state, payload) => {
    state.loading = payload
  }),

  html: '',
  setHtml: action((state, { html, storage }) => {
    state.html = html
    if (storage) {
      localStorage.setItem('devhints_html', html)
      localStorage.setItem('devhints_time', dayjs().toJSON())
    }
  }),
  getHtml: thunk(async (actions) => {
    try {
      const time = localStorage.getItem('devhints_time')
      if (time && dayjs(time).add(7, 'day').isAfter(dayjs())) {
        const devhintsHtml = localStorage.getItem('devhints_html')
        if (devhintsHtml) {
          actions.setHtml({ html: devhintsHtml })
          return
        }
      }

      actions.setLoading(true)
      const html = await ky.get('https://devhints.io/').text()
      await actions.setHtml({ html, storage: true })
    } catch (err) {
      console.warn('DevhintsModel.getHtml:', err)
    }
    actions.setLoading(false)
  }),
}

export default devhintsModel

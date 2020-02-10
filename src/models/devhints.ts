import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'

export interface DevhintsModel {
  html: string
  setHtml: Action<DevhintsModel, string>
  getHtml: Thunk<DevhintsModel>
}

const devhintsModel: DevhintsModel = {
  html: '',
  setHtml: action((state, payload) => {
    try {
      localStorage.setItem('devhintsHtml', payload)
      localStorage.setItem('devhintsTime', dayjs().toJSON())
      state.html = payload
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
      const resp = await axios.get('https://devhints.io/')
      actions.setHtml(resp.data)
    } catch (err) {
      if (err.isAxiosError) {
        const e: AxiosError = err
        console.warn(`status:${e.response?.status} msg:${e.message}`, e)
      } else {
        console.error(err)
      }
    }
  }),
}

export default devhintsModel
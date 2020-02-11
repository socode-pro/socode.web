import { Action, action, Thunk, thunk } from 'easy-peasy'
import axios, { AxiosError } from 'axios'
import dayjs from 'dayjs'

export interface LearnxinyModel {
  html: string
  setHtml: Action<LearnxinyModel, string>
  getHtml: Thunk<LearnxinyModel>
}

const learnxinyModel: LearnxinyModel = {
  html: '',
  setHtml: action((state, payload) => {
    try {
      localStorage.setItem('learnxinyHtml', payload)
      localStorage.setItem('learnxinyTime', dayjs().toJSON())
      state.html = payload
    } catch (err) {
      console.error(err)
    }
  }),
  getHtml: thunk(async actions => {
    try {
      const time = localStorage.getItem('learnxinyTime')
      if (
        time &&
        dayjs(time)
          .add(7, 'day')
          .isAfter(dayjs())
      ) {
        const learnxinyHtml = localStorage.getItem('learnxinyHtml')
        if (learnxinyHtml) {
          actions.setHtml(learnxinyHtml || '')
          return
        }
      }
      const resp = await axios.get('https://learnxinyminutes.com/', {
        headers: {
          Accept: '*/*',
          Host: 'learnxinyminutes.com',
          'Access-Control-Allow-Origin': '*',
        },
      })
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

export default learnxinyModel

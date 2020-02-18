import { Action, action, Thunk, thunk } from 'easy-peasy'
import ky from 'ky'
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
      const data = await ky
        .get('https://learnxinyminutes.com/', {
          hooks: {
            beforeRequest: [
              request => {
                request.headers.set('Accept', '*/*')
              },
            ],
          },
        })
        .text()
      actions.setHtml(data)
    } catch (err) {
      console.warn('learnxinyModel.getHtml:', err)
    }
  }),
}

export default learnxinyModel

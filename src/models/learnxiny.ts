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
    state.html = payload
    localStorage.setItem('learnxiny_time', dayjs().toJSON())
    localStorage.setItem('learnxiny_html', payload)
  }),
  getHtml: thunk(async (actions) => {
    try {
      const time = localStorage.getItem('learnxiny_time')
      if (time && dayjs(time).add(7, 'day').isAfter(dayjs())) {
        const learnxinyHtml = localStorage.getItem('learnxiny_html')
        if (learnxinyHtml) {
          actions.setHtml(learnxinyHtml || '')
          return
        }
      }
      const data = await ky
        .get('https://learnxinyminutes.com/', {
          hooks: {
            beforeRequest: [
              (request) => {
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


import dayjs from 'dayjs'

export const HumanDateParse = (date): string => {
  return dayjs(date).format('M月d日 HH:mm')
}

export const sleep = (ms): Promise<void> => {
  return new Promise(r => setTimeout(r, ms))
}

export const EnumObjects = (enumme): Array<{label: string, value: any}> => {
  return Object.keys(enumme)
    // .filter(value => !Number.isNaN(Number(value)))
    .map(key => ({ label: key, value: enumme[key] }))
}

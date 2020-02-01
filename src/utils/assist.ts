import dayjs from 'dayjs'

export const HumanDateParse = (date): string => {
  return dayjs(date).format('M月d日 HH:mm')
}

export const sleep = (ms): Promise<void> => {
  return new Promise(r => setTimeout(r, ms))
}

export const StringEnumObjects = (enumme): Array<{ label: string; value: any }> => {
  return Object.keys(enumme).map(key => ({ label: key, value: enumme[key] }))
}

export const IntEnumObjects = (enumme): Array<{ label: string; value: any }> => {
  return Object.keys(enumme)
    .filter(value => !Number.isNaN(Number(value)))
    .map(key => ({ label: enumme[key], value: key }))
}

const { location, history } = window

// https://stackoverflow.com/a/41542008
export const winSearchParams = (query: string, keyname: string): void => {
  const searchParams = new URLSearchParams(location.search)
  if (!keyname) {
    searchParams.delete('k')
  } else {
    searchParams.set('k', keyname)
  }
  if (!query) {
    searchParams.delete('q')
  } else {
    searchParams.set('q', query)
  }
  history.pushState(null, '', `${location.pathname}${[...searchParams].length ? `?${searchParams.toString()}` : ''}`)
}

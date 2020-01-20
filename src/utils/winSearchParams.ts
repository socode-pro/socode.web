const { location, history } = window

// https://stackoverflow.com/a/41542008
const winSearchParams = (query: string): void => {
  const searchParams = new URLSearchParams(location.search)
  if (!query) {
    searchParams.delete('q')
  } else {
    searchParams.set('q', query)
  }
  history.pushState(null, '', `${location.pathname}${[...searchParams].length ? `?${searchParams.toString()}` : ''}`)
}

export default winSearchParams

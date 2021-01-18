const { location, history } = window

export const setupLocation = (searchParams: URLSearchParams): void => {
  history.pushState(null, "", `${location.pathname}${[...searchParams].length ? `?${searchParams.toString()}` : ""}`)
}

// https://stackoverflow.com/a/41542008
export const setupPathParams = (params: {
  key?: string
  query?: string
  docspath?: string
  docscode?: string
  stack?: string
  repos?: string
}): void => {
  const searchParams = new URLSearchParams(window.location.search)
  if (params.key !== undefined) {
    if (params.key) {
      searchParams.set("k", params.key)
    } else {
      searchParams.delete("k")
    }
  }
  if (params.query !== undefined) {
    if (params.query) {
      searchParams.set("q", params.query)
    } else {
      searchParams.delete("q")
    }
  }
  if (params.docspath !== undefined) {
    if (params.docspath) {
      searchParams.set("docspath", params.docspath)
    } else {
      searchParams.delete("docspath")
    }
  }
  if (params.docscode !== undefined) {
    if (params.docscode) {
      searchParams.set("docscode", params.docscode)
    } else {
      searchParams.delete("docscode")
    }
  }
  if (params.stack !== undefined) {
    if (params.stack) {
      searchParams.set("stack", params.stack)
    } else {
      searchParams.delete("stack")
    }
  }
  if (params.repos !== undefined) {
    if (params.repos) {
      searchParams.set("repos", params.repos)
    } else {
      searchParams.delete("repos")
    }
  }

  setupLocation(searchParams)
}

export const setPathParam = (
  searchParams: URLSearchParams,
  param: "k" | "q" | "docscode" | "docspath" | "stack" | "repos",
  value: string
): URLSearchParams => {
  searchParams.set(param, value)
  return searchParams
}

export const getPathParam = (param: "k" | "q" | "docscode" | "docspath" | "stack" | "repos"): string | null => {
  const searchParams = new URLSearchParams(location.search)
  return searchParams.get(param)
}

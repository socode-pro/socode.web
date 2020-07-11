import dayjs from "dayjs"

export const HumanDateParse = (date): string => {
  return dayjs(date).format("M月d日 HH:mm")
}

export const sleep = (ms): Promise<void> => {
  return new Promise((r) => setTimeout(r, ms))
}

export const StringEnumObjects = (enumme, prefix?: string): Array<{ label: string; value: string }> => {
  return Object.keys(enumme).map((key, i) => ({ label: i === 0 && prefix ? prefix + key : key, value: enumme[key] }))
}

export const IntEnumObjects = (enumme, prefix?: string): Array<{ label: string; value: number }> => {
  return Object.keys(enumme)
    .filter((value) => !Number.isNaN(Number(value)))
    .map((key, i) => ({ label: i === 0 && prefix ? prefix + enumme[key] : enumme[key], value: parseInt(key, 10) }))
}

const { location, history } = window

// https://stackoverflow.com/a/41542008
export const winSearchParams = (params: {
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

  history.pushState(null, "", `${location.pathname}${[...searchParams].length ? `?${searchParams.toString()}` : ""}`)
}

export const isRelationHref = (href: string): boolean =>
  !href.startsWith("http") && !href.startsWith("/?") && !href.startsWith("#")

export const transRelationHref = (href: string, currentPath: string): string => {
  if (isRelationHref(href)) {
    const currentPaths = currentPath.split("/")
    const relationPaths = href.split("../")
    const relationDeep = relationPaths.length - 1 // '../' 层级
    const targetPath = relationPaths[relationPaths.length - 1].replace("./", "")
    currentPaths[currentPaths.length - 1 - relationDeep] = targetPath // 根据 '../' 在正确的层级赋值 targetPath
    Array.from(Array(relationDeep).keys()).forEach(() => {
      currentPaths.pop() // 弹出多余 Path
    })
    return currentPaths.join("/")
  }
  return href
}

export const isChrome =
  !!(window as any).chrome && (!!(window as any).chrome.webstore || !!(window as any).chrome.runtime)
export const isEdgeChromium = isChrome && navigator.userAgent.indexOf("Edg") !== -1

// https://stackoverflow.com/a/52695341/346701
export const isInStandaloneMode =
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as any).standalone ||
  document.referrer.includes("android-app://")

export const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1

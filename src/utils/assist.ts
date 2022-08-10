import dayjs from "dayjs"

export const HumanDateParse = (date): string => dayjs(date).format("M月d日 HH:mm")

export const sleep = (ms): Promise<void> =>
  new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms)
  })

export const StringEnumObjects = (enumme, prefix?: string): Array<{ label: string; value: string }> =>
  Object.keys(enumme).map((key, i) => ({ label: i === 0 && prefix ? prefix + key : key, value: enumme[key] }))

export const IntEnumObjects = (enumme, prefix?: string): Array<{ label: string; value: number }> =>
  Object.keys(enumme)
    .filter((value) => !Number.isNaN(Number(value)))
    .map((key, i) => ({ label: i === 0 && prefix ? prefix + enumme[key] : enumme[key], value: parseInt(key, 10) }))

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

// https://stackoverflow.com/a/38241481
enum OSPlatform {
  UnKnow,
  MacOS,
  iOS,
  Windows,
  Android,
  Linux,
}

const userAgent = window.navigator.userAgent
const platform = window.navigator.platform
const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"]
const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"]
const iosPlatforms = ["iPhone", "iPad", "iPod"]
let os: OSPlatform = OSPlatform.UnKnow

if (macosPlatforms.indexOf(platform) !== -1) {
  os = OSPlatform.MacOS
} else if (iosPlatforms.indexOf(platform) !== -1) {
  os = OSPlatform.iOS
} else if (windowsPlatforms.indexOf(platform) !== -1) {
  os = OSPlatform.Windows
} else if (/Android/.test(userAgent)) {
  os = OSPlatform.Android
} else if (/Linux/.test(platform)) {
  os = OSPlatform.Linux
}

export const osPlatform = os

export const getCrossCtrl = (): string => {
  switch (osPlatform) {
    case OSPlatform.Windows:
      return "CTRL"
    case OSPlatform.MacOS:
      return "⌘"
    case OSPlatform.Android:
    case OSPlatform.iOS:
    default:
      return ""
  }
}

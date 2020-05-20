const generateS4 = (): string => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1)
}

export const generateUuid = (): string => {
  return `${generateS4()}${generateS4()}-${generateS4()}-${generateS4()}-${generateS4()}-${generateS4()}${generateS4()}${generateS4()}`
}

const lowerCase = "abcdefghijklmnopqrstuvwxyz"
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const numbers = "0123456789"
const special = "!@#$%^&*()_+~`|}{[]:;?><,./-="

const random = (): number => {
  const { crypto, Uint32Array } = window
  if (typeof crypto?.getRandomValues === "function" && typeof Uint32Array === "function") {
    // Divide a random UInt32 by the maximum value (2^32 -1) to get a result between 0 and 1
    return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295
  }
  return Math.random()
}

const KeyGen = (length, useLowerCase = true, useUpperCase = true, useNumbers = true, useSpecial = true): string => {
  let chars = ""
  let key = ""

  if (useLowerCase) chars += lowerCase
  if (useUpperCase) chars += upperCase
  if (useNumbers) chars += numbers
  if (useSpecial) chars += special

  Array.from(Array(length).keys()).forEach(() => {
    key += chars[Math.floor(random() * chars.length)]
  })

  return key
}

export default KeyGen

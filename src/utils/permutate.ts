// https://github.com/rstacruz/cheatsheets/blob/master/_js/helpers/permutate.js

/**
 *     permutateWord('hello')
 *     => ['h', 'he', 'hel', 'hell', 'hello']
 */
export function permutateWord(str: string): string[] {
  const words: string[] = []
  const len = str.length
  for (let i = 1; i <= len; i += 1) {
    words.push(str.substr(0, i))
  }
  return words
}

/**
 *     splitWords('Hello, world!')
 *     => ['hello', 'world']
 */
export function splitwords(str: string): string[] {
  const words = str
    .toLowerCase()
    .split(/[ /\-_]/)
    .filter(k => k && k.length !== 0)

  return words
}

/**
 *     permutateString('hi joe')
 *     => ['h', 'hi', 'j', 'jo', 'joe']
 */
export function permutateString(str: string): string[] {
  let words: string[] = []
  const inputs = splitwords(str)

  inputs.forEach(word => {
    words = words.concat(permutateWord(word))
  })

  return words
}

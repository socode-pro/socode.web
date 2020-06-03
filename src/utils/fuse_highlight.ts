import Fuse from "fuse.js"
import set from "lodash/set"

type RangeTuple = [number, number]
type TagTuple = [string, string]

// https://github.com/krisk/Fuse/issues/6#issuecomment-455813098
const highlightedText = (inputText: string, regions: ReadonlyArray<RangeTuple>, tags: TagTuple): string => {
  let content = ""
  let nextUnhighlightedRegionStartingIndex = 0

  regions.forEach((region) => {
    const lastRegionNextIndex = region[1] + 1

    content += [
      inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
      tags[0],
      inputText.substring(region[0], lastRegionNextIndex),
      tags[1],
    ].join("")

    nextUnhighlightedRegionStartingIndex = lastRegionNextIndex
  })

  content += inputText.substring(nextUnhighlightedRegionStartingIndex)
  return content
}

const FuseHighlight = <T extends object>(result: Fuse.FuseResult<T>[], tags: TagTuple): Array<T> => {
  return result.map(({ item, matches }) => {
    const highlightedItem = { ...item }
    if (matches) {
      matches.forEach((match: Fuse.FuseResultMatch) => {
        if (match.key && match.value) {
          set(highlightedItem, match.key, highlightedText(match.value, match.indices, tags))
        }
      })
    }
    return highlightedItem
  })
}

export default FuseHighlight

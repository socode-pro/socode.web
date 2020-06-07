import { useState, useEffect } from "react"
import { useStoreState } from "../Store"
import { Settings } from "../models/profile"
import { InterfaceLanguage } from "./language"
import { SKeyCategory } from "./searchkeys"

const useSKeyCategoryIntl = (category: SKeyCategory): string => {
  const [word, setWord] = useState("")
  const { language } = useStoreState<Settings>((state) => state.profile.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (category) {
        case SKeyCategory.Search:
          setWord("搜索")
          break
        case SKeyCategory.Tools:
          setWord("工具")
          break
        case SKeyCategory.CheatSheets:
          setWord("Cheat Sheets")
          break
        case SKeyCategory.Document:
          setWord("文档")
          break
        case SKeyCategory.Collection:
          setWord("导航")
          break
        case SKeyCategory.Learn:
          setWord("学习")
          break
        default:
          break
      }
    } else {
      switch (category) {
        case SKeyCategory.Search:
          setWord("SEARCH")
          break
        case SKeyCategory.Tools:
          setWord("TOOLS")
          break
        case SKeyCategory.CheatSheets:
          setWord("Cheat Sheets")
          break
        case SKeyCategory.Document:
          setWord("DOCUMENT")
          break
        case SKeyCategory.Collection:
          setWord("COLLECTION")
          break
        case SKeyCategory.Learn:
          setWord("LEARN")
          break
        default:
          break
      }
    }
  }, [language, category])

  return word
}

export default useSKeyCategoryIntl

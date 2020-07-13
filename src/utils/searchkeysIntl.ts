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
        case SKeyCategory.Information:
          setWord("资料")
          break
        case SKeyCategory.Document:
          setWord("文档")
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
        case SKeyCategory.Information:
          setWord("INFORMATION")
          break
        case SKeyCategory.Document:
          setWord("DOCUMENT")
          break
        default:
          break
      }
    }
  }, [language, category])

  return word
}

export default useSKeyCategoryIntl

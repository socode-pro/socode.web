import { useState, useEffect } from 'react'
import { useStoreState } from './hooks'
import { SettingsType } from '../models/storage'
import Language, { InterfaceLanguage } from './language'
import { SKeyCategory } from './searchKeys'

const useSKeyCategoryIntl = (category: SKeyCategory): string => {
  const [word, setWord] = useState('')
  const { language } = useStoreState<SettingsType>((state) => state.storage.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (category) {
        case SKeyCategory.Search:
          setWord('搜索')
          break
        case SKeyCategory.Tools:
          setWord('工具')
          break
        case SKeyCategory.CheatSheets:
          setWord('Cheat Sheets')
          break
        case SKeyCategory.Document:
          setWord('文档')
          break
        case SKeyCategory.Collection:
          setWord('导航')
          break
        case SKeyCategory.Learn:
          setWord('学习')
          break
        default:
          break
      }
    } else {
      switch (category) {
        case SKeyCategory.Search:
          setWord('SEARCH')
          break
        case SKeyCategory.Tools:
          setWord('TOOLS')
          break
        case SKeyCategory.CheatSheets:
          setWord('Cheat Sheets')
          break
        case SKeyCategory.Document:
          setWord('DOCUMENT')
          break
        case SKeyCategory.Collection:
          setWord('COLLECTION')
          break
        case SKeyCategory.Learn:
          setWord('LEARN')
          break
        default:
          break
      }
    }
  }, [language, category])

  return word
}

export default useSKeyCategoryIntl

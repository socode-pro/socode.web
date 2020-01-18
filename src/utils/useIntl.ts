import { useState, useEffect } from 'react'
import { useStoreState } from './hooks'
import Language from './language'
import { StorageType } from '../models/storage'

export enum Words {
  ASearchEngineForProgrammers = 'A search engine for programmers',
  PrivacyPolicy = 'Privacy Policy',
  PrivacyPolicyContent = 'We don\'t collect or share personal information. That\'s our privacy policy in a nutshell.'
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState('')
  const { language } = useStoreState<StorageType>(state => state.storage.values)

  useEffect(() => {
    if (language === Language.English) {
      setContent(words)

    } else if (language === Language.中文) {
      switch (words) {
        case Words.ASearchEngineForProgrammers:
          setContent('给程序员用的搜索引擎')
          break
        case Words.PrivacyPolicy:
          setContent('隐私政策')
          break
        case Words.PrivacyPolicyContent:
          setContent('我们不收集或共享个人信息。简而言之，这就是我们的隐私政策。')
          break
        default:
          break
      }
    }

  }, [language, words])

  return content
}

export default useIntl
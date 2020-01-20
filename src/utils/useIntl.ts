import { useState, useEffect } from 'react'
import { useStoreState } from './hooks'
import Language from './language'
import { StorageType } from '../models/storage'

export enum Words {
  ASearchEngineForProgrammers = 'A search engine for programmers',
  PrivacyPolicy = 'Privacy Policy',
  PrivacyPolicySlogon = "We don't collect or share personal information. That's our privacy policy in a nutshell.",
  PrivacyPolicyST = 'About Search',
  PrivacyPolicyS0 = 'Socode.pro provides services using proxy google. Compared to using google.com. There are these differences in privacy protection:',
  PrivacyPolicyS1 = 'No private data will be sent to the google server.',
  PrivacyPolicyS2 = 'Do not forward any content from third-party services through advertising.',
  PrivacyPolicyS3 = "The process of clicking to enter the target page no longer collects data through the google redirect service. (it's also faster😄)",
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
        case Words.PrivacyPolicySlogon:
          setContent('我们不收集或共享个人信息。简而言之，这就是我们的隐私政策。')
          break
        case Words.PrivacyPolicyST:
          setContent('关于搜索')
          break
        case Words.PrivacyPolicyS0:
          setContent('socode.pro 使用代理google的方式提供服务。相比于使用google.com。在隐私保护方面有这些区别：')
          break
        case Words.PrivacyPolicyS1:
          setContent('不会有任何私人数据发送给google服务器。')
          break
        case Words.PrivacyPolicyS2:
          setContent('不通过广告转发来自第三方服务的任何内容。')
          break
        case Words.PrivacyPolicyS3:
          setContent('点击进入目标页的过程不再经过google重定向服务收集数据。（这样速度也更快😄）')
          break
        default:
          break
      }
    }
  }, [language, words])

  return content
}

export default useIntl

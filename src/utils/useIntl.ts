import { useState, useEffect } from 'react'
import { useStoreState } from './hooks'
import Language from './language'
import { StorageType } from '../models/storage'

export enum Words {
  ASearchEngineForProgrammers = 'A search engine for programmers',
  ProgrammersStartPage = "Programmer's start page",
  OpenNewTab = 'Open search page in a new tab',
  DisplayAwesome = 'Display Awesome',
  PrivacyPolicy = 'Privacy Policy',
  PrivacyPolicySlogon = "We don't collect or share personal information. That's our privacy policy in a nutshell.",
  PrivacyPolicyST = 'About Search',
  PrivacyPolicySS = 'socode.pro is a privacy-respecting, hackable google search by searx. convenient for users who do not have access to google.com (such as Chinese users).',
  PrivacyPolicyS0 = 'Compared to using google.com. There are these differences in privacy protection:',
  PrivacyPolicyS1 = 'No private data will be sent to the google server.',
  PrivacyPolicyS2 = 'Do not forward any content from third-party services through advertising.',
  PrivacyPolicyS3 = "The process of clicking to enter the target page no longer collects data through the google redirect service. (it's also faster😄)",
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState('')
  const { language } = useStoreState<StorageType>(state => state.storage.values)

  useEffect(() => {
    if (language === Language.中文) {
      switch (words) {
        case Words.ASearchEngineForProgrammers:
          setContent('给程序员用的问答搜索')
          break
        case Words.OpenNewTab:
          setContent('在新窗口打开搜索页面')
          break
        case Words.DisplayAwesome:
          setContent('自动显示 Awesome')
          break
        case Words.ProgrammersStartPage:
          setContent('程序员的起始页')
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
        case Words.PrivacyPolicySS:
          setContent(
            'socode.pro 是一个使用searx构建的google搜索代理，限定了搜索范围。仅用于给无法访问google.com的用户方便地搜索编程问答信息，请不要用于其它需求场合。'
          )
          break
        case Words.PrivacyPolicyS0:
          setContent('相比于使用google.com。在隐私保护方面有这些区别：')
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
    } else {
      setContent(words)
    }
  }, [language, words])

  return content
}

export default useIntl

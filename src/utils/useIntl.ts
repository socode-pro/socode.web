import { useState, useEffect } from 'react'
import { useStoreState } from './hooks'
import { InterfaceLanguage } from './language'
import { SettingsType } from '../models/storage'

export enum Words {
  ASearchEngineForProgrammers = 'A search engine for programmers',
  ProgrammersStartPage = "Programmer's start page",
  OpenNewTab = 'Open search page in a new tab',
  DisplayTrending = 'Display Github Trending',
  PrivacyPolicy = 'Privacy Policy',
  Shortcut = 'Shortcut',
  OpenKeyboardShortcuts = 'Open keyboard shortcuts help',
  ToggleMenuButton = 'Toggle menu button',
  FocusToInput = 'Focus to input',
  DisplaySearchable = 'Display searchable',
  SwitchToGithub = 'Switch to Github',
  NextPage = 'Next page',
  PreviousPage = 'Previous page',
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState('')
  const { language } = useStoreState<SettingsType>(state => state.storage.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (words) {
        case Words.ASearchEngineForProgrammers:
          setContent('给程序员用的问答搜索')
          break
        case Words.OpenNewTab:
          setContent('在新窗口打开搜索页面')
          break
        case Words.DisplayTrending:
          setContent('显示 Github Trending')
          break
        case Words.ProgrammersStartPage:
          setContent('程序员的起始页')
          break
        case Words.PrivacyPolicy:
          setContent('隐私政策')
          break
        case Words.Shortcut:
          setContent('快捷键')
          break
        case Words.OpenKeyboardShortcuts:
          setContent('打开快捷键帮助')
          break
        case Words.ToggleMenuButton:
          setContent('点击菜单栏')
          break
        case Words.FocusToInput:
          setContent('聚焦到输入框')
          break
        case Words.DisplaySearchable:
          setContent('显示可搜索项目')
          break
        case Words.SwitchToGithub:
          setContent('切换至 Github')
          break
        case Words.NextPage:
          setContent('下一页')
          break
        case Words.PreviousPage:
          setContent('上一页')
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

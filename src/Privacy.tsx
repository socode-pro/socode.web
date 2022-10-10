import React, { useEffect, useState } from "react"
import { Markup } from "interweave"
import { useStoreActions, useStoreState } from "./Store"
import { InterfaceLanguage } from "./utils/language"
import { Settings } from "./models/profile"
import Brand from "./components/brand"
import "./Privacy.module.scss"

export enum Words {
  PrivacyPolicy = "Privacy Policy",
  PrivacyPolicySlogon = "We don't collect or share personal information. Get the email address of a github/google account via OAuth only to associate and save the user's settings in the socode.pro. We do not send any emails using this email address. We will determine whether the area is affected by the firewall of mainland China based on the ip of the visitor, so as to adopt different cdn strategies.",
  PrivacyPolicyST = "About Search",
  PrivacyPolicySS = '<a href="https://socode.pro/?k=socode">socode search</a> is a privacy-respecting, hackable google search by <a href="https://github.com/asciimoo/searx">searx</a>. convenient for users who do not have access to google.com (such as Chinese users).',
  PrivacyPolicyS0 = "Compared to using google.com. There are these differences in privacy protection:",
  PrivacyPolicyS1 = "No private data will be sent to the google server.",
  PrivacyPolicyS2 = "Do not forward any content from third-party services through advertising.",
  PrivacyPolicyS3 = "The process of clicking to enter the target page no longer collects data through the google redirect service. (it's also faster😄)",
  PrivacyPolicyP1 = "We do not sell or transfer user data to third parties, outside of the approved use cases.",
  PrivacyPolicyP2 = "We do not use or transfer user data for purposes that are unrelated to my item's single purpose.",
  PrivacyPolicyP3 = "We do not use or transfer user data to determine creditworthiness or for lending purposes.",
}

const useIntl = (words: Words): string => {
  const [content, setContent] = useState("")
  const { language } = useStoreState<Settings>((state) => state.profile.settings)

  useEffect(() => {
    if (language === InterfaceLanguage.中文) {
      switch (words) {
        case Words.PrivacyPolicy:
          setContent("隐私政策")
          break
        case Words.PrivacyPolicySlogon:
          setContent(
            "我们不收集或共享任何个人信息。通过OAuth获取github/google账号的email地址仅用于关联并保存用户在socode.pro的设置。我们不会使用此email地址发送任何邮件。我们会基于访问者的ip确定其区域是否被中国大陆的防火墙所影响，从而采取不同的cdn策略。"
          )
          break
        case Words.PrivacyPolicyST:
          setContent("关于socode搜索")
          break
        case Words.PrivacyPolicySS:
          setContent(
            '<a href="https://socode.pro/?k=socode">socode搜索</a> 是一个使用<a href="https://github.com/asciimoo/searx">searx</a>构建的google搜索代理，限定了搜索范围。仅用于给无法访问google.com的用户方便地搜索编程问答信息，请不要用于其它需求场合。'
          )
          break
        case Words.PrivacyPolicyS0:
          setContent("相比于使用google.com。在隐私保护方面有这些区别：")
          break
        case Words.PrivacyPolicyS1:
          setContent("不会有任何私人数据发送给google服务器。")
          break
        case Words.PrivacyPolicyS2:
          setContent("不通过广告转发来自第三方服务的任何内容。")
          break
        case Words.PrivacyPolicyS3:
          setContent("点击进入目标页的过程不再经过google重定向服务收集数据。（这样速度也更快😄）")
          break
        case Words.PrivacyPolicyP1:
          setContent("在批准的用例之外，我们不会将用户数据出售或转让给第三方")
          break
        case Words.PrivacyPolicyP2:
          setContent("我们不会将用户数据用于与我的商品的单一用途无关的目的")
          break
        case Words.PrivacyPolicyP3:
          setContent("我们不会使用或转移用户数据来确定信誉或用于借贷目的")
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

const Privacy: React.FC = () => (
  <div className="container">
    <Brand />
    <h1 className="title mgt40">{useIntl(Words.PrivacyPolicy)}</h1>
    <p className="subtitle">{useIntl(Words.PrivacyPolicySlogon)}</p>
    <div className="content mgl20">
      <ol type="1">
        <li>{useIntl(Words.PrivacyPolicyP1)}</li>
        <li>{useIntl(Words.PrivacyPolicyP2)}</li>
        <li>{useIntl(Words.PrivacyPolicyP3)}</li>
      </ol>
    </div>

    <h3 className="title is-4 mgt40">{useIntl(Words.PrivacyPolicyST)}</h3>
    <Markup content={useIntl(Words.PrivacyPolicySS)} tagName="p" attributes={{ className: "subtitle" }} />

    <p>{useIntl(Words.PrivacyPolicyS0)}</p>
    <div className="content mgl20">
      <ol type="1">
        <li>{useIntl(Words.PrivacyPolicyS1)}</li>
        <li>{useIntl(Words.PrivacyPolicyS2)}</li>
        <li>{useIntl(Words.PrivacyPolicyS3)}</li>
      </ol>
    </div>
  </div>
)

export default Privacy

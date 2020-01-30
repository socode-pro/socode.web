import React, { useEffect } from 'react'
import { useStoreActions } from './utils/hooks'
import Brand from './components/brand'
import useIntl, { Words } from './utils/useIntl'
import './Privacy.scss'

const Privacy: React.FC = () => {
  const getAllStorage = useStoreActions(actions => actions.storage.getAllStorage)
  useEffect(() => {
    getAllStorage()
  }, [getAllStorage])

  return (
    <div className='container'>
      <Brand />
      <h1 className='title mgt40'>{useIntl(Words.PrivacyPolicy)}</h1>
      <p className='subtitle'>{useIntl(Words.PrivacyPolicySlogon)}</p>

      <h3 className='title is-4 mgt40'>{useIntl(Words.PrivacyPolicyST)}</h3>
      <p className='subtitle'>{useIntl(Words.PrivacyPolicySS)}</p>

      <p>{useIntl(Words.PrivacyPolicyS0)}</p>
      <div className='content mgl20'>
        <ol type='1'>
          <li>{useIntl(Words.PrivacyPolicyS1)}</li>
          <li>{useIntl(Words.PrivacyPolicyS2)}</li>
          <li>{useIntl(Words.PrivacyPolicyS3)}</li>
        </ol>
      </div>
    </div>
  )
}

export default Privacy

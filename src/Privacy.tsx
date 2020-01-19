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
      <h2 className='subtitle'>{useIntl(Words.PrivacyPolicyContent)}</h2>
    </div>
  )
}

export default Privacy

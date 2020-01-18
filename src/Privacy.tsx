import React from 'react'
import Brand from './components/brand'
import './Privacy.scss'

const Privacy: React.FC = () => {

  return (
    <div className='container'>
      <Brand />
      <h1 className="title">隐私政策</h1>
      <h2 className="subtitle">我们不收集或共享个人信息。简而言之，这就是我们的隐私政策。</h2>
    </div>
  )
}

export default Privacy

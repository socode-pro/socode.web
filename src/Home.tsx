import React from 'react'
import Search from './components/search'
import Drawer from './components/drawer'
import ExtArrow from './components/extarrow'
import './styles/app.global.scss'

const Home: React.FC = () => {
  return (
    <>
      <Search />
      <Drawer />
      {!document.body.classList.contains('socode_ext') && <ExtArrow />}
    </>
  )
}

export default Home

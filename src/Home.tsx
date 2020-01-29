import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { useStoreActions } from './utils/hooks'
import Search from './components/search'
import Drawer from './components/drawer'
import ExtArrow from './components/extarrow'
import './styles/app.global.scss'

const Home: React.FC = () => {
  const getAllStorage = useStoreActions(actions => actions.storage.getAllStorage)
  useEffect(() => {
    getAllStorage()
  }, [getAllStorage])

  return (
    <>
      <Search />
      <Drawer />
      <ExtArrow />
    </>
  )
}

export default Home

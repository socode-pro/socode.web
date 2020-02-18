import React, { useEffect } from 'react'
import { useStoreActions } from './utils/hooks'
import Search from './components/search'
import Drawer from './components/drawer'
import ExtArrow from './components/extarrow'
import './styles/app.global.scss'

const Home: React.FC = () => {
  const storageGetAll = useStoreActions(actions => actions.storage.getAllStorage)
  const initial = useStoreActions(actions => actions.devdocs.initial)

  useEffect(() => {
    storageGetAll()
    initial()
  }, [initial, storageGetAll])

  return (
    <>
      <Search />
      <Drawer />
      {!document.body.classList.contains('socode_ext') && <ExtArrow />}
    </>
  )
}

export default Home

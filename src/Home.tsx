import React, { useEffect } from 'react'
import { useStoreActions, useStoreState } from './utils/hooks'
import Search from './components/search'
import './styles/app.global.scss';

const Home: React.FC = () => {
  const getAllStorage = useStoreActions(actions => actions.storage.getAllStorage)
  useEffect(() => { getAllStorage() }, [getAllStorage])

  return (
    <div className='container'>
      <Search />
    </div>
  )
}

export default Home;

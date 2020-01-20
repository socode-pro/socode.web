import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { useStoreActions } from './utils/hooks'
import Search from './components/search'
import './styles/app.global.scss'

const Home: React.FC = () => {
  const getAllStorage = useStoreActions(actions => actions.storage.getAllStorage)
  useEffect(() => {
    getAllStorage()
  }, [getAllStorage])

  return (
    <div className='container'>
      <Search />
      {/* <footer className='footer'>
        <div className='content has-text-centered'>
          <p>
            <Link className='link' to='/Privacy'>
              Privacy
            </Link>
          </p>
        </div>
      </footer> */}
    </div>
  )
}

export default Home

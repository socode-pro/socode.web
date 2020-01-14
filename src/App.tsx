import React from 'react';
import { StoreProvider } from 'easy-peasy'
import store from './store'
import Search from './components/search'
import './styles/app.global.scss';

const App: React.FC = () => {
  return (
    <div className='app'>
      <StoreProvider store={store}>
        <div className='container'>
          <Search />
        </div>
      </StoreProvider>
    </div>
  )
}

export default App;

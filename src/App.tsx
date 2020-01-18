import React from 'react'
import { StoreProvider } from 'easy-peasy'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import store from './store'
import Home from './Home'
import Privacy from './Privacy'
import NoMatch from './components/NoMatch'
import './styles/app.global.scss'

const App: React.FC = () => {
  return (
    <div className='app'>
      <StoreProvider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/privacy" component={Privacy} />
          <Route component={NoMatch} />
        </Switch>
      </BrowserRouter>
      </StoreProvider>
    </div>
  )
}

export default App;

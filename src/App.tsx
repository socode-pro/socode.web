import React from "react"
import { StoreProvider } from "easy-peasy"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import store from "./Store"
import Home from "./Home"
import Privacy from "./Privacy"
import Extension from "./Extension"
import NoMatch from "./utils/NoMatch"
import "./styles/app.global.scss"

const App: React.FC = () => (
  <div className="app">
    <StoreProvider store={store}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/extension" component={Extension} />
          <Route component={NoMatch} />
        </Switch>
      </BrowserRouter>
    </StoreProvider>
  </div>
)

export default App

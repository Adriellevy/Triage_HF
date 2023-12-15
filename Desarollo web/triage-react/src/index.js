import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import './style.css'
import Estacionescotidianediad from './views/estacionescotidianediad'
import Estacionesprimerapagina from './views/estacionesprimerapagina'
import Pacientes from './views/pacientes'
import Estadisticas from './views/estadisticas'
import NotFound from './views/not-found'

const App = () => {
  return (
    <Router>
      <Switch>
        <Route
          component={Estacionescotidianediad}
          exact
          path="/estacionescotidianediad"
        />
        <Route
          component={Estacionesprimerapagina}
          exact
          path="/estacionesprimerapagina"
        />
        <Route component={Pacientes} exact path="/pacientes" />
        <Route component={Estadisticas} exact path="/" />
        <Route component={NotFound} path="**" />
        <Redirect to="**" />
      </Switch>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))

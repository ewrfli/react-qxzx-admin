import React, {Component} from 'react';
import {
  BrowserRouter,
  Route,
  Redirect
} from 'react-router-dom'
import routes from './router/index'
import './App.less';


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
        <Route exact path="/" render={() => <Redirect to="/admin" push />} />
        
        {routes.map((route, i) => (
          <Route
          key={i}
          path={route.path}
          component={
            route.component
          }
         />
        ))}

        </div>

      </BrowserRouter >
    );
  }
}

export default App;
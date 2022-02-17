import React, {Component} from 'react';
import {
  BrowserRouter,
  Route,
  Redirect
} from 'react-router-dom'
import rootRoutes from './router/index'
import './App.less';
import './assets/root.css';
import Login from './pages/admin/login'
import AuthRouter from './AuthRouter'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
        <Route exact path="/" render={() => <Redirect to="/web/home" push />} />
        <Route exact path="/web" render={() => <Redirect to="/web/home" push />} />
        <Route path='/login' component={Login} />

          {rootRoutes.map((item, i) => (
            item.path.includes('/admin')
            ?  <AuthRouter key={i} path={item.path} component={ item.component } />
            :  <Route key={i} path={item.path} component={ item.component } />
          ))}

        </div>
      </BrowserRouter >
    );
  }
}

export default App;
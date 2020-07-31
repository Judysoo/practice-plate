import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
//페이지를 이동할 떄 사용하는 React Router Dom
import './App.css';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Auth from './hoc/auth'

const App = () => {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/landing">landing</Link>
          </li>
          <li>
            <Link to="/login">login</Link>
          </li>
          <li>
            <Link to="/register">register</Link>
          </li>
        </ul>

        <hr />
        <Switch>
          <Route exact path="/landing" component={LandingPage}></Route>
          <Route exact path="/login" component={LoginPage}></Route>
          <Route exact path="/register" component={RegisterPage}></Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;

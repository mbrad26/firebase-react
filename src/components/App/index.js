import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import * as ROUTES from '../../constants/routes';

const App = () => {
  return (
    <Router>
      <div>
        <Navigation />

        <hr />

        <Route exact to={ROUTES.LANDING} component={LandingPage} />
        <Route to={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route to={ROUTES.SIGN_IN} component={SignInPage} />
        <Route to={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route to={ROUTES.HOME} component={HomePage} />
        <Route to={ROUTES.ACCOUNT} component={AccountPage} />
        <Route to={ROUTES.ADMIN} component={AdminPage} />
      </div>
    </Router>

  )
}

export default App



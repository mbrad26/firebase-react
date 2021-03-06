import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';

import { AuthUserContext } from '../Session';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const App = () => {
  const { doCurrentUser, user } = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('authUser')));

  useEffect(() => {
    const unsubscribe = doCurrentUser().onAuthStateChanged(authUser => {
      if(authUser) {
        user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            authUser = {
              ...dbUser, 
              uid: authUser.uid, 
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
            };
            
            localStorage.setItem('authUser', JSON.stringify(authUser));
            setAuthUser(authUser);
          });
      } else {
        localStorage.removeItem('authUser');
        setAuthUser(null);
      }
    })
      
    return () => unsubscribe();
  }, [doCurrentUser, user]);
    
  return (
    <AuthUserContext.Provider value={authUser}>
      <Router>
        <div>
          <Navigation />

          <hr />
          
          <Switch>
            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
          </Switch>
        </div>
      </Router>
    </AuthUserContext.Provider>
  )
}

export default App



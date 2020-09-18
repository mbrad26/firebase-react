import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import PasswordChangeForm from '../PasswordChange';
import { PasswordForgetForm } from '../PasswordForget';
import * as ROUTES from '../../constants/routes';

const SIGN_IN_METHODS = [
  {
    id: 'passowrd',
    provider: null,
  },
  {
    id: 'google.com',
    provider: 'googleProvider',
  },
  {
    id: 'facebook.com',
    provider: 'facebookProvider',
  },
  {
    id: 'twitter.com',
    provider: 'twitterProvider',
  },
];

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);
  
  if(!authUser) return <Redirect to={ROUTES.SIGN_IN} />

  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
      <LoginManagement authUser={authUser} />
    </div>
  );
};

const LoginManagement = () => {

  return (
    <div>
      Sign In Methods: 
      <ul>
        {SIGN_IN_METHODS.map(method => 
          <li key={method.id}>
            <button type='button' onClick={() => {}}>
              {method.id}
            </button>
          </li>
          )}
      </ul>
    </div>
  );
};

export default AccountPage;

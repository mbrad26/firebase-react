import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import PasswordChangeForm from '../PasswordChange';
import { PasswordForgetForm } from '../PasswordForget';
import * as ROUTES from '../../constants/routes';

const AccountPage = () => {
  const authUser = useContext(AuthUserContext);
  
  if(!authUser) return <Redirect to={ROUTES.SIGN_IN} />

  return (
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  )
}

export default AccountPage;

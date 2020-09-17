import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

const Navigation = () => {
  const authUser  = useContext(AuthUserContext);

  return (
    <div>
      {authUser ? <Authenticated authUser={authUser} /> : <Unauthenticated />}
    </div>
  );
};

const Authenticated = ({ authUser }) => 
  <div>
    <ul style={{display: 'inline-block'}}>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.ACCOUNT}>Account</Link>
      </li>
      <li>
        <Link to={ROUTES.ADMIN}>Admin</Link>
      </li>
      <li>
        <SignOutButton />
      </li>
    </ul>

    <h3 style={{float: 'right'}}>Welcome {authUser.email}!</h3>
  </div>

const Unauthenticated = () => 
  <div>
    <ul style={{display: 'inline-block'}}>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
    </ul>

    <h3 style={{float: 'right'}}>Welcome guest!</h3>
  </div>

export default Navigation;
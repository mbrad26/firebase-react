import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext }  from '../Session';
import * as ROUTES from '../../constants/routes';

const HomePage = () => {
  const authUser = useContext(AuthUserContext);

  if(!authUser) return <Redirect to={ROUTES.SIGN_IN} />
  
  return (
    <div>
      Home
    </div>
  )
}

export default HomePage;

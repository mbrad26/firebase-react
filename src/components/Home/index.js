import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const HomePage = () => {
  const authUser = useContext(AuthUserContext);
  const { doSendEmailVerification } = useContext(FirebaseContext);

  const onSendEmailVerification = () => doSendEmailVerification();

  if(!authUser) return <Redirect to={ROUTES.SIGN_IN} />
  console.log('AUTHENTICATED: ', authUser);

  if(authUser && 
    !authUser.emailVerified &&
    authUser.providerData 
            .map(provider => provider.providerId)
            .includes('password')
    ) {
      return (
        <div>
          <p>
            Verify your E-Mail: Check you E-Mails (Spam folder 
            included) for a confirmation E-Mail or 
            send another confirmation E-Mail.
          </p>

          <button
            type="button" 
            onClick={onSendEmailVerification}
          >
          Send confirmation E-Mail
          </button>
        </div>
      )
    }

  return (
    <div>
      Home
    </div>
  )
}

export default HomePage;

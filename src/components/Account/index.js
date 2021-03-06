import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import { FirebaseContext } from '../Firebase';
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
  const { doSendEmailVerification } = useContext(FirebaseContext);

  const onSendEmailVerification = () => doSendEmailVerification();
  
  if(!authUser) return <Redirect to={ROUTES.SIGN_IN} />

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
      <h1>Account: {authUser.email}</h1>
      <PasswordForgetForm />
      <PasswordChangeForm />
      <LoginManagement authUser={authUser} />
    </div>
  );
};

const INITIAL_STATE = {
  activeSignInMethods: [],
  error: null,
};

const LoginManagement = ({ authUser }) => {
  const { doSignInMethods, doCurrentUser } = useContext(FirebaseContext);
  const [state, setState] = useState(INITIAL_STATE);
  const { activeSignInMethods, error } = state;

  const fetchSignInMethods = useCallback(async () => {
    try {
      const response = await doSignInMethods(authUser.email);

      setState({ ...state, activeSignInMethods: response, error: null });
    } catch (error) {
      setState({ ...state, error });
    };
  }, [doSignInMethods]);

  useEffect(() => {
    fetchSignInMethods();
  }, [fetchSignInMethods]);

  const onSocialLoginLink = provider => 
    doCurrentUser().currentUser.linkWithPopup(provider)
      .then(fetchSignInMethods)
      .catch(error => setState({ ...state, error }));

  const onUnlink = providerId =>
    doCurrentUser().currentUser.unlink(providerId)
      .then(fetchSignInMethods)
      .catch(error => setState({ ...state, error }));

  return (
    <div>
      Sign In Methods: 
      <ul>
        {SIGN_IN_METHODS.map(method => {
          const onlyOneLeft = activeSignInMethods.length === 1;
          const isEnabled = activeSignInMethods.includes(method.id);

          return (
            <li key={method.id}>
              {isEnabled 
                ? <button 
                    type='button' 
                    onClick={() => onUnlink(method.id)}
                    disabled={onlyOneLeft}
                  >
                    Deactivate {method.id}
                  </button>
                : <button 
                    type='button' 
                    onClick={() => onSocialLoginLink(method.provider)}
                  >
                    Link {method.id}
                  </button>
              }
              
            </li>
          )
        })}
      </ul>

      {error && error.message}
    </div>
  );
};

export default AccountPage;

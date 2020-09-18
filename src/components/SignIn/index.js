import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget';

const ERROR_CODE_ACCOUNT_EXISTS = 
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from 
  this account instead and associate your social accounts on 
  your personal account page.
`;

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
      <SignInGoogle />
      <SignInFacebook />
      <SignInTwitter />
      <PasswordForgetLink />
      <SignUpLink />
    </div>
  );
};

const INITIAL_STATE = {
  email: '',
  password: '',
  error: '',
}

const SignInForm = () => {
  const { doSignInWithEmailAndPassword } = useContext(FirebaseContext);
  const [user, setUser] = useState(INITIAL_STATE);
  const { email, password, error } = user;
  const history = useHistory();
  
  const isInvalid = email === '' || password === '';
  
  const onChange = event => setUser({ ...user, [event.target.name]: event.target.value });
  
  const onSubmit = async event => {
    event.preventDefault();
    try {
      await doSignInWithEmailAndPassword(email, password);
      setUser(INITIAL_STATE);
      history.push(ROUTES.HOME);
    } catch (error) {
      setUser({ ...user, [error]: error })
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        type='text'
        name='email'
        value={email}
        onChange={onChange}
        placeholder='Email Address'
      />
      <input
        type='text'
        name='password'
        value={password}
        onChange={onChange}
        placeholder='Password' 
      />
      <button type='submit' disabled={isInvalid}>Sign In</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInGoogle = () => {
  const { doSignInWithGoogle, user } = useContext(FirebaseContext);
  const [error, setError] = useState();
  const history = useHistory();

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const response = await doSignInWithGoogle();
      user(response.user.uid).set({
        username: response.user.displayName,
        email: response.user.email,
        roles: {},
      });

      history.push(ROUTES.HOME);
    } catch (error) {
      if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      };

      setError(error);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <button type='submit'>Sign In with Google</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInFacebook = () => {
  const { doSignInWithFacebook, user } = useContext(FirebaseContext);
  const [error, setError] = useState();
  const history = useHistory();

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const response = await doSignInWithFacebook();
      user(response.user.uid).set({
        username: response.additionalUserInfo.profile.name,
        email: response.additionalUserInfo.profile.email,
        roles: {},
      });

      history.push(ROUTES.HOME)
    } catch (error) {
      if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      };

      setError(error);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <button type='submit'>Sign In with Facebook</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignInTwitter = () => {
  const { doSignInWithTwitter, user } = useContext(FirebaseContext);
  const [error, setError] = useState();
  const history = useHistory();

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const response = doSignInWithTwitter();
      user(response.user.uid).set({
        username: response.additionalUserInfo.profile.name,
        email: response.additionalUserInfo.profile.email,
        roles: {},
      });

      history.push(ROUTES.HOME);
    } catch (error) {
      if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      };

      setError(error);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <button>Sign In with Twitter</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

export default SignInPage;


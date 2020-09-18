import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import { FirebaseContext } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import { PasswordForgetLink } from '../PasswordForget';

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
      <SignInGoogle />
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

export default SignInPage;


import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { SignUpLink } from '../SignUp';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignInPage = () => {
  return (
    <div>
      <h1>Sign In</h1>
      <SignInForm />
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

export default SignInPage;


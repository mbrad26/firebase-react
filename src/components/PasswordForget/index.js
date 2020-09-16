import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { FirebaseContext } from '../Firebase';

const PasswordForgetPage = () => 
  <div>
    <h1>
      Password Reset
      <PasswordForgetForm />
    </h1>
  </div>

const INITIAL_STATE = {
  email: '',
  error: null,
}

const PasswordForgetForm = () => {
  const { doPasswordReset } = useContext(FirebaseContext);
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const { email, error } = credentials;

  const isInvalid = email === '';

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const result = await doPasswordReset(email);
      setCredentials(INITIAL_STATE);
    } catch (error) {
      setCredentials({ ...credentials, [error]: error });
    }
  }

  const onChange = event => 
    setCredentials({ ...credentials, [event.target.name]: event.target.value });

  return (
    <form onSubmit={onSubmit}>
      <input 
        type='text'
        name='email'
        value={email}
        onChange={onChange}
        placeholder='Email Address'
      />
      <button disabled={isInvalid} type='submit'>
        Reset My Password
      </button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const PasswordForgetLink = () =>
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>
      Forgot Password?
    </Link>
  </p>

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink};

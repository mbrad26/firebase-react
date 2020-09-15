import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignUpPage = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

const SignUpForm = () => {
  const { doCreateUserWithEmailAndPassword } = useContext(FirebaseContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [passwordOne, setPasswordOne] = useState('');
  const [passwordTwo, setPasswordTwo] = useState('');
  const [error, setError] = useState('');

  const isInvalid = 
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const result = await doCreateUserWithEmailAndPassword(email, passwordOne);
      console.log(result.user.email)
    } catch (error) {
      setError(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <input 
        type='text'
        name='username'
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder='Full Name'
      />
      <input 
        type='text'
        name='email'
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder='Email'
      />
      <input 
        type='text'
        name='passwordOne'
        value={passwordOne}
        onChange={e => setPasswordOne(e.target.value)}
        placeholder='Password'
      />
      <input 
        type='text'
        name='passwordTwo'
        value={passwordTwo}
        onChange={e => setPasswordTwo(e.target.value)}
        placeholder='Confirm Password'
      />
      <button disabled={isInvalid} type='submit'>Sign Up</button>

      {error && <p>{error.message}</p>}
    </form>
  );
};

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

export default SignUpPage;
export { SignUpPage, SignUpLink };

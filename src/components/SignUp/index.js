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

const INITIAL_STATE = {
  username: '',
  email: '', 
  passwordOne: '', 
  passwordTwo: '', 
  error: null,
}

const SignUpForm = () => {
  const { doCreateUserWithEmailAndPassword } = useContext(FirebaseContext);
  const [user, setUser] = useState(INITIAL_STATE);

  const isInvalid = 
    user.passwordOne !== user.passwordTwo ||
    user.passwordOne === '' ||
    user.email === '' ||
    user.username === '';

  const onSubmit = async event => {
    event.preventDefault();
    try {
      const result = await doCreateUserWithEmailAndPassword(user.email, user.passwordOne);
      console.log(result);
      setUser(INITIAL_STATE);
    } catch (error) {
      return error;
    }
  };

  const onChange = event => setUser({ ...user, [event.target.name]: event.target.valuelue });

  return (
    <form onSubmit={onSubmit}>
      <input 
        type='text'
        name='username'
        value={user.username}
        onChange={onChange}
        placeholder='Full Name'
      />
      <input 
        type='text'
        name='email'
        value={user.email}
        onChange={onChange}
        placeholder='Email'
      />
      <input 
        type='text'
        name='passwordOne'
        value={user.passwordOne}
        onChange={onChange}
        placeholder='Password'
      />
      <input 
        type='text'
        name='passwordTwo'
        value={user.passwordTwo}
        onChange={onChange}
        placeholder='Confirm Password'
      />
      <button disabled={isInvalid} type='submit'>Sign Up</button>

      {user.error && <p>{user.error.message}</p>}
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

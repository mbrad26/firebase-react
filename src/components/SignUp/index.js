import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';
import * as ROLES from '../../constants/roles';
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
  isAdmin: false,
  error: null,
};

const SignUpForm = () => {
  const { doCreateUserWithEmailAndPassword, user } = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState(INITIAL_STATE);
  const history = useHistory();

  console.log('HISTORY', history);

  const { username, email, passwordOne, passwordTwo, isAdmin, error } = authUser;

  const isInvalid = 
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  const onChange = event =>
    setAuthUser({ ...authUser, [event.target.name]: event.target.value });

  const onSubmit = async event => {
    event.preventDefault();

    const roles = {};
    if(isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    try {
      const result = await doCreateUserWithEmailAndPassword(email, passwordOne);
      await user(result.user.uid).set({ username, email, roles });

      setAuthUser(INITIAL_STATE);
      history.push(ROUTES.HOME);
    } catch (error) {
      setAuthUser({ ...authUser, [error]: error });
    }
  };

  const onChangeCheckbox = event =>
    setAuthUser({ ...authUser, isAdmin: true });

  return (
    <form onSubmit={onSubmit}>
      <input 
        type='text'
        name='username'
        value={username}
        onChange={onChange}
        placeholder='Full Name'
      />
      <input 
        type='text'
        name='email'
        value={email}
        onChange={onChange}
        placeholder='Email'
      />
      <input 
        type='text'
        name='passwordOne'
        value={passwordOne}
        onChange={onChange}
        placeholder='Password'
      />
      <input 
        type='text'
        name='passwordTwo'
        value={passwordTwo}
        onChange={onChange}
        placeholder='Confirm Password'
      />
      <label>
        Admin 
        <input 
          type='checkbox'
          name='isAdmin'
          checked={isAdmin}
          onChange={onChangeCheckbox}
        />
      </label>
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

import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

const ERROR_CODE_ACCOUNT_EXISTS = 'auth/email-already-in-use';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with this E-Mail address already exists.
  Try to login with this account instead. If you think the 
  account is already used from one of the social logins, try
  to sign-in with one of them. Afterward, associate your accounts 
  on your personal account page.
`;

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
  const { 
    doCreateUserWithEmailAndPassword,
    doSendEmailVerification, 
    user 
  } = useContext(FirebaseContext);
  const [authUser, setAuthUser] = useState(INITIAL_STATE);
  const history = useHistory();
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
      await doSendEmailVerification();

      setAuthUser(INITIAL_STATE);
      history.push(ROUTES.HOME);
    } catch (error) {
      if(error.code === ERROR_CODE_ACCOUNT_EXISTS) {
        error.message = ERROR_MSG_ACCOUNT_EXISTS;
      }
      
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

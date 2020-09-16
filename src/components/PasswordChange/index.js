import React, { useState, useContext } from 'react';

import { FirebaseContext } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
}

const PasswordChangeForm = () => {
  const { doPasswordUpdate } = useContext(FirebaseContext);
  const [password, setPassword] = useState(INITIAL_STATE);
  const { passwordOne, passwordTwo, error } = password;

  const onSubmit = async event => {
    event.preventDefault();
    try {
      await doPasswordUpdate(passwordOne)
      setPassword(INITIAL_STATE)
    } catch (error) {
      setPassword({ ...password, [error]: error });
    }
  };

  const onChange = event => 
    setPassword({ ...password, [event.target.name]: event.target.value });

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  return (
    <form onSubmit={onSubmit}>
      <input 
        type="password"
        name='passwordOne'
        value={passwordOne}
        onChange={onChange}
        placeholder='New Password'
      />
      <input 
        type="password"
        name='passwordTwo'
        value={passwordTwo}
        onChange={onChange}
        placeholder='Confirm New Password'
      />
      <button type='submit' disabled={isInvalid}>
        Reset My Password
      </button>

    {error && <p>{error.message}</p>}
    </form>
  )
}

export default PasswordChangeForm;
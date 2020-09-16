import React, { useContext } from 'react';

import { FirebaseContext } from '../Firebase';

const SignOutButton = () => {
  const { doSignOut } = useContext(FirebaseContext);

  const onClick = () => doSignOut();

  return (
    <button type='button' onClick={onClick}>
      Sign Out
    </button>
  )
}

export default SignOutButton;

import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  loading: false, 
  users: [],
}

const AdminPage = () => {
  const authUser = useContext(AuthUserContext);
  const { users } = useContext(FirebaseContext);
  const [state, setState] = useState(INITIAL_STATE);

  useEffect(() => {
    setState({ ...state, loading: true});
    
    users().on('value', snapshot => {
      const usersObject = snapshot.val();
      
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key,
      }));
      
      setState({ ...state, users: usersList, loading: false });
    }) 
    
    return () => users().off();
  }, []);
  
  if(!authUser || (authUser && !authUser.roles)) return <Redirect to={ROUTES.SIGN_IN} />

  console.log(state.users);

  return (
    <div>
      Admin

      {state.loading && <div>Loading ...</div>}

      <UserList users={state.users} />
    </div>
  );
};

const UserList = ({ users }) => 
  <ul>
    {users.map(user => 
      <li key={user.uid}>
        <span>
          <strong>ID: </strong> {user.uid} 
        </span>
        <span>
          <strong>E-Mail: </strong> {user.email} 
        </span>
        <span>
          <strong>Username: </strong> {user.username}
        </span>
      </li>
    )}
  </ul>

export default AdminPage;

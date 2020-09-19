import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';

import { FirebaseContext } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  loading: false, 
  users: [],
}

const AdminPage = () => 
  <div>
    Admin

    <Switch>
      <Route exact path={ROUTES.ADMIN_DETAILS} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </div>


const UserList = () => {
  const authUser = useContext(AuthUserContext);
  const { doSendEmailVerification, users } = useContext(FirebaseContext);
  const [state, setState] = useState(INITIAL_STATE);

  const onSendEmailVerification = () => doSendEmailVerification();

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

  if(authUser && 
    !authUser.emailVerified &&
    authUser.providerData 
            .map(provider => provider.providerId)
            .includes('password')
    ) {
      return (
        <div>
          <p>
            Verify your E-Mail: Check you E-Mails (Spam folder 
            included) for a confirmation E-Mail or 
            send another confirmation E-Mail.
          </p>

          <button
            type="button" 
            onClick={onSendEmailVerification}
          >
          Send confirmation E-Mail
          </button>
        </div>
      )
    };

  return (
    <>
      <h2>Users</h2>

      {state.loading && <div>Loading ...</div>}

      <ul>
        {state.users.map(user => 
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

            <span>
              <Link 
                to={{
                  pathname: `${ROUTES.ADMIN}/${user.uid}`,
                  state: { user },
                }}
              >
                Details
              </Link>
            </span>
          </li>
        )}
      </ul>
    </>
  );
};

const UserItem = props => {
  const { doPasswordReset, user } = useContext(FirebaseContext);
  const [state, setState] = useState({ ...props.location.state, loading: false, userDetails: null });
  const { loading, userDetails } = state;

  console.log('PROPS: ', props);

  useEffect(() => {
    if(state.userDetails) return;
    setState({ ...state, loading: true });

    user(props.match.params.id).on('value', snapshot => 
      setState({ ...state, userDetails: snapshot.val(), loading: false, })
    );

    return () => user(props.match.params.id).off();
  }, []);

  const onSendPasswordResetEmail = () => doPasswordReset(userDetails.email);

  return (
    <div>
      <h2>User ({props.match.params.id})</h2>

      {loading && <div>Loading ...</div>}

      {userDetails && 
        <div>
          <span>
            <strong>ID:</strong> {userDetails.uid}
          </span>
          <span>
            <strong>E-Mail:</strong> {userDetails.email} </span>
          <span>
            <strong>Username:</strong> {userDetails.username}
          </span>
          <span>
            <button
              type='submit'
              onClick={onSendPasswordResetEmail}
            >
              Send Password Reset
            </button>
          </span>
        </div>
      }
    </div>
  );
};

export default AdminPage;

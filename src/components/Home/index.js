import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import { FirebaseContext } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const HomePage = () => {
  const authUser = useContext(AuthUserContext);
  const { doSendEmailVerification } = useContext(FirebaseContext);

  const onSendEmailVerification = () => doSendEmailVerification();

  if(!authUser) return <Redirect to={ROUTES.SIGN_IN} />
  console.log('AUTHENTICATED: ', authUser);

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
    }

  return (
    <div>
      <h1>Home Page</h1>

      <Messages authUser={authUser} />
    </div>
  );
};

const INITIAL_STATE = {
  loading: false,
  messages: [],
  text: '',
}

const Messages = ({ authUser }) => {
  const { messages } = useContext(FirebaseContext);
  const [state, setState] = useState(INITIAL_STATE);
  const { loading, msgs, text } = state;

  useEffect(() => {
    setState({ ...state, loading: true});

    messages().on('value', snapshot => {
      const  msgObject = snapshot.val();

      if(msgObject) {
        const msgList = Object.keys(msgObject).map(key => ({
          ...msgObject[key],
          uid: key,
        }));

        setState({ ...state, msgs: msgList, loading: false });
      } else {
        setState({ ...state, msgs: null, loading: false });
      }

    })
    return () => messages().off();
  }, [messages])

  const onChangeText = event => 
    setState({ ...state, text: event.target.value });

  const onCreateMessage = (event, authUser) => {
    event.preventDefault();
    messages().push({ text: text, userId: authUser.uid, });
    setState({ ...state, text: '', });
  }

  console.log('MESSAGE: ', messages);

  return (
    <div>
      Messages
      {loading && <div>Loading ...</div>}

      {msgs 
        ? <ul>
            {msgs.map(message => 
              <MessageItem key={message.uid} message={message} />
              )}
          </ul>
        : <div>There are no messages ...</div>
      }

      <form onSubmit={event => onCreateMessage(event, authUser)}>
        <input 
          type="text"
          value={text}
          onChange={onChangeText}
        />
        <button type='submit'>Send</button>
      </form>
    </div>
  );
};

const MessageItem = ({ message }) =>
  <li>
    <strong>{message.userId}</strong> {message.text}
  </li>

export default HomePage;

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
}

const Messages = ({ authUser }) => {
  const { messages, message, doServerValue } = useContext(FirebaseContext);
  const [state, setState] = useState(INITIAL_STATE);
  const [text, setText] = useState('');
  const { loading, msgs } = state;

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
  }, [])

  const onChangeText = event => 
    setText(event.target.value);

  const onCreateMessage = event => {
    try {
      messages().push({ 
        text: text, 
        userId: authUser.uid, 
        createdAt: doServerValue().TIMESTAMP,
      });
      
      setText('');
    } catch (error) {
      console.log(error);
    }
    event.preventDefault();
  };

  const onRemoveMessage = uid => 
    message(uid).remove();

  const onEditMessage = (mesage, text) => {
    const { uid, ...messageSnapshot } = mesage;

    message(mesage.uid).set({ 
      ...messageSnapshot, 
      text,
      editedAt: doServerValue().TIMESTAMP,
    });
  };

  return (
    <div>
      Messages
      {loading && <div>Loading ...</div>}

      <form onSubmit={event => onCreateMessage(event)}>
        <input 
          type="text"
          value={text}
          onChange={onChangeText}
        />
        <button type='submit'>Send</button>
      </form>

      {msgs 
        ? <ul>
            {msgs.map(message => 
              <MessageItem 
                key={message.uid} 
                message={message} 
                authUser={authUser}
                onEditMessage={onEditMessage}
                onRemoveMessage={onRemoveMessage}
              />
              )}
          </ul>
        : <div>There are no messages ...</div>
      }

    </div>
  );
};

const MessageItem = ({ message, authUser, onRemoveMessage, onEditMessage }) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(message.text);
  };

  const onChangeEditText = event =>
    setEditText(event.target.value);

  const onSaveEditText = () => {
    onEditMessage(message, editText);
    setEditMode(false);
  }

  return (
    <li>
      {editMode 
        ? <input 
            type='text' 
            value={editText} 
            onChange={onChangeEditText}
          />
        : <span>
            <strong>{message.userId}</strong> {message.text}
          </span>
      }

      {authUser.uid === message.userId && 
        <span>
          {editMode 
            ? <span>
                <button onClick={onSaveEditText}>Save</button>
                <button onClick={onToggleEditMode}>Reset</button>
              </span>
            : <button onClick={onToggleEditMode}>Edit</button>
          }
          {!editMode && 
            <button 
              type='button'
              onClick={() => onRemoveMessage(message.uid)}
            >Delete</button>
          }
        </span>
      }
    </li>
  );
};

export default HomePage;

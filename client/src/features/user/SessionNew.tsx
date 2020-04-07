import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import graphql from 'babel-plugin-relay/macro';

import { Input } from 'components';
import { useBaseMutation } from 'utils/useBaseMutation';

import { SessionNewSessionCreateMutation } from './__generated__/SessionNewSessionCreateMutation.graphql';

const sessionCreateMutation = graphql`
  mutation SessionNewSessionCreateMutation($input: SessionCreateInput!) {
    sessionCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`

export const SessionNew = () => {
  const alert = useAlert();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const sessionCreate = useBaseMutation<SessionNewSessionCreateMutation>(sessionCreateMutation);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sessionCreate({
      variables: { input: { username, password } },
      onCompleted: (data) => {
        console.log('data', data)
        const token = data?.sessionCreate?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      },
      onError: (error: Error) => {
        alert.show(error);
      }
    });

    return false;
  };

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <Input value={username} onChange={handleUsernameChange} />
          </label>
        </div>
        <div>
          <label>
            password
            <Input value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <Input type="submit" value="Submit" />
      </form>
    </div>
  )
};

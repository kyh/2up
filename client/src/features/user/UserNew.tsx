import React, { useState } from 'react';
import { useAlert } from 'react-alert';
import graphql from 'babel-plugin-relay/macro';

import { Input } from 'components';
import { useBaseMutation } from 'utils/useBaseMutation';

import { UserNewUserCreateMutation } from './__generated__/UserNewUserCreateMutation.graphql';

const userCreateMutation = graphql`
  mutation UserNewUserCreateMutation($input: UserCreateInput!) {
    userCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`

export const UserNew = () => {
  const alert = useAlert();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const userCreate = useBaseMutation<UserNewUserCreateMutation>(userCreateMutation);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    userCreate({
      variables: { input: { username, email, password } },
      onCompleted: (data) => {
        console.log('data', data)
        const token = data?.userCreate?.token;
        if (token) {
          localStorage.setItem('token', token);
        }
      },
      onError: (error: Error) => {
        alert.show(error);
      }
    })

    return false;
  };

  return (
    <div>
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <Input value={username} onChange={handleUsernameChange} />
          </label>
        </div>
        <div>
          <label>
            email
            <Input value={email} onChange={handleEmailChange} />
          </label>
        </div>
        <div>
          <label>
            password
            <Input type="password" value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <Input type="submit" value="Submit" />
      </form>
    </div>
  )
};

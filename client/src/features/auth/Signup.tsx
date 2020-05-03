import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { PageContainer, Input, Button } from "components";

import { SignupUserCreateMutation } from "./__generated__/SignupUserCreateMutation";

const USER_CREATE = gql`
  mutation SignupUserCreateMutation($input: UserCreateInput!) {
    userCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`;

const Signup = ({ history }: RouteComponentProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userCreate] = useMutation<SignupUserCreateMutation>(USER_CREATE);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data } = await userCreate({
      variables: { input: { username, email, password } },
    });

    const token = data?.userCreate?.token;
    if (token) {
      localStorage.setItem("token", token);
      history.push(`/${username}`);
    }

    return false;
  };

  return (
    <PageContainer size="large">
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
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <Button type="submit">Sign up</Button>
      </form>
    </PageContainer>
  );
};

export const SignupPage = withRouter(Signup);

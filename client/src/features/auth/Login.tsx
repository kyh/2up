import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { PageContainer, Input, Button } from "components";

import { LoginSessionCreateMutation } from "./__generated__/LoginSessionCreateMutation";

const SESSION_CREATE = gql`
  mutation LoginSessionCreateMutation($input: SessionCreateInput!) {
    sessionCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`;

export const Login = ({ history }: RouteComponentProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [sessionCreate] = useMutation<LoginSessionCreateMutation>(
    SESSION_CREATE
  );

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data } = await sessionCreate({
      variables: { input: { username, password } },
    });

    const token = data?.sessionCreate?.token;

    if (token) {
      localStorage.setItem("token", token);
      history.push(`/${username}`);
    }

    return false;
  };

  return (
    <PageContainer size="large">
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
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
        </div>
        <Button type="submit">Log in</Button>
      </form>
    </PageContainer>
  );
};

export const LoginPage = withRouter(Login);

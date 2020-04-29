import React, { useState } from "react";
import { useAlert } from "react-alert";
import graphql from "babel-plugin-relay/macro";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { PageContainer, Input, Button } from "components";
import { useMutation } from "utils/useMutation";

import { LoginSessionCreateMutation } from "./__generated__/LoginSessionCreateMutation.graphql";

const sessionCreateMutation = graphql`
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
  const alert = useAlert();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [sessionCreate, isCreatingSession] = useMutation<
    LoginSessionCreateMutation
  >(sessionCreateMutation);

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
        const token = data?.sessionCreate?.token;
        if (token) {
          localStorage.setItem("token", token);
          history.push(`/${username}`);
        }
      },
      onError: (error: Error) => {
        alert.show(error.message);
      },
    });

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
        <Button type="submit" disabled={isCreatingSession}>
          Log in
        </Button>
      </form>
    </PageContainer>
  );
};

export const LoginPage = withRouter(Login);

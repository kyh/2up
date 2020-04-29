import React, { useState } from "react";
import { useAlert } from "react-alert";
import graphql from "babel-plugin-relay/macro";
import { withRouter, RouteComponentProps } from "react-router-dom";

import { PageContainer, Input, Button } from "components";
import { useMutation } from "utils/useMutation";

import { SignupUserCreateMutation } from "./__generated__/SignupUserCreateMutation.graphql";

const userCreateMutation = graphql`
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
  const alert = useAlert();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [userCreate, isCreatingUser] = useMutation<SignupUserCreateMutation>(
    userCreateMutation
  );

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
        const token = data?.userCreate?.token;
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
        <Button type="submit" disabled={isCreatingUser}>
          Sign up
        </Button>
      </form>
    </PageContainer>
  );
};

export const SignupPage = withRouter(Signup);

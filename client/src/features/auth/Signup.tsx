import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import { PageContainer, Input, Button, Box } from "components";

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
      <div>
        <Box textAlign="center">
          <h1>Sign up</h1>
        </Box>
        <form onSubmit={handleSubmit}>
          <Box>
            <div>
              <label>username</label>
            </div>
            <Input value={username} onChange={handleUsernameChange} />
          </Box>
          <Box>
            <div>
              <label>email</label>
            </div>
            <Input value={email} onChange={handleEmailChange} />
          </Box>
          <Box>
            <div>
              <label>password</label>
            </div>
            <Input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Box>
          <Box mt="5px" display="flex" justifyContent="flex-end">
            <Button type="submit">Sign up</Button>
          </Box>
        </form>
      </div>
    </PageContainer>
  );
};

export const SignupPage = withRouter(Signup);

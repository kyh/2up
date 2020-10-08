import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";

import { PageContainer, TextField, Button, Card } from "components";

import { SignupUserCreateMutation } from "./__generated__/SignupUserCreateMutation";
import { LoginSessionCreateMutation } from "./__generated__/LoginSessionCreateMutation";

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

export type AuthInputs = {
  username: string;
  email: string;
  password: string;
};

export const AuthPage: React.FC<{ isLogin?: boolean }> = ({ isLogin }) => {
  const alert = useAlert();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<AuthInputs>();

  const [userCreate, { loading: userCreateLoading }] = useMutation<
    SignupUserCreateMutation
  >(USER_CREATE);
  const [sessionCreate, { loading: sessionCreateLoading }] = useMutation<
    LoginSessionCreateMutation
  >(SESSION_CREATE);

  const onSubmit = async ({ username, email, password }: AuthInputs) => {
    try {
      const action = isLogin ? sessionCreate : userCreate;
      const responseKey = isLogin ? "sessionCreate" : "userCreate";

      const { data } = await action({
        variables: { input: { username, email, password } },
      });

      if (data) {
        // @ts-ignore
        const token = data[responseKey].token;
        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        history.push(`/${username}`);
      }
    } catch (error) {
      alert.show(error.message);
    }
  };

  return (
    <Page isLogin={isLogin}>
      <FormContainer>
        <h1 className="title">{isLogin ? "Login" : "Sign up"}</h1>
        <Card background>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="username"
              name="username"
              labelText="Username"
              placeholder="Lil Jon Snow"
              ref={register({ required: true })}
              error={!!errors.username}
              errorText="Username is required"
            />
            {!isLogin && (
              <TextField
                labelText="Email"
                id="email"
                name="email"
                type="email"
                placeholder="player@playhouse.gg"
                ref={register({ required: true })}
                error={!!errors.email}
                errorText="Email is required"
              />
            )}
            <TextField
              labelText="Password"
              id="password"
              name="password"
              type="password"
              placeholder="Super secret password"
              ref={register({ required: true })}
              error={!!errors.password}
              errorText="Password is required"
            />
            <Button
              className="submit"
              type="submit"
              fullWidth
              disabled={userCreateLoading || sessionCreateLoading}
            >
              {isLogin ? "Login" : "Sign up"}
            </Button>
          </form>
        </Card>
      </FormContainer>
    </Page>
  );
};

const Page = styled(PageContainer)<{ isLogin?: boolean }>`
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.ui.backgroundGrey};
  background-repeat: no-repeat;
  ${({ isLogin }) =>
    isLogin
      ? `
    background-image: url('/illustrations/krown-kitty.svg');
    background-position: 23% 93%;
  `
      : `
    background-image: url('/illustrations/unicorn-ice-cream.svg');
    background-position: 78% 104%;
  `}
`;

const FormContainer = styled.section`
  transform: translateY(-50px);
  .title {
    text-align: center;
  }
  .submit {
    margin-top: ${({ theme }) => theme.spacings(4)};
  }
`;

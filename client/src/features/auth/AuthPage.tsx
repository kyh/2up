import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";

import { PageContainer, Input, Button, Card } from "components";

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
    <Page>
      <FormContainer>
        <h1 className="title">{isLogin ? "Login" : "Sign up"}</h1>
        <CardContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Field>
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                name="username"
                placeholder="Lil Jon Snow"
                ref={register({ required: true })}
              />
              {errors.username && (
                <div className="error">Username is required</div>
              )}
            </Field>
            {!isLogin && (
              <Field>
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  name="email"
                  placeholder="player@playhouse.gg"
                  ref={register({ required: true })}
                />
                {errors.email && <div className="error">Email is required</div>}
              </Field>
            )}
            <Field>
              <label htmlFor="password">Password</label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Super secret password"
                ref={register({ required: true })}
              />
              {errors.password && (
                <div className="error">Password is required</div>
              )}
            </Field>
            <Button
              className="submit"
              type="submit"
              fullWidth
              disabled={userCreateLoading || sessionCreateLoading}
            >
              {isLogin ? "Login" : "Sign up"}
            </Button>
          </form>
        </CardContainer>
      </FormContainer>
    </Page>
  );
};

const Page = styled(PageContainer)`
  align-items: center;
  height: 100vh;
  background: ${({ theme }) => theme.ui.backgroundGrey};
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

const CardContainer = styled(Card)`
  background: ${({ theme }) => theme.ui.background};
`;

const Field = styled.fieldset`
  .error {
    color: ${({ theme }) => theme.colors.red};
  }
`;

import { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { theme } from "styles/theme";
import { PageContainer, TextField, Button, Card } from "components";

type FormInputs = {
  email: string;
  idea: string;
};

const url = `${process.env.REACT_APP_SHEETS_ENDPOINT}?tabId=Sheet1&api_key=${process.env.REACT_APP_SHEETS_API_KEY}`;

const signup = (email: string, idea: string) => {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify([[email, idea]]),
  });
};

export const RequestPage = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  const onSubmit = async ({ email, idea }: FormInputs) => {
    setIsLoading(true);
    try {
      await signup(email, idea);
      setIsComplete(true);
    } catch (e) {
      console.error(e);
      setIsComplete(false);
    }
    setIsLoading(false);
  };

  return (
    <Page size="full">
      <Container>
        <h1 className="title">🎉 Welcome!</h1>
        <p>
          Interested in building your own Packs? Join our Pack Creator beta
          program to build, test, and play your own games.
        </p>
        <Card background>
          {isComplete ? (
            <div>
              Thanks for your interest! We'll be distributing logins soon
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                id="email"
                labelText="Email"
                placeholder="beta-tester@playhouse.gg"
                error={!!errors.email}
                errorText="This field is required"
                fullWidth
                {...register("email", { required: true })}
              />
              <TextField
                id="idea"
                labelText="Got a pack idea?"
                placeholder="Who's that Pokemon?"
                fullWidth
                {...register("idea")}
              />
              <Button
                className="submit"
                type="submit"
                fullWidth
                disabled={isLoading}
              >
                Request Invite
              </Button>
            </form>
          )}
        </Card>
        <p className="sub">
          You can also find us on{" "}
          <a
            href="https://discord.gg/YtafKzR"
            target="_blank"
            rel="noopener noreferrer"
          >
            Discord
          </a>
        </p>
      </Container>
    </Page>
  );
};

const Page = styled(PageContainer)<{ isLogin?: boolean }>`
  align-items: center;
  height: 100vh;
  background: ${theme.ui.backgroundGrey};
  background-repeat: no-repeat;
  background-image: url("/illustrations/kitty-glasses.svg");
  background-position: 78% 102%;
`;

const Container = styled.section`
  max-width: 500px;
  margin: 0 auto;
  transform: translateY(-70px);
  .title {
    text-align: center;
    margin-bottom: ${theme.spacings(5)};
  }
  .submit {
    margin-top: ${theme.spacings(4)};
  }
  .sub {
    margin-top: ${theme.spacings(2)};
    text-align: center;
  }
  a {
    text-decoration: underline;
  }
`;

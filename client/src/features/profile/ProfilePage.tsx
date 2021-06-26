import { useState } from "react";
import styled from "styled-components";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAlert } from "react-alert";
import { theme } from "styles/theme";
import { ButtonLinkNative } from "components";
import { Navigation } from "features/packs/components/Navigation";
import { Page, Content } from "features/packs/components/Page";
import { PackSection } from "features/packs/components/Packs";
import { Modal, TextField, Button } from "components";
import { ProfilePageUserQuery } from "./__generated__/ProfilePageUserQuery";
import { ProfilePageUserUpdateMutation } from "./__generated__/ProfilePageUserUpdateMutation";

type FormInputs = {
  username: string;
  email: string;
  password: string;
};

export const ProfilePage = () => {
  const alert = useAlert();
  const { username } = useParams<{ username: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data } = useQuery<ProfilePageUserQuery>(USER_QUERY, {
    variables: { username: username || "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  const [
    userUpdate,
    { loading: userCreateLoading },
  ] = useMutation<ProfilePageUserUpdateMutation>(USER_UPDATE);

  if (!data) {
    return null;
  }

  const isMyPage = data?.currentUser?.username === username;

  const onSubmit = async ({ username, email, password }: FormInputs) => {
    try {
      userUpdate({
        variables: {
          input: { username, email, password },
        },
      });
    } catch (error) {
      alert.show(error.message);
    }
  };

  return (
    <Page>
      <Navigation />
      <Content>
        <ProfileContent>
          <header className="profile-header">
            <h1>@{username}'s packs</h1>
            <button onClick={() => setIsModalOpen(true)}>Edit</button>
            {isMyPage && (
              <ButtonLinkNative to="/packs/new">
                Create new Pack
              </ButtonLinkNative>
            )}
          </header>
          <PackSection>
            <div className="pack-items">
              {data.packs?.edges?.map((edge) => {
                const pack = edge?.node;
                if (!pack) return null;

                return (
                  <div key={pack.id} className="pack-item">
                    <Link to={`/packs/${pack.id}`}>
                      <article>
                        <h2>{pack.name}</h2>
                        <p>{pack.description}</p>
                      </article>
                    </Link>
                    {isMyPage && (
                      <div className="edit-pack-footer">
                        <ButtonLinkNative to={`/packs/${pack.id}/edit`}>
                          Edit Pack
                        </ButtonLinkNative>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </PackSection>
        </ProfileContent>
        <Modal open={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              id="username"
              {...register("username", { required: true })}
              labelText="Username"
              placeholder="Lil Jon Snow"
              error={!!errors.username}
            />
            <TextField
              labelText="Email"
              id="email"
              {...register("email", { required: true })}
              type="email"
              placeholder="player@playhouse.gg"
              error={!!errors.email}
            />
            <TextField
              labelText="Password"
              id="password"
              {...register("password", { required: true })}
              type="password"
              placeholder="Super secret password"
              error={!!errors.password}
              autoComplete="on"
            />
            <Button className="submit" type="submit" fullWidth>
              Update
            </Button>
          </form>
        </Modal>
      </Content>
    </Page>
  );
};

const USER_QUERY = gql`
  query ProfilePageUserQuery($username: String!) {
    currentUser {
      username
      email
    }
    packs(first: 100, username: $username) {
      edges {
        node {
          id
          name
          imageUrl
          description
        }
      }
    }
  }
`;

const USER_UPDATE = gql`
  mutation ProfilePageUserUpdateMutation($input: UserUpdateInput!) {
    userUpdate(input: $input) {
      user {
        username
        email
      }
    }
  }
`;

const ProfileContent = styled.section`
  .profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${theme.spacings(5)};
  }
`;

import styled from "styled-components";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { theme } from "styles/theme";
import { NavigationCurrentUserQuery } from "./__generated__/NavigationCurrentUserQuery";

export const Navigation = () => {
  const { data } = useQuery<NavigationCurrentUserQuery>(CURRENT_USER);

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  };

  return (
    <NavigationContainer>
      <div className="left">
        <Link to="/packs">
          <img className="logo" src="/logo/logomark.svg" alt="Playhouse" />
        </Link>
      </div>
      <div className="right end">
        {data?.currentUser?.username ? (
          <>
            <Link to="/">Play</Link>
            <Link to={`/${data?.currentUser?.username}`}>Profile</Link>
            <Link to="/packs" onClick={onLogout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/">Play</Link>
            <Link to="/auth/signup">Sign Up</Link>
            <Link to="/auth/login">Login</Link>
          </>
        )}
      </div>
    </NavigationContainer>
  );
};

const CURRENT_USER = gql`
  query NavigationCurrentUserQuery {
    currentUser {
      username
    }
  }
`;

export const NavigationContainer = styled.header`
  display: flex;
  grid-area: header;
  background: ${theme.ui.background};
  border-bottom: 1px solid ${theme.ui.backgroundInverse};
  .logo {
    height: 35px;
  }
  .left {
    display: flex;
    align-items: center;
    border-right: 1px solid transparent;
    padding-left: ${theme.spacings(3)};
    ${theme.breakpoints.desktop} {
      width: 345px;
    }
  }
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: auto;
    padding: 0 ${theme.spacings(3)};
    &.end {
      justify-content: flex-end;
      > a {
        padding: ${theme.spacings(3)};
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .pack-title {
    margin: 0;
  }
`;

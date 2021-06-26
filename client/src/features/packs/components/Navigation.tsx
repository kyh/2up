import styled from "styled-components";
import { Link } from "react-router-dom";
import { theme } from "styles/theme";
import { useAuth } from "utils/AuthProvider";

export const Navigation = () => {
  const auth = useAuth();
  return (
    <NavigationContainer>
      <div className="left">
        <Link to="/packs">
          <img
            className="logo"
            src="/logo/logomark.svg"
            alt="Playhouse"
            height="35"
          />
        </Link>
      </div>
      <div className="right end">
        {auth.user?.username ? (
          <>
            <Link to="/">Play</Link>
            <Link to={`/@${auth.user?.username}`}>Profile</Link>
            <Link to="/packs" onClick={auth.signout}>
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

export const NavigationContainer = styled.header`
  display: flex;
  grid-area: header;
  background: ${theme.ui.background};
  border-bottom: 1px solid ${theme.ui.borderColor};
  .left {
    display: flex;
    align-items: center;
    padding-left: ${theme.spacings(3)};
    ${theme.breakpoints.desktop} {
      width: 215px;
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

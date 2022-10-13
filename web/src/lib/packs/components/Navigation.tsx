import styled from "styled-components";
import Image from "next/future/image";
import { Link } from "~/components";
import { theme } from "~/styles/theme";
import { useAuth } from "~/lib/auth/useAuth";

export const Navigation = () => {
  const auth = useAuth();
  return (
    <NavigationContainer>
      <div className="left">
        <Link href="/packs">
          <Image
            className="logo"
            src="/logo/logomark.svg"
            alt="Trifles"
            height="35"
            width="35"
          />
        </Link>
      </div>
      {!auth.loading && (
        <div className="right end">
          {auth.user ? (
            <>
              <Link href="/">Play</Link>
              <Link href={`/u/${auth.user.user_metadata.username}`}>
                Profile
              </Link>
              <button type="button" onClick={auth.signOut}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/">Play</Link>
              <Link href="/auth/request">Sign Up</Link>
              <Link href="/auth/login">Login</Link>
            </>
          )}
        </div>
      )}
    </NavigationContainer>
  );
};

export const NavigationContainer = styled.nav`
  display: flex;
  background: ${theme.ui.background};
  border-bottom: 1px solid ${theme.ui.borderColor};
  height: 50px;
  grid-area: header;

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

      > a,
      button {
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

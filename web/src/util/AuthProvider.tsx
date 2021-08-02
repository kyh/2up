import {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { useAlert } from "react-alert";
import { localStorage } from "util/window";
import { CurrentUserQuery } from "./__generated__/CurrentUserQuery";
import { UserCreateMutation } from "./__generated__/UserCreateMutation";
import { SessionCreateMutation } from "./__generated__/SessionCreateMutation";

type ContextProps = {
  user: CurrentUserQuery["currentUser"] | undefined;
  signup: (username: string, email: string, password: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signinWithProvider: (_name: "google" | "facebook") => Promise<void>;
  signout: () => Promise<void>;
  sendPasswordResetEmail: (_email: string) => Promise<void>;
  confirmPasswordReset: (_password: string, _code: string) => Promise<void>;
  updateEmail: (_email: string) => Promise<void>;
  updatePassword: (_password: string) => Promise<void>;
  updateProfile: (data: Object) => Promise<void>;
};

const AuthContext = createContext<Partial<ContextProps>>({});

type Props = {
  children: ReactNode;
};

// Context Provider component that wraps your app and makes auth object
// available to any child component that calls the useAuth() hook.
export const AuthProvider = ({ children }: Props) => {
  const auth = useAuthProvider();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider hook that creates auth object and handles state
const useAuthProvider = () => {
  const { data } = useQuery<CurrentUserQuery>(CURRENT_USER);
  const [userCreate] = useMutation<UserCreateMutation>(USER_CREATE);
  const [sessionCreate] = useMutation<SessionCreateMutation>(SESSION_CREATE);
  const [user, setUser] = useState(data?.currentUser);
  const alert = useAlert();
  const router = useRouter();

  // Handle response from authentication functions
  const handleAuth = async (
    token: string,
    user: CurrentUserQuery["currentUser"]
  ) => {
    localStorage.setItem("token", token);
    if (user) {
      router.push(`/u/${user.username}`);
      setUser(user);
    }
  };

  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      try {
        const { data } = await userCreate({
          variables: { input: { username, email, password } },
        });
        if (data && data.userCreate) {
          handleAuth(data.userCreate.token, data.userCreate.user);
        }
      } catch (error) {
        alert.show(error.message);
      }
    },
    []
  );

  const signin = useCallback(async (username: string, password: string) => {
    try {
      const { data } = await sessionCreate({
        variables: { input: { username, password } },
      });
      if (data && data.sessionCreate) {
        handleAuth(data.sessionCreate.token, data.sessionCreate.user);
      }
    } catch (error) {
      alert.show(error.message);
    }
  }, []);

  const signinWithProvider = useCallback(
    async (_name: "google" | "facebook") => {
      // return fakeAuth
      //   .signinWithProvider(name)
      //   .then((response) => handleAuth(response.user));
    },
    []
  );

  const signout = useCallback(async () => {
    localStorage.removeItem("token");
    router.reload();
  }, []);

  const sendPasswordResetEmail = useCallback(async (_email: string) => {
    // return fakeAuth.sendPasswordResetEmail(email);
  }, []);

  const confirmPasswordReset = useCallback(
    async (_password: string, _code: string) => {
      // return fakeAuth.confirmPasswordReset(password, code);
    },
    []
  );

  const updateEmail = useCallback(async (_email: string) => {
    // return fakeAuth.updateEmail(email).then((rawUser) => {
    //   setUser(rawUser);
    // });
  }, []);

  const updatePassword = useCallback(async (_password: string) => {
    // return fakeAuth.updatePassword(password);
  }, []);

  // Update auth user and persist to database (including any custom values in data)
  // Forms can call this function instead of multiple auth/db update functions
  const updateProfile = useCallback(async (_data = {}) => {
    // const { email, name, picture } = data;
    // // Update auth email
    // if (email) {
    //   await fakeAuth.updateEmail(email);
    // }
    // // Update auth profile fields
    // if (name || picture) {
    //   let fields = {};
    //   if (name) fields.name = name;
    //   if (picture) fields.picture = picture;
    //   await fakeAuth.updateProfile(fields);
    // }
    // // Persist all data to the database
    // await updateUser(user.uid, data);
    // // Update user in state
    // const currentUser = await fakeAuth.getCurrentUser();
    // setUser(currentUser);
  }, []);

  useEffect(() => {
    if (data?.currentUser && data?.currentUser?.username !== user?.username) {
      setUser(data?.currentUser);
    }
  }, [data?.currentUser?.username]);

  return {
    user,
    signup,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    updateEmail,
    updatePassword,
    updateProfile,
  };
};

const CURRENT_USER = gql`
  query CurrentUserQuery {
    currentUser {
      username
    }
  }
`;

const USER_CREATE = gql`
  mutation UserCreateMutation($input: UserCreateInput!) {
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
  mutation SessionCreateMutation($input: SessionCreateInput!) {
    sessionCreate(input: $input) {
      user {
        username
        email
      }
      token
    }
  }
`;

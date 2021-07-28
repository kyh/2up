import type { AppProps } from "next/app";
import type { NextPage } from "next";
import { ComponentType, ReactElement, ReactNode, Fragment } from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "util/AuthProvider";
import { SocketProvider } from "util/SocketProvider";
import { StyleProvider } from "styles/global";
import { Provider as AlertProvider, transitions, positions } from "react-alert";
import { ReactAlertTemplate } from "components";

import { store } from "util/store";
import { client } from "util/apollo";

// import "util/analytics";

const alertOptions = {
  position: positions.TOP_CENTER,
  transition: transitions.SCALE,
  timeout: 8000,
};

type Page<P = {}> = NextPage<P> & {
  // You can disable whichever you don't need
  getLayout?: (page: ReactElement) => ReactNode;
  Layout?: ComponentType;
};

type Props = AppProps & {
  Component: Page;
};

const MyApp = ({ Component, pageProps }: Props) => {
  const Layout = Component.Layout ? Component.Layout : Fragment;
  return (
    <ReduxProvider store={store}>
      <SocketProvider wsUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/socket`}>
        <ApolloProvider client={client}>
          <AlertProvider template={ReactAlertTemplate} {...alertOptions}>
            <AuthProvider>
              <StyleProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </StyleProvider>
            </AuthProvider>
          </AlertProvider>
        </ApolloProvider>
      </SocketProvider>
    </ReduxProvider>
  );
};

export default MyApp;

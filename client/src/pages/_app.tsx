import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Router from "next/router";
import { ReactElement, ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "util/AuthProvider";
import { SocketProvider } from "util/SocketProvider";
import { StyleProvider } from "styles/global";
import { Provider as AlertProvider, transitions, positions } from "react-alert";
import { ProgressBar, ReactAlertTemplate } from "components";

import { store } from "util/store";
import { client } from "util/apollo";

// import "util/analytics";

const progress = new ProgressBar();

const alertOptions = {
  position: positions.TOP_CENTER,
  transition: transitions.SCALE,
  timeout: 8000,
};

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

const MyApp = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <SocketProvider wsUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/socket`}>
          <StyleProvider>
            <AlertProvider template={ReactAlertTemplate} {...alertOptions}>
              <AuthProvider>
                {getLayout(<Component {...pageProps} />)}
              </AuthProvider>
            </AlertProvider>
          </StyleProvider>
        </SocketProvider>
      </ApolloProvider>
    </ReduxProvider>
  );
};

export default MyApp;

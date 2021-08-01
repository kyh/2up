import type { AppProps, NextWebVitalsMetric } from "next/app";
import type { NextPage } from "next";
import Router from "next/router";
import { ReactElement, ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import { AuthProvider } from "util/AuthProvider";
import { SocketProvider } from "util/SocketProvider";
import { StyleProvider } from "styles/global";
import { Provider as AlertProvider } from "react-alert";
import { ProgressBar, ReactAlertTemplate } from "components";

import { store } from "util/store";
import { client } from "util/apollo";
import { logPageView, logEvent } from "util/analytics";

const progress = new ProgressBar();

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeError", progress.finish);
Router.events.on("routeChangeComplete", (url) => {
  logPageView(url);
  progress.finish();
});

export const reportWebVitals = ({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) => {
  logEvent({
    action: name,
    category: label === "web-vital" ? "Web Vitals" : "Custom metric",
    value: Math.round(name === "CLS" ? value * 1000 : value),
    label: id,
    nonInteraction: true,
  });
};

const MyApp = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ReduxProvider store={store}>
      <ApolloProvider client={client}>
        <SocketProvider wsUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/socket`}>
          <StyleProvider>
            <AlertProvider
              template={ReactAlertTemplate}
              containerStyle={{ pointerEvents: "auto" }}
              position="top center"
              transition="scale"
              timeout={8000}
            >
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

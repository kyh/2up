import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Router from "next/router";
import { ReactElement, ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider as ReduxProvider } from "react-redux";
import { SocketProvider } from "util/SocketProvider";
import { trpc } from "util/trpc";
import { StyleProvider } from "styles/global";
import { AlertProvider, ProgressBar } from "components";

import { store } from "util/store";

const progress = new ProgressBar();

type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
};

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeError", progress.finish);
Router.events.on("routeChangeComplete", progress.finish);

const MyApp = ({ Component, pageProps }: Props) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      <ReduxProvider store={store}>
        <SocketProvider wsUrl={`${process.env.NEXT_PUBLIC_SOCKET_URL}/socket`}>
          <StyleProvider>
            <AlertProvider>
              {getLayout(<Component {...pageProps} />)}
            </AlertProvider>
          </StyleProvider>
        </SocketProvider>
      </ReduxProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

import type { AppProps } from "next/app";
import type { NextPage } from "next";
import Router from "next/router";
import { ReactElement, ReactNode } from "react";
import { UserProvider } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Provider as ReduxProvider } from "react-redux";
import { trpc } from "~/utils/trpc";
import { StyleProvider } from "~/styles/global";
import { AlertProvider, ProgressBar } from "~/components";

import { store } from "~/utils/store";

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
    <UserProvider supabaseClient={supabaseClient}>
      <ReduxProvider store={store}>
        <StyleProvider>
          <AlertProvider>
            {getLayout(<Component {...pageProps} />)}
          </AlertProvider>
        </StyleProvider>
      </ReduxProvider>
    </UserProvider>
  );
};

export default trpc.withTRPC(MyApp);

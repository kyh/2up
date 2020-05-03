import React from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/react-hooks";
import { Provider as ReduxProvider } from "react-redux";
import { SocketProvider } from "utils/Socket";
import { BrowserRouter } from "react-router-dom";

import { debounce } from "lodash";
import { store } from "app/store";
import { client } from "app/apollo";
import * as serviceWorker from "./serviceWorker";

const onResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

const debouncedResize = debounce(onResize, 100);
window.addEventListener("resize", debouncedResize);
onResize();

const render = () => {
  const { App } = require("./app/App");

  ReactDOM.render(
    <BrowserRouter>
      <ReduxProvider store={store}>
        <SocketProvider wsUrl={`${process.env.REACT_APP_SOCKET_URL}/socket`}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </SocketProvider>
      </ReduxProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (process.env.NODE_ENV === "development" && module.hot) {
  module.hot.accept("./app/App", render);
}

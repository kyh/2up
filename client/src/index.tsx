import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { ApolloProvider } from "@apollo/client";
import { Provider as ReduxProvider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "utils/SocketProvider";

import { store } from "app/store";
import { client } from "app/apollo";

import { App } from "./app/App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <ReduxProvider store={store}>
        <SocketProvider wsUrl={`${process.env.REACT_APP_SOCKET_URL}/socket`}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </SocketProvider>
      </ReduxProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

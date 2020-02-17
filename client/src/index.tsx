import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { SocketProvider } from 'use-phoenix-channel';
import { debounce } from 'lodash';

import { App } from 'pages/App';
import { theme } from 'styles/theme';
import { GlobalStyle } from 'styles/global';

import * as serviceWorker from './serviceWorker';

const onResize = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

const debouncedResize = debounce(onResize, 100);
window.addEventListener('resize', debouncedResize);
onResize();

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <SocketProvider wsUrl={`${process.env.REACT_APP_SOCKET_URL}/socket`}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SocketProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

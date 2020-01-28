import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { SocketProvider } from 'use-phoenix-channel';
import { Header, Button } from 'components';
import { TV } from 'pages/TV';
import { Remote } from 'pages/Remote';

export const App: React.FC = () => {
  return (
    <SocketProvider wsUrl="ws://localhost:4000/socket">
      <Router>
        <Header>Hello world</Header>
        <Button>Add Friend</Button>
        <ul>
          <li>
            <Link to="/">TV</Link>
          </li>
          <li>
            <Link to="/remote">Remote</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path="/">
            <TV />
          </Route>
          <Route path="/remote">
            <Remote />
          </Route>
        </Switch>
      </Router>
    </SocketProvider>
  );
};

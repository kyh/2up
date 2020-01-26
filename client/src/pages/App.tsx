import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Header, Button } from 'components';
import { TV } from 'pages/TV';
import { Remote } from 'pages/Remote';

export const App: React.FC = () => {
  return (
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
  );
};

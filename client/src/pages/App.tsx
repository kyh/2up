import React, { useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { PageContainer } from 'components';
import { Flex, Button, Input } from 'components';

import { TriviaPages } from './Trivia';

export const App: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/">
        <PageContainer>
          <AppIntro />
        </PageContainer>
      </Route>
      <TriviaPages />
    </Switch>
  );
};

const AppIntro = () => {
  const history = useHistory();
  const [name, setName] = useState(localStorage.getItem('name') || '');

  const onClickStart = () => {
    localStorage.setItem('name', name);
    history.push('/trivia');
  };

  return (
    <Flex alignItems="center" flexDirection="column" mt={3}>
      <Input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <Button onClick={onClickStart}>Start</Button>
    </Flex>
  );
};

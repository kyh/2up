import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from 'components';
import { UserNew } from 'features/user/UserNew';
import { SessionNew } from 'features/user/SessionNew';

export const Enter = () => {
  const [isSignup, setIsSignup] = useState(true);

  const renderContent = () => {
    return isSignup ? (
      <UserNew />
    ) : (
      <SessionNew />
    )
  }

  return (
    <EnterLayout>
      <div>
        <Button onClick={() => setIsSignup(false)}>Login</Button>
        <Button onClick={() => setIsSignup(true)}>Signup</Button>
      </div>
      {renderContent()}
    </EnterLayout>
  )
};

const EnterLayout = styled.div`
  width :200px;
`;

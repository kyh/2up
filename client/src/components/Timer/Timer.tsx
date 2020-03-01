import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import raw from 'raw.macro';

type Props = {
  initialSeconds: number;
  onTimeout?: () => void;
};

const snail = raw('./snail.svg');

export const Timer: React.FC<Props> = ({
  initialSeconds,
  onTimeout = () => {}
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds !== 1) {
        setSeconds(seconds => seconds - 1);
      } else {
        onTimeout();
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return ReactDOM.createPortal(
    <TimerContainer initialSeconds={initialSeconds}>
      <Snail dangerouslySetInnerHTML={{ __html: snail }} />
      <div>{seconds} seconds remaining</div>
    </TimerContainer>,
    document.body
  );
};

const scaleAnimation = keyframes`
  0% { transform: scaleX(1); }
  50% { transform: scaleX(0.95); }
  100% { transform: scaleX(1); }
`;

const eyeAnimation = keyframes`
  0% { transform: translate(0); }
  50% { transform: translate(3px, 0); }
  100% { transform: translate(0); }
`;

const moveAnimation = keyframes`
  from { transform: translate(100vw) }
  to { transform: translate(0vw) }
`;

const Snail = styled.div`
  .right-eye {
    animation: ${eyeAnimation} 1s ease infinite;
    animation-delay: 0.1s;
  }
  .body {
    animation: ${scaleAnimation} 1s ease infinite;
    animation-delay: 0.1s;
  }
  .shell {
    animation: ${scaleAnimation} 1s ease infinite;
  }
`;

const TimerContainer = styled.div<{ initialSeconds: number }>`
  position: absolute;
  bottom: 20px;
  left: 0;
  animation: ${moveAnimation} ${({ initialSeconds }) => initialSeconds}s linear
    infinite;
  animation-iteration-count: 1;
`;

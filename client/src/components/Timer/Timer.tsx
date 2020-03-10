import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import raw from 'raw.macro';
import dust from './dust.svg';

type Props = {
  initialSeconds?: number;
  shouldCallTimeout?: boolean;
  onTimeout?: () => void;
};

const snail = raw('./snail.svg');

export const Timer: React.FC<Props> = ({
  initialSeconds = 45,
  shouldCallTimeout = true,
  onTimeout = () => {}
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds !== 1) {
        setSeconds(seconds => seconds - 1);
      } else {
        if (shouldCallTimeout) {
          onTimeout();
        }
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds]);

  return ReactDOM.createPortal(
    <Container>
      <TimerContainer initialSeconds={initialSeconds}>
        <SnailContainer>
          <Snail dangerouslySetInnerHTML={{ __html: snail }} />
          <Dust />
        </SnailContainer>
        <TimerText>{seconds} seconds remaining</TimerText>
      </TimerContainer>
    </Container>,
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

const dustAnimation = keyframes`
  100% {
    background-position-x: right;
  }
`;

const Container = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  overflow: hidden;
`;

const TimerContainer = styled.div<{ initialSeconds: number }>`
  animation: ${moveAnimation} ${({ initialSeconds }) => initialSeconds}s linear
    infinite;
  animation-iteration-count: 1;
`;

const SnailContainer = styled.div`
  display: flex;
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

const Dust = styled.div`
  width: 197px;
  height: 66px;
  background-image: url('${dust}');
  background-size: 5910px 67px;
  animation-name: ${dustAnimation};
  animation-duration: 1s;
  animation-timing-function: steps(29);
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  transform: translate(-20px, 10px);
`;

const TimerText = styled.div``;

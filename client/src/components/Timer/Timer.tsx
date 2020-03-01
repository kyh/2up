import React, { useEffect, useState } from 'react';

type Props = {
  initialSeconds: number;
  onTimeout?: () => void;
};

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

  return <div>{seconds} seconds remaining</div>;
};

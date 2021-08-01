import styled from "styled-components";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Icon } from "../Icon/Icon";

export const AudioPlayer = (props: any) => {
  return (
    <StyledAudioPlayer
      className="audio-player"
      customIcons={{
        play: <Icon icon="play" />,
        pause: <Icon icon="pause" />,
        rewind: <Icon icon="rewind" />,
        forward: <Icon icon="forward" />,
        previous: <Icon icon="previous" />,
        next: <Icon icon="next" />,
        loop: <Icon icon="loop" />,
        loopOff: <Icon icon="loopOff" />,
        volume: <Icon icon="volume" size={20} />,
        volumeMute: <Icon icon="volumeMute" size={20} />,
      }}
      {...props}
    />
  );
};

const StyledAudioPlayer = styled(ReactAudioPlayer)`
  min-width: 320px;
  box-shadow: none;
`;

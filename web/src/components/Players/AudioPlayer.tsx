import { classed } from "@tw-classed/react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Icon } from "../Icon/Icon";
import React from "react";

export const AudioPlayer = (
  props: React.ComponentProps<typeof ReactAudioPlayer>
) => {
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

const StyledAudioPlayer = classed(ReactAudioPlayer, "min-w-[320px] shadow-none");

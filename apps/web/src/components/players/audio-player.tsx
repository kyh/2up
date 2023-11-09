import { classed } from "@/lib/utils/classed";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Icon } from "../icon/icon";
import React from "react";

export const AudioPlayer = (
  props: React.ComponentProps<typeof ReactAudioPlayer>,
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
        volume: (
          <Icon icon="volume" className="child:h-5 child:w-5" size="class" />
        ),
        volumeMute: (
          <Icon
            icon="volumeMute"
            className="child:h-5 child:w-5"
            size="class"
          />
        ),
      }}
      {...props}
    />
  );
};

const StyledAudioPlayer = classed(
  ReactAudioPlayer,
  "min-w-[320px] shadow-none",
);

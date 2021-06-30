import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const AudioPlayer = (rest: any) => {
  return <ReactAudioPlayer className="audio-player" {...rest} />;
};
